import React from 'react';
import { ExternalLink, ShieldCheck, Newspaper, Globe, GraduationCap } from 'lucide-react';

export const OfficialLinksBanner: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm no-print">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Official Portals &amp; Authorized Verification
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Direct portals for Telangana Secondary School Certificate (SSC) examination announcements:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* BSE Telangana */}
        <a
          href="https://bse.telangana.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 font-semibold text-slate-900 group-hover:text-blue-700 text-sm">
              <span className="truncate">BSE Telangana</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              bse.telangana.gov.in
            </p>
            <span className="inline-block text-[11px] font-medium text-slate-600 mt-1">
              Official State Board
            </span>
          </div>
        </a>

        {/* Results BSE Telangana */}
        <a
          href="https://results.bsetelangana.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 font-semibold text-slate-900 group-hover:text-blue-700 text-sm">
              <span className="truncate">TG Results Server</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              results.bsetelangana.org
            </p>
            <span className="inline-block text-[11px] font-medium text-slate-600 mt-1">
              Direct Exam Server
            </span>
          </div>
        </a>

        {/* Sakshi Education 2024 Direct Link */}
        <a
          href="https://education.sakshi.com/sites/default/files/exam-result/TS-10th-Class-Results-2024-direct-link.html"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 rounded-xl border border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50/60 transition-all flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 font-semibold text-slate-900 group-hover:text-blue-700 text-sm">
              <span className="truncate">Sakshi TS 10th 2024</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              education.sakshi.com
            </p>
            <span className="inline-block text-[11px] font-medium text-blue-700 mt-1">
              2024 Direct Link
            </span>
          </div>
        </a>

        {/* Eenadu Results */}
        <a
          href="https://results.eenadu.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
            <Newspaper className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 font-semibold text-slate-900 group-hover:text-blue-700 text-sm">
              <span className="truncate">Eenadu Results</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              results.eenadu.net
            </p>
            <span className="inline-block text-[11px] font-medium text-slate-600 mt-1">
              Live Partner Portal
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};
