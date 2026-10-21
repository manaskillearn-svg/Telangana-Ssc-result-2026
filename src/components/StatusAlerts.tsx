import React from 'react';
import {
  ExternalLink,
  ShieldAlert,
  Archive,
  RefreshCw,
  Search,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { PortalLink, DiagnosticInfo } from '../types/result';

interface LoadingStateProps {
  hallTicket: string;
  year: string;
}

export const LoadingCard: React.FC<LoadingStateProps> = ({ hallTicket, year }) => (
  <div
    role="status"
    aria-live="polite"
    className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm"
  >
    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center animate-pulse">
      <RefreshCw className="w-7 h-7 animate-spin" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
      Querying Telangana SSC Results Server...
    </h3>
    <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
      Verifying Hall Ticket <strong className="font-mono text-slate-900">{hallTicket}</strong> for examination session{' '}
      <strong className="text-slate-900">{year}</strong> with authorized sources.
    </p>
    <div className="mt-6 max-w-sm mx-auto space-y-2.5">
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-700 rounded-full animate-[shimmer_1.5s_infinite] w-2/3"></div>
      </div>
      <p className="text-xs text-slate-600 font-medium">Please wait a few seconds...</p>
    </div>
  </div>
);

interface InvalidHallTicketAlertProps {
  message: string;
  onRetry: () => void;
}

export const InvalidHallTicketAlert: React.FC<InvalidHallTicketAlertProps> = ({ message, onRetry }) => (
  <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 uppercase tracking-wider mb-2 border border-rose-100">
          Invalid Hall Ticket Format
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Check Hall Ticket Number
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {message}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Telangana SSC Public Examination hall tickets are strictly 10-digit numerical identifiers printed on your official examination admit card.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onRetry}
            className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface NotFoundAlertProps {
  message: string;
  onRetry: () => void;
  officialUrl?: string;
  providerUrl?: string;
}

export const NotFoundAlert: React.FC<NotFoundAlertProps> = ({
  message,
  onRetry,
  officialUrl = 'https://bse.telangana.gov.in/',
  providerUrl = 'https://results.eenadu.net/',
}) => (
  <div className="bg-white rounded-2xl border border-amber-200 p-6 sm:p-8 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
        <Search className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 uppercase tracking-wider mb-2 border border-amber-200/60">
          Record Not Found
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          No Result Found for This Hall Ticket
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {message}
        </p>

        <div className="mt-4 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
          <p className="font-semibold">Verification checklist:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
            <li>Check that all 10 digits match the hall ticket printed on your admit card.</li>
            <li>Confirm you have selected the correct examination year and session (Regular vs. Supplementary).</li>
            <li>If your result was withheld or marks are under review, contact your school headmaster or BSE Telangana.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onRetry}
            className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Try Again
          </button>
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Open Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={providerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-700 bg-white border border-slate-200 rounded-xl inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Eenadu Results</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

interface HistoricalUnavailableAlertProps {
  message: string;
  yearId?: string;
  officialUrl?: string;
  providerUrl?: string;
  portalLinks?: PortalLink[];
  diagnostics?: DiagnosticInfo;
  onRetry: () => void;
  onResetToCurrent: () => void;
}

export const HistoricalUnavailableAlert: React.FC<HistoricalUnavailableAlertProps> = ({
  message,
  yearId,
  officialUrl = 'https://bse.telangana.gov.in/',
  providerUrl = 'https://results.eenadu.net/',
  portalLinks,
  diagnostics,
  onRetry,
  onResetToCurrent,
}) => (
  <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
        <Archive className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 uppercase tracking-wider mb-2 border border-blue-100">
          {yearId ? `Session ${yearId} Official Archive` : 'Historical Examination Archive'}
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Official Board Verification Required
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {message}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Historical examination records for earlier academic years are preserved on the official Board of Secondary Education Telangana portal. Please use the official links below to query the board archive directly.
        </p>

        {diagnostics?.notes && (
          <div className="mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>{diagnostics.notes}</span>
          </div>
        )}

        {/* Dynamic portal links */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {portalLinks && portalLinks.length > 0 ? (
            portalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm ${
                  link.isPrimary
                    ? 'text-white bg-blue-700 hover:bg-blue-800'
                    : 'text-slate-800 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <span>{link.name}</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>
            ))
          ) : (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Open Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={onRetry}
            className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={onResetToCurrent}
            className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Select Current Year (2026)
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  officialUrl?: string;
  diagnostics?: DiagnosticInfo;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  officialUrl = 'https://bse.telangana.gov.in/',
  diagnostics,
}) => (
  <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 uppercase tracking-wider mb-2 border border-rose-100">
          Connection Notice
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Unable to Connect to Result Server
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {message}
        </p>

        {diagnostics?.notes && (
          <p className="mt-2 text-xs text-rose-700 font-mono">
            Provider note: {diagnostics.notes}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onRetry}
            className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Open Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
);
