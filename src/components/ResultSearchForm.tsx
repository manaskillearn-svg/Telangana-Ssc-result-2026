import React, { useState } from 'react';
import { Search, Loader2, Sparkles, X, Info } from 'lucide-react';
import { SUPPORTED_EXAM_YEARS, validateHallTicket } from '../utils/sscLogic';

interface ResultSearchFormProps {
  onSearch: (hallTicket: string, year: string) => Promise<void>;
  isLoading: boolean;
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export const ResultSearchForm: React.FC<ResultSearchFormProps> = ({
  onSearch,
  isLoading,
  selectedYear,
  onYearChange,
}) => {
  const [hallTicket, setHallTicket] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateHallTicket(hallTicket);
    if (!result.isValid) {
      setValidationError(result.error || 'Please enter a valid 10-digit hall ticket number.');
      return;
    }
    setValidationError(null);
    onSearch(result.sanitized!, selectedYear);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only numbers and max 10 digits
    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
    setHallTicket(clean);
    if (validationError && clean.length === 10) {
      setValidationError(null);
    }
  };

  const handleClear = () => {
    setHallTicket('');
    setValidationError(null);
  };

  const handleUseSample = (sampleHt: string = '2601100001') => {
    setHallTicket(sampleHt);
    setValidationError(null);
  };

  const currentYearObj = SUPPORTED_EXAM_YEARS.find((y) => y.value === selectedYear);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 md:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Official Examination Portal
          </span>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Board of Secondary Education, Telangana
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Telangana SSC Results
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Secondary School Certificate (Class 10) Public Examination Results
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Examination Year Dropdown */}
          <div>
            <label
              htmlFor="examination-year"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Examination Year &amp; Session
            </label>
            <div className="relative">
              <select
                id="examination-year"
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                disabled={isLoading}
                className="w-full min-h-[48px] px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer text-sm sm:text-base disabled:opacity-60"
              >
                {SUPPORTED_EXAM_YEARS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>
            {currentYearObj && !currentYearObj.isAutomated && (
              <p className="mt-1.5 text-xs text-blue-700 flex items-center gap-1 font-medium">
                <Info className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                <span>Historical session: Probes candidate feeds and connects to official board archive for {currentYearObj.value}.</span>
              </p>
            )}
          </div>

          {/* Hall Ticket Number Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="hall-ticket"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Hall Ticket Number
              </label>
              <span className="text-xs font-mono text-slate-600 font-medium">
                {hallTicket.length}/10 digits
              </span>
            </div>
            <div className="relative">
              <input
                id="hall-ticket"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={hallTicket}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="10-digit Hall Ticket No."
                aria-invalid={!!validationError}
                aria-describedby={validationError ? 'ht-error' : 'ht-hint'}
                className={`w-full min-h-[48px] pl-4 pr-10 py-2.5 bg-slate-50 focus:bg-white text-slate-900 font-mono tracking-wider font-semibold rounded-xl border transition-all text-base focus:outline-none focus:ring-2 disabled:opacity-60 ${
                  validationError
                    ? 'border-red-400 focus:ring-red-500'
                    : 'border-slate-200 focus:ring-blue-600 focus:border-transparent'
                }`}
              />
              {hallTicket && !isLoading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
                  aria-label="Clear Hall Ticket input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {validationError ? (
              <p id="ht-error" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                {validationError}
              </p>
            ) : (
              <p id="ht-hint" className="mt-1.5 text-xs text-slate-600">
                10-digit number printed on your TS SSC Examination Hall Ticket / Admit Card.
              </p>
            )}
          </div>
        </div>

        {/* Quick Sample Button & Submission */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span>Try sample roll:</span>
            <button
              type="button"
              onClick={() => handleUseSample('2601100001')}
              disabled={isLoading}
              className="px-2.5 py-1 font-mono font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors text-xs inline-flex items-center gap-1"
              title="Use sample hall ticket 2601100001"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              2601100001
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !hallTicket.trim()}
            className="min-h-[48px] px-7 py-3 text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-md shadow-blue-700/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Checking Result...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Check Result</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security & Data Integrity Assurance */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Verified direct retrieval via Eenadu Results Portal</span>
        </span>
        <span>Mana Skill does not store hall tickets or personal records.</span>
      </div>
    </div>
  );
};
