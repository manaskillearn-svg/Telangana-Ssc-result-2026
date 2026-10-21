import { YEAR_SOURCE_CONFIGS, getSourceConfig } from '../config/sources.ts';
import type { ResultSourceConfig } from '../config/sources.ts';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export interface YearValidationResult {
  isValid: boolean;
  error?: string;
  isAutomatedSupported: boolean;
  examType: 'regular' | 'supplementary';
  label: string;
  config?: ResultSourceConfig;
}

export const SUPPORTED_EXAM_YEARS = Object.values(YEAR_SOURCE_CONFIGS).map((cfg) => ({
  value: cfg.id,
  label: cfg.label,
  isAutomated: cfg.id.startsWith('2026'),
  examType: cfg.examType,
}));

/**
 * Validates Telangana SSC Hall Ticket Number.
 * In Telangana State Board of Secondary Education, hall tickets are 10-digit numerical identifiers.
 */
export function validateHallTicket(hallTicket: string | unknown): ValidationResult {
  if (typeof hallTicket !== 'string' && typeof hallTicket !== 'number') {
    return { isValid: false, error: 'Please enter a valid hall ticket number.' };
  }

  const sanitized = String(hallTicket).trim();

  if (!sanitized) {
    return { isValid: false, error: 'Hall ticket number is required.' };
  }

  if (!/^\d+$/.test(sanitized)) {
    return { isValid: false, error: 'Hall ticket number must contain digits only.' };
  }

  if (sanitized.length !== 10) {
    return {
      isValid: false,
      error: `Telangana SSC hall ticket must be 10 digits (currently ${sanitized.length} digits).`,
    };
  }

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * Validates examination year selection against configured sources.
 */
export function validateYear(yearInput: string | unknown): YearValidationResult {
  if (typeof yearInput !== 'string' && typeof yearInput !== 'number') {
    return {
      isValid: false,
      error: 'Please select an examination year.',
      isAutomatedSupported: false,
      examType: 'regular',
      label: '',
    };
  }

  const yearStr = String(yearInput).trim();
  const config = getSourceConfig(yearStr);

  if (config) {
    return {
      isValid: true,
      isAutomatedSupported: config.id.startsWith('2026') || config.endpoints.length > 0,
      examType: config.examType,
      label: config.label,
      config,
    };
  }

  // Handle arbitrary 4-digit years between 2010 and 2030 as historical archives
  if (/^\d{4}$/.test(yearStr)) {
    const num = parseInt(yearStr, 10);
    if (num >= 2010 && num <= 2030) {
      return {
        isValid: true,
        isAutomatedSupported: false,
        examType: 'regular',
        label: `${yearStr} Examination`,
      };
    }
  }

  return {
    isValid: false,
    error: 'Please choose a valid examination year from the list.',
    isAutomatedSupported: false,
    examType: 'regular',
    label: '',
  };
}

/**
 * Maps standard Telangana SSC grade to grade points (10-point scale).
 */
export function gradePointFromGrade(grade: string): number {
  const g = (grade || '').trim().toUpperCase();
  switch (g) {
    case 'A1':
      return 10;
    case 'A2':
      return 9;
    case 'B1':
      return 8;
    case 'B2':
      return 7;
    case 'C1':
      return 6;
    case 'C2':
      return 5;
    case 'D':
      return 4;
    case 'E':
    case 'F':
      return 0;
    default:
      return 0;
  }
}

/**
 * Normalizes subject names and figures from provider.
 * Enforces year isolation: ensures the parsed result is strictly assigned to the requested examYear.
 */
export function parseEenaduResponse(
  raw: any,
  examYear: string,
  examType: string
) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Empty or invalid response from result provider.');
  }

  if (raw.error) {
    return {
      error: raw.error,
      notFound: raw.error.toLowerCase().includes('invalid') || raw.error.toLowerCase().includes('not found'),
    };
  }

  const rawSubjects = [
    { id: 'l1', name: 'Language - I (First Language)', data: raw.l1 },
    { id: 'l2', name: 'Language - II (Second Language)', data: raw.l2 },
    { id: 'l3', name: 'Language - III (English)', data: raw.l3 },
    { id: 'maths', name: 'Mathematics', data: raw.maths },
    { id: 'science', name: 'General Science', data: raw.science },
    { id: 'social', name: 'Social Studies', data: raw.social },
    { id: 'optional', name: 'Optional Subject', data: raw.optional },
  ];

  const subjects = [];
  let totalMarks = 0;
  let totalGradePoints = 0;
  let gradedSubjectCount = 0;

  for (const item of rawSubjects) {
    const d = item.data;
    if (!d) continue;

    const hasAny =
      (d.internalMark && String(d.internalMark).trim() !== '') ||
      (d.externalMark && String(d.externalMark).trim() !== '') ||
      (d.total && String(d.total).trim() !== '') ||
      (d.grade && String(d.grade).trim() !== '');

    if (!hasAny) continue;

    const tot = parseInt(d.total, 10) || 0;
    totalMarks += tot;

    const grade = (d.grade || '').trim();
    if (grade) {
      totalGradePoints += gradePointFromGrade(grade);
      gradedSubjectCount++;
    }

    subjects.push({
      id: item.id,
      name: item.name,
      internalMark: d.internalMark !== undefined && d.internalMark !== null && d.internalMark !== '' ? d.internalMark : '-',
      externalMark: d.externalMark !== undefined && d.externalMark !== null && d.externalMark !== '' ? d.externalMark : '-',
      total: tot,
      grade: grade || '-',
      result: (d.result || '').trim().toUpperCase() === 'P' ? 'PASSED' : (d.result || 'P'),
    });
  }

  const maxMarks = subjects.length * 100;
  const percentage = maxMarks > 0 ? parseFloat(((totalMarks / maxMarks) * 100).toFixed(1)) : 0;
  const gpa = gradedSubjectCount > 0 ? parseFloat((totalGradePoints / gradedSubjectCount).toFixed(2)) : undefined;

  return {
    rollNo: String(raw.rollNo || '').trim(),
    name: String(raw.name || '').trim(),
    district: String(raw.district || '').trim(),
    phdesc: raw.phdesc ? String(raw.phdesc).trim() : undefined,
    result: String(raw.result || 'PASS').trim().toUpperCase(),
    examYear,
    examType: examType === 'supplementary' ? 'Supplementary' : 'Annual Regular',
    subjects,
    totalMarks,
    maxMarks,
    percentage,
    gpa,
    verifiedSource: 'Eenadu Results Portal (results.eenadu.net)',
    fetchedAt: new Date().toISOString(),
  };
}
