import React, { useState } from 'react';
import {
  Printer,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Share2,
  LayoutGrid,
  Table as TableIcon,
  BookOpen,
} from 'lucide-react';
import { StudentResult } from '../types/result';

interface MarksMemoProps {
  result: StudentResult;
  onCheckAnother: () => void;
  officialUrl?: string;
  providerUrl?: string;
}

export const MarksMemo: React.FC<MarksMemoProps> = ({
  result,
  onCheckAnother,
  officialUrl = 'https://bse.telangana.gov.in/',
  providerUrl = 'https://results.eenadu.net/',
}) => {
  const isPassed = result.result.toUpperCase().includes('PASS');
  const [copied, setCopied] = useState(false);
  const [mobileView, setMobileView] = useState<'cards' | 'table'>('table');

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `Telangana SSC Result - Roll: ${result.rollNo}, Name: ${result.name}, Result: ${result.result}, Total: ${result.totalMarks}/${result.maxMarks} (${result.percentage}%)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Telangana SSC Result - Mana Skill',
          text,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Result Memo Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print-container">
        {/* Memo Official Header */}
        <div className="bg-blue-700 text-white p-5 sm:p-7 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-600/80 pb-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-blue-100">
                  Government of Telangana · Directorate of Government Examinations
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                  Telangana State SSC Public Examinations
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 font-medium mt-0.5">
                  Provisional Marks Memorandum · Session {result.examYear} ({result.examType})
                </p>
              </div>

              {/* Final Result Badge */}
              <div className="self-start sm:self-center">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm tracking-wide shadow-sm ${
                    isPassed
                      ? 'bg-emerald-600 text-white border border-emerald-400'
                      : 'bg-rose-600 text-white border border-rose-400'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  <span>{result.result}</span>
                </div>
              </div>
            </div>

            {/* Student Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-xs sm:text-sm">
              <div className="bg-blue-800/40 rounded-xl p-2.5 sm:p-3 border border-blue-600/40">
                <span className="text-blue-200 text-[11px] font-medium block uppercase tracking-wider">
                  Student Name
                </span>
                <span className="font-bold text-white text-sm sm:text-base break-words block mt-0.5 leading-snug">
                  {result.name || 'N/A'}
                </span>
              </div>

              <div className="bg-blue-800/40 rounded-xl p-2.5 sm:p-3 border border-blue-600/40">
                <span className="text-blue-200 text-[11px] font-medium block uppercase tracking-wider">
                  Hall Ticket No.
                </span>
                <span className="font-bold text-white text-sm sm:text-base font-mono tracking-wider block mt-0.5">
                  {result.rollNo}
                </span>
              </div>

              <div className="bg-blue-800/40 rounded-xl p-2.5 sm:p-3 border border-blue-600/40">
                <span className="text-blue-200 text-[11px] font-medium block uppercase tracking-wider">
                  District / Division
                </span>
                <span className="font-bold text-white text-sm sm:text-base break-words block mt-0.5">
                  {result.district || 'TELANGANA'}
                </span>
              </div>

              <div className="bg-blue-800/40 rounded-xl p-2.5 sm:p-3 border border-blue-600/40">
                <span className="text-blue-200 text-[11px] font-medium block uppercase tracking-wider">
                  Exam Session
                </span>
                <span className="font-bold text-white text-sm sm:text-base block mt-0.5">
                  {result.examYear} {result.examType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 sm:px-7 grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Grand Total</span>
            <span className="text-lg sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {result.totalMarks} <span className="text-xs sm:text-sm font-normal text-slate-500">/ {result.maxMarks}</span>
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium block">Percentage</span>
            <span className="text-lg sm:text-2xl font-extrabold text-blue-700 font-mono tabular-nums">
              {result.percentage}%
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium block">Grade Points / GPA</span>
            <span className="text-lg sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {result.gpa !== undefined ? `${result.gpa} / 10` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Subject-wise Marks Section */}
        <div className="p-4 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Subject-wise Marks &amp; Grades
              </h3>
              <p className="text-xs text-slate-500">
                Max per subject: 100 (20 Internal + 80 Board Theory)
              </p>
            </div>

            {/* Mobile View Toggle */}
            <div className="sm:hidden no-print flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setMobileView('table')}
                className={`min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1 ${
                  mobileView === 'table' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileView('cards')}
                className={`min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1 ${
                  mobileView === 'cards' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>

          {/* Mobile Card Breakdown View (Accessible on phone screens) */}
          <div className={`sm:hidden space-y-2.5 mb-4 ${mobileView === 'cards' ? 'block' : 'hidden'}`}>
            {result.subjects.map((sub, index) => {
              const subPassed = sub.result.toUpperCase().startsWith('P');
              return (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{sub.name}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded ${
                        subPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {sub.result}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-200 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Internal</span>
                      <span className="font-mono font-semibold text-slate-800 text-xs tabular-nums">
                        {sub.internalMark}/20
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Board</span>
                      <span className="font-mono font-semibold text-slate-800 text-xs tabular-nums">
                        {sub.externalMark}/80
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold text-blue-700">Total</span>
                      <span className="font-mono font-extrabold text-blue-700 text-sm tabular-nums">
                        {sub.total}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Grade</span>
                      <span className="font-mono font-bold text-slate-900 text-xs px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                        {sub.grade}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Container (Visible on desktop or when Table view selected on mobile) */}
          <div className={`${mobileView === 'cards' ? 'hidden sm:block' : 'block'}`}>
            <div className="overflow-x-auto -mx-4 sm:mx-0 border-y sm:border border-slate-200 sm:rounded-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                    <th scope="col" className="py-3 px-3 sm:px-4">#</th>
                    <th scope="col" className="py-3 px-3 sm:px-4 min-w-[140px]">Subject Name</th>
                    <th scope="col" className="py-3 px-2 sm:px-3 text-center whitespace-nowrap">Internal (20)</th>
                    <th scope="col" className="py-3 px-2 sm:px-3 text-center whitespace-nowrap">Board (80)</th>
                    <th scope="col" className="py-3 px-2 sm:px-3 text-center whitespace-nowrap">Total (100)</th>
                    <th scope="col" className="py-3 px-2 sm:px-3 text-center">Grade</th>
                    <th scope="col" className="py-3 px-3 sm:px-4 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.subjects.map((sub, index) => {
                    const subPassed = sub.result.toUpperCase().startsWith('P');
                    return (
                      <tr
                        key={sub.id}
                        className={index % 2 === 0 ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/50 hover:bg-slate-50'}
                      >
                        <td className="py-3 px-3 sm:px-4 font-mono text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900">
                          {sub.name}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-center font-mono tabular-nums text-slate-600">
                          {sub.internalMark}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-center font-mono tabular-nums text-slate-600">
                          {sub.externalMark}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-center font-mono font-bold text-slate-900 tabular-nums">
                          {sub.total}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-center">
                          <span className="inline-block px-2 py-0.5 text-xs font-bold font-mono rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded ${
                              subPassed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {sub.result}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={4} className="py-3 px-3 sm:px-4 text-right">
                      Grand Total Marks:
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-center font-mono text-base text-blue-800 tabular-nums">
                      {result.totalMarks} / {result.maxMarks}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-center font-mono text-blue-800">
                      {result.percentage}%
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {result.result}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="sm:hidden text-[11px] text-slate-400 text-right mt-1.5 font-medium">
              Swipe left/right on table to view full columns →
            </p>
          </div>

          {result.phdesc && (
            <p className="mt-3 text-xs text-slate-500 font-medium">
              Special Category / PH: {result.phdesc}
            </p>
          )}

          {/* Verification Source Attribution */}
          <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Verified Source: <strong className="text-slate-800">{result.verifiedSource}</strong>
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Fetched: {new Date(result.fetchedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar (Hidden when printing) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onCheckAnother}
            className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Check Another Hall Ticket</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-sm transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Marks Memo</span>
          </button>

          <button
            onClick={handleShare}
            className="min-h-[44px] px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
            title="Share or copy result summary"
          >
            <Share2 className="w-4 h-4" />
            <span className="sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Official Links */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Verify on BSE Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href={providerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>Eenadu Results</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
