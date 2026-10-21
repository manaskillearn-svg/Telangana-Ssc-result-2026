export interface PortalLink {
  name: string;
  url: string;
  isPrimary?: boolean;
}

export interface EndpointConfig {
  provider: string;
  urlTemplate: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  parserType: 'eenadu-ashx' | 'standard-json';
  timeoutMs?: number;
}

export interface ResultSourceConfig {
  id: string;
  label: string;
  sessionName: string;
  examType: 'regular' | 'supplementary';
  endpoints: EndpointConfig[];
  officialPortals: PortalLink[];
  notes: string;
}

export const YEAR_SOURCE_CONFIGS: Record<string, ResultSourceConfig> = {
  '2026': {
    id: '2026',
    label: '2026 - March / Annual Regular',
    sessionName: 'March 2026 Regular Examination',
    examType: 'regular',
    endpoints: [
      {
        provider: 'Eenadu Results Portal',
        urlTemplate: 'https://results.eenadu.net/handlers/tg_2026_resulthandler_tenth.ashx?ht={HT}',
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Referer': 'https://results.eenadu.net/',
        },
        parserType: 'eenadu-ashx',
        timeoutMs: 6000,
      },
    ],
    officialPortals: [
      { name: 'BSE Telangana (Main)', url: 'https://bse.telangana.gov.in/', isPrimary: true },
      { name: 'TG SSC Results Server', url: 'https://results.bsetelangana.org/' },
      { name: 'Eenadu Results Portal', url: 'https://results.eenadu.net/' },
    ],
    notes: 'Active verified public JSON handler on results.eenadu.net with full subject marks and grades.',
  },
  '2026-supply': {
    id: '2026-supply',
    label: '2026 - Supplementary (ASE)',
    sessionName: 'June/July 2026 Supplementary Examination',
    examType: 'supplementary',
    endpoints: [
      {
        provider: 'Eenadu Results Portal',
        urlTemplate: 'https://results.eenadu.net/handlers/tg_2026_resulthandler_tenth_supply.ashx?ht={HT}',
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Referer': 'https://results.eenadu.net/',
        },
        parserType: 'eenadu-ashx',
        timeoutMs: 6000,
      },
    ],
    officialPortals: [
      { name: 'BSE Telangana (Main)', url: 'https://bse.telangana.gov.in/', isPrimary: true },
      { name: 'Eenadu Supplementary Results', url: 'https://results.eenadu.net/exam-results/telangana-ssc-supplementary-results-2026' },
    ],
    notes: 'Active verified public JSON handler on results.eenadu.net for 2026 supplementary exams.',
  },
  '2025': {
    id: '2025',
    label: '2025 - Annual Regular',
    sessionName: 'March 2025 Regular Examination',
    examType: 'regular',
    endpoints: [
      {
        provider: 'Eenadu Results Portal (2025 Handler)',
        urlTemplate: 'https://results.eenadu.net/handlers/tg_2025_resulthandler_tenth.ashx?ht={HT}',
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Referer': 'https://results.eenadu.net/',
        },
        parserType: 'eenadu-ashx',
        timeoutMs: 4000,
      },
    ],
    officialPortals: [
      { name: 'BSE Telangana (Official Archive)', url: 'https://bse.telangana.gov.in/', isPrimary: true },
      { name: 'TG SSC Results Server', url: 'https://results.bsetelangana.org/' },
      { name: 'Eenadu Results Portal', url: 'https://results.eenadu.net/' },
    ],
    notes: 'Historical 2025 examination session. Candidate automated source checked; official board verification provided.',
  },
  '2024': {
    id: '2024',
    label: '2024 - Annual Regular',
    sessionName: 'March 2024 Regular Examination',
    examType: 'regular',
    endpoints: [
      {
        provider: 'Sakshi Education 2024 Direct Portal',
        urlTemplate: 'https://education.sakshi.com/sites/default/files/exam-result/TS-10th-Class-Results-2024-direct-link.html',
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Referer': 'https://education.sakshi.com/',
        },
        parserType: 'standard-json',
        timeoutMs: 3000,
      },
      {
        provider: 'Eenadu Results Portal (2024 Handler)',
        urlTemplate: 'https://results.eenadu.net/handlers/tg_2024_resulthandler_tenth.ashx?ht={HT}',
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Referer': 'https://results.eenadu.net/',
        },
        parserType: 'eenadu-ashx',
        timeoutMs: 3000,
      },
    ],
    officialPortals: [
      {
        name: 'Sakshi Education TS 10th 2024 Direct Link',
        url: 'https://education.sakshi.com/sites/default/files/exam-result/TS-10th-Class-Results-2024-direct-link.html',
        isPrimary: true,
      },
      { name: 'BSE Telangana (Official Archive)', url: 'https://bse.telangana.gov.in/' },
      { name: 'TG SSC Results Server', url: 'https://results.bsetelangana.org/' },
      { name: 'Eenadu Results Portal', url: 'https://results.eenadu.net/' },
    ],
    notes: 'Historical 2024 examination session. Direct portal provided via Sakshi Education 2024 direct link and BSE Telangana archives.',
  },
  '2023': {
    id: '2023',
    label: '2023 - Annual Regular',
    sessionName: 'March 2023 Regular Examination',
    examType: 'regular',
    endpoints: [],
    officialPortals: [
      { name: 'BSE Telangana (Official Archive)', url: 'https://bse.telangana.gov.in/', isPrimary: true },
    ],
    notes: 'Historical 2023 examination session.',
  },
  '2022': {
    id: '2022',
    label: '2022 - Annual Regular',
    sessionName: 'May/June 2022 Regular Examination',
    examType: 'regular',
    endpoints: [],
    officialPortals: [
      { name: 'BSE Telangana (Official Archive)', url: 'https://bse.telangana.gov.in/', isPrimary: true },
    ],
    notes: 'Historical 2022 examination session.',
  },
};

export function getSourceConfig(yearId: string): ResultSourceConfig | undefined {
  return YEAR_SOURCE_CONFIGS[yearId];
}

export function getAllConfiguredYears(): { value: string; label: string }[] {
  return Object.values(YEAR_SOURCE_CONFIGS).map((cfg) => ({
    value: cfg.id,
    label: cfg.label,
  }));
}
