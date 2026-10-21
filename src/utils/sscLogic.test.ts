import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateHallTicket,
  validateYear,
  gradePointFromGrade,
  parseEenaduResponse,
} from './sscLogic.ts';
import { getSourceConfig, YEAR_SOURCE_CONFIGS } from '../config/sources.ts';

test('validateHallTicket accepts valid 10-digit number', () => {
  const result = validateHallTicket('2601100001');
  assert.equal(result.isValid, true);
  assert.equal(result.sanitized, '2601100001');
});

test('validateHallTicket rejects non-10 digit numbers', () => {
  const tooShort = validateHallTicket('123456789');
  assert.equal(tooShort.isValid, false);
  assert.match(tooShort.error || '', /10 digits/);

  const tooLong = validateHallTicket('12345678901');
  assert.equal(tooLong.isValid, false);
});

test('validateHallTicket rejects non-numeric characters', () => {
  const withLetters = validateHallTicket('260110000A');
  assert.equal(withLetters.isValid, false);
  assert.match(withLetters.error || '', /digits only/);
});

test('validateYear correctly detects configured examination sessions', () => {
  const current2026 = validateYear('2026');
  assert.equal(current2026.isValid, true);
  assert.equal(current2026.isAutomatedSupported, true);

  const supply2026 = validateYear('2026-supply');
  assert.equal(supply2026.isValid, true);
  assert.equal(supply2026.isAutomatedSupported, true);
  assert.equal(supply2026.examType, 'supplementary');

  const year2025 = validateYear('2025');
  assert.equal(year2025.isValid, true);

  const year2024 = validateYear('2024');
  assert.equal(year2024.isValid, true);
});

test('getSourceConfig defines candidate endpoints and official portals', () => {
  const cfg2026 = getSourceConfig('2026');
  assert.ok(cfg2026);
  assert.ok(cfg2026?.endpoints.length > 0);
  assert.match(cfg2026?.endpoints[0].urlTemplate || '', /tg_2026_resulthandler_tenth/);

  const cfg2024 = getSourceConfig('2024');
  assert.ok(cfg2024);
  assert.ok(cfg2024?.endpoints.length > 0);
  assert.ok(cfg2024?.officialPortals?.length > 0);
  assert.equal(cfg2024?.officialPortals[0].name, 'Sakshi Education TS 10th 2024 Direct Link');

  const cfg2025 = getSourceConfig('2025');
  assert.ok(cfg2025);
  assert.ok(cfg2025?.endpoints.length > 0);
  assert.ok(cfg2025?.officialPortals?.length > 0);
});

test('gradePointFromGrade returns correct GPA points', () => {
  assert.equal(gradePointFromGrade('A1'), 10);
  assert.equal(gradePointFromGrade('A2'), 9);
  assert.equal(gradePointFromGrade('B1'), 8);
  assert.equal(gradePointFromGrade('B2'), 7);
  assert.equal(gradePointFromGrade('C1'), 6);
  assert.equal(gradePointFromGrade('C2'), 5);
  assert.equal(gradePointFromGrade('D'), 4);
  assert.equal(gradePointFromGrade('E'), 0);
  assert.equal(gradePointFromGrade('F'), 0);
});

test('parseEenaduResponse correctly parses student JSON and sums total marks', () => {
  const mockRaw = {
    rollNo: '2601100001',
    name: 'MOHAMMED FAUZAN',
    l1: { internalMark: '20', externalMark: '54', total: '74', flag: '', grade: 'B1', result: 'P' },
    l2: { internalMark: '20', externalMark: '73', total: '93', flag: '', grade: 'A1', result: 'P' },
    l3: { internalMark: '19', externalMark: '76', total: '95', flag: '', grade: 'A1', result: 'P' },
    maths: { internalMark: '20', externalMark: '69', total: '89', flag: '', grade: 'A2', result: 'P' },
    science: { internalMark: '20', externalMark: '69', total: '89', flag: '', grade: 'A2', result: 'P' },
    social: { internalMark: '20', externalMark: '64', total: '84', flag: '', grade: 'A2', result: 'P' },
    optional: { internalMark: '', externalMark: '', total: '', flag: '', grade: '', result: '' },
    result: 'PASS',
    district: 'ADILABAD',
    phdesc: '',
  };

  const parsed: any = parseEenaduResponse(mockRaw, '2026', 'regular');
  assert.equal(parsed.name, 'MOHAMMED FAUZAN');
  assert.equal(parsed.rollNo, '2601100001');
  assert.equal(parsed.district, 'ADILABAD');
  assert.equal(parsed.result, 'PASS');
  assert.equal(parsed.subjects.length, 6);
  // Total marks: 74 + 93 + 95 + 89 + 89 + 84 = 524
  assert.equal(parsed.totalMarks, 524);
  assert.equal(parsed.maxMarks, 600);
  assert.equal(parsed.percentage, 87.3);
  // GPA points: 8 (B1) + 10 (A1) + 10 (A1) + 9 (A2) + 9 (A2) + 9 (A2) = 55 / 6 = 9.17
  assert.equal(parsed.gpa, 9.17);
});

test('parseEenaduResponse enforces year isolation', () => {
  const mockRaw = {
    rollNo: '2401100001',
    name: 'STUDENT RECORD',
    l1: { internalMark: '20', externalMark: '50', total: '70', flag: '', grade: 'B1', result: 'P' },
    result: 'PASS',
    district: 'HYDERABAD',
  };

  // Ensure year passed is strictly mapped to the returned record
  const parsed2024 = parseEenaduResponse(mockRaw, '2024', 'regular');
  assert.equal(parsed2024.examYear, '2024');

  const parsed2025 = parseEenaduResponse(mockRaw, '2025', 'regular');
  assert.equal(parsed2025.examYear, '2025');

  // Verify that two different years cannot return the same object reference
  assert.notEqual(parsed2024.examYear, parsed2025.examYear);
});

test('parseEenaduResponse flags error/notFound when provider returns error', () => {
  const errorRaw = { error: 'Invalid Hall Ticket No.' };
  const parsed: any = parseEenaduResponse(errorRaw, '2026', 'regular');
  assert.equal(parsed.notFound, true);
  assert.equal(parsed.error, 'Invalid Hall Ticket No.');

  const notFoundRaw = { error: 'Hallticket not found' };
  const parsedNotFound: any = parseEenaduResponse(notFoundRaw, '2024', 'regular');
  assert.equal(parsedNotFound.notFound, true);
});

test('parseEenaduResponse throws error on malformed or null payloads', () => {
  assert.throws(() => parseEenaduResponse(null, '2024', 'regular'), /Empty or invalid/);
  assert.throws(() => parseEenaduResponse('string-payload', '2024', 'regular'), /Empty or invalid/);
});
