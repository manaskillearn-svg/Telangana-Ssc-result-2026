import React from 'react';
import { ShieldCheck, GraduationCap } from 'lucide-react';

interface FooterProps {
  onGradingClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGradingClick }) => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-8 px-4 text-xs text-slate-500 no-print">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-700 text-white flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800">
            Mana Skill · Telangana SSC Result Checker
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
          <button
            onClick={onGradingClick}
            className="hover:text-blue-700 transition-colors"
          >
            Grading Scale
          </button>
          <span>·</span>
          <a
            href="https://bse.telangana.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors"
          >
            BSE Telangana
          </a>
          <span>·</span>
          <a
            href="https://results.eenadu.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors"
          >
            Eenadu Results
          </a>
        </div>

        <div className="text-[11px] text-slate-400">
          Educational tool by Mana Skill. Results fetched from verified servers.
        </div>
      </div>
    </footer>
  );
};
