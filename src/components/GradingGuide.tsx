import React from 'react';
import { X, Award, HelpCircle, Check, Info } from 'lucide-react';

interface GradingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradingGuide: React.FC<GradingGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const gradingScale = [
    { grade: 'A1', marks: '91 - 100', gpa: '10', desc: 'Outstanding' },
    { grade: 'A2', marks: '81 - 90', gpa: '9', desc: 'Excellent' },
    { grade: 'B1', marks: '71 - 80', gpa: '8', desc: 'Very Good' },
    { grade: 'B2', marks: '61 - 70', gpa: '7', desc: 'Good' },
    { grade: 'C1', marks: '51 - 60', gpa: '6', desc: 'Above Average' },
    { grade: 'C2', marks: '41 - 50', gpa: '5', desc: 'Average' },
    { grade: 'D', marks: '35 - 40', gpa: '4', desc: 'Pass / Marginal' },
    { grade: 'E', marks: 'Below 35', gpa: '0', desc: 'Failed / Needs Improvement' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="grading-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 id="grading-modal-title" className="text-lg font-bold text-slate-900">
                TS SSC Grading System
              </h2>
              <p className="text-xs text-slate-500">
                Board of Secondary Education Telangana 10-Point GPA Scheme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Close grading guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grading Table */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3">Marks Range</th>
                  <th className="py-2.5 px-3 text-center">Grade Points</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {gradingScale.map((row) => (
                  <tr key={row.grade} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      {row.grade}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700">
                      {row.marks}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-center text-slate-900">
                      {row.gpa}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1.5">
            <p className="font-semibold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Passing Criteria &amp; Mark Distribution:</span>
            </p>
            <p className="text-blue-800 leading-relaxed">
              • Each curricular subject is evaluated out of 100 marks: 20 marks Formative/Internal Assessment and 80 marks Board Summative Examination.
            </p>
            <p className="text-blue-800 leading-relaxed">
              • Minimum qualifying mark is 35% in each subject (minimum 28 out of 80 in external board theory).
            </p>
            <p className="text-blue-800 leading-relaxed">
              • Second Language (Telugu/Hindi) requires a minimum of 20% to qualify in specific streams as per board regulations.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full min-h-[44px] py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
