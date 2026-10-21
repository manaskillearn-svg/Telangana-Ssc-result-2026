export interface SubjectRecord {
  id: string;
  name: string;
  code?: string;
  internalMark: string | number;
  externalMark: string | number;
  total: number;
  grade: string;
  result: 'P' | 'F' | 'PASSED' | 'FAILED' | string;
}

export interface StudentResult {
  rollNo: string;
  name: string;
  district: string;
  phdesc?: string;
  result: string; // 'PASS' | 'FAIL' | 'COMPARTMENTAL' etc.
  examYear: string;
  examType: string; // 'regular' | 'supplementary'
  subjects: SubjectRecord[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  gpa?: number;
  verifiedSource: string;
  fetchedAt: string;
}

export interface PortalLink {
  name: string;
  url: string;
  isPrimary?: boolean;
}

export interface DiagnosticInfo {
  year: string;
  requestedSource: string;
  httpStatus?: number;
  parsingStatus?: 'success' | 'failed' | 'not_applicable';
  notes?: string;
}

export interface SscResultResponse {
  success: boolean;
  data?: StudentResult;
  notFound?: boolean;
  requiresOfficialPortal?: boolean;
  message?: string;
  officialUrl?: string;
  providerUrl?: string;
  providerName?: string;
  portalLinks?: PortalLink[];
  yearId?: string;
  yearStatus?: 'active' | 'archived' | 'unavailable';
  diagnostics?: DiagnosticInfo;
}
