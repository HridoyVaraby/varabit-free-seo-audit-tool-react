import { useState } from 'react';
import { AuditForm } from '../components/AuditForm';
import { AuditCard } from '../components/AuditCard';
import { PdfDownloadButton } from '../components/PdfDownloadButton';
import { fetchHtml } from '../utils/fetchHtml';
import { parseDom } from '../utils/parseDom';
import { analyzePageSpeed } from '../modules/pageSpeed';
import { analyzeMetaTags } from '../modules/metaTags';
import { analyzeHeadings } from '../modules/headings';
import { analyzeImageAlt } from '../modules/imageAlt';
import { analyzeMobileFriendly } from '../modules/mobileFriendly';
import { analyzeKeywordDensity } from '../modules/keywordDensity';
import type { AuditResult } from '../modules/types';

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [auditedUrl, setAuditedUrl] = useState('');
  const [error, setError] = useState('');

  const runAudit = async (url: string) => {
    setIsLoading(true);
    setError('');
    setResults([]);
    setAuditedUrl(url);

    try {
      const html = await fetchHtml(url);
      const doc = parseDom(html);

      const [pageSpeedResult, metaResult, headingsResult, imageAltResult, mobileResult, keywordResult] = await Promise.all([
        analyzePageSpeed(url),
        Promise.resolve(analyzeMetaTags(doc)),
        Promise.resolve(analyzeHeadings(doc)),
        Promise.resolve(analyzeImageAlt(doc)),
        Promise.resolve(analyzeMobileFriendly(doc)),
        Promise.resolve(analyzeKeywordDensity(doc))
      ]);

      setResults([
        pageSpeedResult,
        metaResult,
        headingsResult,
        imageAltResult,
        mobileResult,
        keywordResult
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during the audit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Varabit SEO Audit</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Analyze any public URL for SEO issues and get actionable insights to improve your website's search engine visibility.
          </p>
        </header>

        <AuditForm onSubmit={runAudit} isLoading={isLoading} />

        {error && (
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-lg shadow-sm">
              <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-700 font-medium">Running SEO audit...</span>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Audit Results</h2>
              <PdfDownloadButton results={results} url={auditedUrl} />
            </div>

            <div className="grid gap-6">
              {results.map((result, index) => (
                <AuditCard key={index} result={result} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <PdfDownloadButton results={results} url={auditedUrl} />
            </div>
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-sm text-slate-600">
          <p className="mb-2">Varabit SEO Audit Tool v1.0.0</p>
          <p className="mb-2">
            Contact:{' '}
            <a href="mailto:support@varabit.com" className="text-blue-600 hover:underline">
              support@varabit.com
            </a>
          </p>
          <p>License: GPL v2 or later</p>
        </footer>
      </div>
    </div>
  );
}
