import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { ResultSearchForm } from './components/ResultSearchForm';
import { MarksMemo } from './components/MarksMemo';
import {
  LoadingCard,
  NotFoundAlert,
  HistoricalUnavailableAlert,
  InvalidHallTicketAlert,
  ErrorAlert,
} from './components/StatusAlerts';
import { OfficialLinksBanner } from './components/OfficialLinksBanner';
import { GradingGuide } from './components/GradingGuide';
import { Footer } from './components/Footer';
import { StudentResult, SscResultResponse } from './types/result';

export default function App() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [currentQueryHt, setCurrentQueryHt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StudentResult | null>(null);

  const [notFound, setNotFound] = useState<{
    message: string;
    officialUrl?: string;
    providerUrl?: string;
  } | null>(null);

  const [invalidFormat, setInvalidFormat] = useState<{
    message: string;
  } | null>(null);

  const [historicalUnavailable, setHistoricalUnavailable] = useState<{
    message: string;
    yearId?: string;
    officialUrl?: string;
    providerUrl?: string;
    portalLinks?: SscResultResponse['portalLinks'];
    diagnostics?: SscResultResponse['diagnostics'];
  } | null>(null);

  const [error, setError] = useState<{
    message: string;
    officialUrl?: string;
    diagnostics?: SscResultResponse['diagnostics'];
  } | null>(null);

  const [isGradingOpen, setIsGradingOpen] = useState(false);

  const resultContainerRef = useRef<HTMLDivElement>(null);

  // Clear all states whenever examination year changes to maintain absolute year isolation
  const handleYearChange = (newYear: string) => {
    setSelectedYear(newYear);
    setResult(null);
    setNotFound(null);
    setInvalidFormat(null);
    setHistoricalUnavailable(null);
    setError(null);
  };

  const handleSearch = async (hallTicket: string, year: string) => {
    setIsLoading(true);
    setCurrentQueryHt(hallTicket);
    // Explicit year & cache isolation: wipe any prior output
    setResult(null);
    setNotFound(null);
    setInvalidFormat(null);
    setHistoricalUnavailable(null);
    setError(null);

    try {
      const response = await fetch('/api/ssc-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hallTicket,
          year,
        }),
      });

      const data: SscResultResponse = await response.json();

      // 1. Invalid hall ticket format
      if (response.status === 400 && data.message?.toLowerCase().includes('digit')) {
        setInvalidFormat({
          message: data.message || 'Please enter a valid 10-digit hall ticket number.',
        });
        setTimeout(() => {
          resultContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
      }

      // 2. Result not found in examination database
      if (data.notFound) {
        setNotFound({
          message: data.message || `No result found for Hall Ticket ${hallTicket}.`,
          officialUrl: data.officialUrl || 'https://bse.telangana.gov.in/',
          providerUrl: data.providerUrl || 'https://results.eenadu.net/',
        });
        setTimeout(() => {
          resultContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
      }

      // 3. Historical source unavailable / requires official board portal
      if (data.requiresOfficialPortal) {
        setHistoricalUnavailable({
          message: data.message || `Automated online lookup for ${year} is unavailable. Please verify directly on the official board portal.`,
          yearId: data.yearId || year,
          officialUrl: data.officialUrl || 'https://bse.telangana.gov.in/',
          providerUrl: data.providerUrl || 'https://results.eenadu.net/',
          portalLinks: data.portalLinks,
          diagnostics: data.diagnostics,
        });
        setTimeout(() => {
          resultContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
      }

      // 4. Server or provider error
      if (!response.ok || !data.success || !data.data) {
        setError({
          message: data.message || 'Unable to retrieve result at this time. Please try again or check official portals.',
          officialUrl: data.officialUrl || 'https://bse.telangana.gov.in/',
          diagnostics: data.diagnostics,
        });
        setTimeout(() => {
          resultContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
      }

      // 5. Success with strict year isolation validation
      if (data.data.examYear !== year && !data.data.examYear.includes(year)) {
        console.error(`Received result for unexpected year ${data.data.examYear} when searching for ${year}`);
        setError({
          message: 'Received an mismatched examination record. Please try your search again.',
          officialUrl: 'https://bse.telangana.gov.in/',
        });
        return;
      }

      setResult(data.data);

      setTimeout(() => {
        resultContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Network error checking SSC result:', err);
      setError({
        message: 'Could not connect to the result server. Please check your internet connection or try again.',
        officialUrl: 'https://bse.telangana.gov.in/',
      });
      setTimeout(() => {
        resultContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAnother = () => {
    setResult(null);
    setNotFound(null);
    setInvalidFormat(null);
    setHistoricalUnavailable(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToCurrentYear = () => {
    setSelectedYear('2026');
    setHistoricalUnavailable(null);
    setNotFound(null);
    setInvalidFormat(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Header Navigation */}
      <Header
        onGradingClick={() => setIsGradingOpen(true)}
        onResetToSearch={handleCheckAnother}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Search Input Form */}
        <section aria-label="Hall Ticket Search Form">
          <ResultSearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </section>

        {/* Dynamic Result or Status Display Area */}
        <div ref={resultContainerRef} className="scroll-mt-20">
          {isLoading && (
            <LoadingCard hallTicket={currentQueryHt} year={selectedYear} />
          )}

          {!isLoading && invalidFormat && (
            <InvalidHallTicketAlert
              message={invalidFormat.message}
              onRetry={handleCheckAnother}
            />
          )}

          {!isLoading && notFound && (
            <NotFoundAlert
              message={notFound.message}
              officialUrl={notFound.officialUrl}
              providerUrl={notFound.providerUrl}
              onRetry={handleCheckAnother}
            />
          )}

          {!isLoading && historicalUnavailable && (
            <HistoricalUnavailableAlert
              message={historicalUnavailable.message}
              yearId={historicalUnavailable.yearId}
              officialUrl={historicalUnavailable.officialUrl}
              providerUrl={historicalUnavailable.providerUrl}
              portalLinks={historicalUnavailable.portalLinks}
              diagnostics={historicalUnavailable.diagnostics}
              onRetry={() => handleSearch(currentQueryHt, selectedYear)}
              onResetToCurrent={handleResetToCurrentYear}
            />
          )}

          {!isLoading && error && (
            <ErrorAlert
              message={error.message}
              officialUrl={error.officialUrl}
              diagnostics={error.diagnostics}
              onRetry={() => handleSearch(currentQueryHt, selectedYear)}
            />
          )}

          {!isLoading && result && (
            <MarksMemo
              result={result}
              onCheckAnother={handleCheckAnother}
              officialUrl="https://bse.telangana.gov.in/"
              providerUrl="https://results.eenadu.net/exam-results/telangana-10th-results-2026"
            />
          )}
        </div>

        {/* Official Links & Trust Verification */}
        <OfficialLinksBanner />
      </main>

      {/* Grading Guide Modal */}
      <GradingGuide
        isOpen={isGradingOpen}
        onClose={() => setIsGradingOpen(false)}
      />

      {/* Footer */}
      <Footer onGradingClick={() => setIsGradingOpen(true)} />
    </div>
  );
}
