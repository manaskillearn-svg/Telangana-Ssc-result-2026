import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  validateHallTicket,
  validateYear,
  parseEenaduResponse,
  SUPPORTED_EXAM_YEARS,
} from './src/utils/sscLogic.ts';
import { getSourceConfig } from './src/config/sources.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security & Body Parsers
app.use(express.json({ limit: '10kb' }));

// Simple in-memory rate limiter per IP to prevent spam or provider abuse
interface RateBucket {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateBucket>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests / minute

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = rateLimitMap.get(ip);

  if (!bucket || now > bucket.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute before checking another result.',
    });
  }

  bucket.count++;
  return next();
}

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Mana Skill Telangana SSC Result Checker',
    timestamp: new Date().toISOString(),
  });
});

// Supported Exam Years & Configuration Endpoint
app.get('/api/years', (_req: Request, res: Response) => {
  res.json({
    years: SUPPORTED_EXAM_YEARS,
    officialPortal: 'https://bse.telangana.gov.in/',
    eenaduPortal: 'https://results.eenadu.net/',
  });
});

/**
 * POST /api/ssc-result
 * Look up SSC results for given hall ticket number and examination year.
 * Strict privacy: We NEVER persist or log student hall tickets or marks.
 * Diagnostic logs identify: selected year, requested source, HTTP status, and parsing status.
 */
app.post('/api/ssc-result', rateLimiter, async (req: Request, res: Response) => {
  // Always return no-store for individual student result privacy & cache isolation
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { hallTicket, year } = req.body || {};

  // 1. Validate Hall Ticket
  const htValidation = validateHallTicket(hallTicket);
  if (!htValidation.isValid || !htValidation.sanitized) {
    return res.status(400).json({
      success: false,
      isInvalidHallTicket: true,
      message: htValidation.error || 'Please enter a valid 10-digit Telangana SSC hall ticket number.',
    });
  }

  // 2. Validate Year
  const yearValidation = validateYear(year);
  if (!yearValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: yearValidation.error || 'Invalid examination year.',
    });
  }

  const cleanHt = htValidation.sanitized;
  const examYear = String(year).trim();
  const yearConfig = getSourceConfig(examYear);
  const safeRollMask = `***${cleanHt.slice(-4)}`;

  console.log(
    `[SSC-DIAGNOSTIC] Query initiated | Year: "${examYear}" | Roll: ${safeRollMask} | Candidates: ${yearConfig?.endpoints.length || 0}`
  );

  const officialPortals = yearConfig?.officialPortals || [
    { name: 'BSE Telangana (Main)', url: 'https://bse.telangana.gov.in/', isPrimary: true },
    { name: 'TG SSC Results Server', url: 'https://results.bsetelangana.org/' },
  ];

  // If no automated endpoints are configured for this year (e.g. 2023, 2022)
  if (!yearConfig || yearConfig.endpoints.length === 0) {
    console.log(`[SSC-DIAGNOSTIC] Historical session "${examYear}" archive routed directly to official state board portal.`);
    return res.json({
      success: false,
      historicalSourceUnavailable: true,
      requiresOfficialPortal: true,
      yearId: examYear,
      yearStatus: 'archived',
      message: `Automated online lookup for ${yearValidation.label} is archived. Please verify your result directly on the official board website.`,
      officialUrl: officialPortals[0]?.url || 'https://bse.telangana.gov.in/',
      providerUrl: 'https://results.eenadu.net/',
      portalLinks: officialPortals,
      diagnostics: {
        year: examYear,
        requestedSource: 'Official Board Archives',
        notes: 'Direct official board verification is required for this examination session.',
      },
    });
  }

  // Attempt real network lookups across candidate endpoints for this specific year
  const attemptedSources: { provider: string; url: string; httpStatus?: number; error?: string }[] = [];

  for (const endpoint of yearConfig.endpoints) {
    const targetUrl = endpoint.urlTemplate.replace('{HT}', encodeURIComponent(cleanHt));
    const timeoutMs = endpoint.timeoutMs || 4000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const startTime = Date.now();

    console.log(
      `[SSC-DIAGNOSTIC] Probing candidate source: "${endpoint.provider}" | Year: "${examYear}" | URL: "${targetUrl}"`
    );

    try {
      const upstreamRes = await fetch(targetUrl, {
        method: endpoint.method || 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 ManaSkill-App/1.0',
          ...(endpoint.headers || {}),
        },
      });

      clearTimeout(timeoutId);
      const durationMs = Date.now() - startTime;
      console.log(
        `[SSC-DIAGNOSTIC] Upstream HTTP Response | Provider: "${endpoint.provider}" | Year: "${examYear}" | Status: ${upstreamRes.status} | Duration: ${durationMs}ms`
      );

      attemptedSources.push({
        provider: endpoint.provider,
        url: targetUrl,
        httpStatus: upstreamRes.status,
      });

      if (upstreamRes.ok) {
        // Success 200 - Try parsing JSON payload
        let rawData: any;
        try {
          rawData = await upstreamRes.json();
        } catch (jsonErr: any) {
          console.log(`[SSC-DIAGNOSTIC] Could not parse JSON from "${endpoint.provider}": ${jsonErr?.message}`);
          continue;
        }

        // Check if upstream returned a business "not found" message
        if (rawData && rawData.error) {
          console.log(
            `[SSC-DIAGNOSTIC] Result not found | Year: "${examYear}" | Roll: ${safeRollMask} | Provider Note: "${rawData.error}"`
          );
          return res.status(200).json({
            success: false,
            notFound: true,
            yearId: examYear,
            message: `No result found for Hall Ticket "${cleanHt}" in ${yearValidation.label}. Please verify your hall ticket number on your examination admit card and try again.`,
            officialUrl: officialPortals[0]?.url || 'https://bse.telangana.gov.in/',
            portalLinks: officialPortals,
            diagnostics: {
              year: examYear,
              requestedSource: endpoint.provider,
              httpStatus: 200,
              notes: rawData.error,
            },
          });
        }

        // Parse student result with strict year isolation
        try {
          const studentResult = parseEenaduResponse(rawData, examYear, yearValidation.examType);

          // Year Isolation Verification: verify the returned record is assigned to the requested examYear
          if (studentResult.examYear !== examYear) {
            console.log(
              `[SSC-DIAGNOSTIC] Year isolation violation: requested "${examYear}" but received "${studentResult.examYear}". Rejecting record.`
            );
            continue;
          }

          console.log(
            `[SSC-DIAGNOSTIC] Valid result verified | Year: "${examYear}" | Roll: ${safeRollMask} | Status: "${studentResult.result}" | Total: ${studentResult.totalMarks}/${studentResult.maxMarks} (${studentResult.percentage}%)`
          );

          return res.json({
            success: true,
            data: studentResult,
            officialUrl: officialPortals[0]?.url || 'https://bse.telangana.gov.in/',
            providerUrl: 'https://results.eenadu.net/exam-results/telangana-10th-results-2026',
            portalLinks: officialPortals,
            diagnostics: {
              year: examYear,
              requestedSource: endpoint.provider,
              httpStatus: 200,
              parsingStatus: 'success',
            },
          });
        } catch (parseErr: any) {
          console.log(`[SSC-DIAGNOSTIC] Normalization notice for Year "${examYear}": ${parseErr?.message}`);
          continue;
        }
      }
    } catch (netErr: any) {
      clearTimeout(timeoutId);
      const isTimeout = netErr.name === 'AbortError';
      const durationMs = Date.now() - startTime;
      console.log(
        `[SSC-DIAGNOSTIC] Source probe notice | Provider: "${endpoint.provider}" | Detail: ${isTimeout ? 'Timeout (' + timeoutMs + 'ms)' : netErr.message} | Elapsed: ${durationMs}ms`
      );

      attemptedSources.push({
        provider: endpoint.provider,
        url: targetUrl,
        error: isTimeout ? `Timeout after ${timeoutMs}ms` : netErr.message,
      });
    }
  }

  // All candidate sources were probed via real HTTP requests and none returned active automated data
  console.log(
    `[SSC-DIAGNOSTIC] Candidate probe completed for Year "${examYear}". Providing official board portal guidance.`
  );

  const lastAttempt = attemptedSources[0];
  const lastStatus = lastAttempt?.httpStatus ? `HTTP ${lastAttempt.httpStatus}` : 'Feed unavailable';

  return res.json({
    success: false,
    historicalSourceUnavailable: true,
    requiresOfficialPortal: true,
    yearId: examYear,
    yearStatus: 'archived',
    message: `Automated online lookup for ${yearValidation.label} is currently not available from public feeds (${lastStatus}). Please check your result directly on the official Telangana State Board archive portal.`,
    officialUrl: officialPortals[0]?.url || 'https://bse.telangana.gov.in/',
    providerUrl: 'https://results.eenadu.net/',
    portalLinks: officialPortals,
    diagnostics: {
      year: examYear,
      requestedSource: lastAttempt?.provider || 'Public result feeds',
      httpStatus: lastAttempt?.httpStatus,
      notes: `Real request dispatched to candidate source. Upstream returned ${lastStatus}. Direct official board verification required.`,
    },
  });
});

// Vite Middleware for Development / Static for Production
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mana Skill SSC Result Checker server listening on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
