import React from 'react';
import { ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onGradingClick: () => void;
  onResetToSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGradingClick, onResetToSearch }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onResetToSearch}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          aria-label="Mana Skill Home"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm shadow-blue-700/20 group-hover:bg-blue-800 transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap">
                Mana Skill
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                TG SSC
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-medium hidden xs:block">
              Telangana SSC Result Portal
            </p>
          </div>
        </button>

        {/* Zone 2: Single-line Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700" aria-label="Main Navigation">
          <button
            onClick={onResetToSearch}
            className="hover:text-blue-700 transition-colors whitespace-nowrap text-slate-800 font-semibold"
          >
            Telangana SSC Results
          </button>
          <button
            onClick={onGradingClick}
            className="hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            Grading Scale
          </button>
          <a
            href="https://results.eenadu.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors inline-flex items-center gap-1 whitespace-nowrap"
          >
            Eenadu Results
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href="https://bse.telangana.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors inline-flex items-center gap-1 whitespace-nowrap"
          >
            BSE Telangana
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2">
          <a
            href="https://bse.telangana.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            aria-label="Open Official BSE Telangana Website"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Official BSE Website</span>
            <span className="sm:hidden">Official Site</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>
    </header>
  );
};
