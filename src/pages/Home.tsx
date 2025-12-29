import { useState } from 'react';
import {
  Zap,
  Search,
  FileText,
  Smartphone,
  Image,
  Type,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AuditForm } from '../components/AuditForm';
import { AuditCard } from '../components/AuditCard';
import { PdfDownloadButton } from '../components/PdfDownloadButton';
import { ScoreCircle } from '../components/ScoreCircle';
import { FeatureCard } from '../components/FeatureCard';
import { fetchHtml } from '../utils/fetchHtml';
import { parseDom } from '../utils/parseDom';
import { analyzePageSpeed } from '../modules/pageSpeed';
import { analyzeMetaTags } from '../modules/metaTags';
import { analyzeHeadings } from '../modules/headings';
import { analyzeImageAlt } from '../modules/imageAlt';
import { analyzeMobileFriendly } from '../modules/mobileFriendly';
import { analyzeKeywordDensity } from '../modules/keywordDensity';
import type { AuditResult } from '../modules/types';

const features = [
  {
    icon: Zap,
    title: 'Page Speed Analysis',
    description: 'Get Core Web Vitals metrics using Google PageSpeed Insights API.',
  },
  {
    icon: FileText,
    title: 'Meta Tags Check',
    description: 'Analyze title, description, Open Graph, and canonical tags.',
  },
  {
    icon: Type,
    title: 'Heading Structure',
    description: 'Verify proper heading hierarchy from H1 to H6.',
  },
  {
    icon: Image,
    title: 'Image Accessibility',
    description: 'Check for missing alt attributes on all images.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-Friendliness',
    description: 'Validate viewport meta tag and responsive design.',
  },
  {
    icon: Search,
    title: 'Keyword Density',
    description: 'Analyze content length and keyword distribution.',
  },
];

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [auditedUrl, setAuditedUrl] = useState('');
  const [error, setError] = useState('');

  const calculateOverallScore = (results: AuditResult[]): number => {
    if (results.length === 0) return 0;
    const scoreMap = { pass: 100, warning: 65, fail: 30 };
    const total = results.reduce((sum, r) => sum + scoreMap[r.status], 0);
    return Math.round(total / results.length);
  };

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

  const overallScore = calculateOverallScore(results);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-[120px] opacity-50" />

        <div className="section relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <span className="text-sm text-accent-primary font-medium">Free SEO Analysis Tool</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-display-lg font-display font-bold text-content-primary mb-6 animate-slide-up">
              Analyze Your Website's{' '}
              <span className="gradient-text">SEO Performance</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-content-secondary max-w-2xl mx-auto mb-10 animate-slide-up animation-delay-100">
              Get actionable insights on page speed, meta tags, headings, mobile-friendliness,
              and more. Improve your search engine rankings today.
            </p>

            {/* Audit Form */}
            <div className="animate-slide-up animation-delay-200">
              <AuditForm onSubmit={runAudit} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="section -mt-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-accent-error/10 border border-accent-error/30 rounded-xl p-4 animate-fade-in">
              <p className="text-accent-error font-medium">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="section py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card inline-flex items-center gap-4 px-8 py-4">
              <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-content-primary font-medium">Analyzing {auditedUrl}...</span>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <section className="section py-12 lg:py-20">
          {/* Results Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-content-primary mb-4">
              Audit Results
            </h2>
            <p className="text-content-secondary mb-8">
              Analysis complete for <span className="text-accent-primary font-medium">{auditedUrl}</span>
            </p>

            {/* Overall Score */}
            <div className="inline-flex flex-col items-center card p-8">
              <ScoreCircle score={overallScore} size="lg" label="Overall Score" />
              <p className="mt-4 text-content-secondary text-sm">
                {overallScore >= 80 ? 'Great job! Your site is well-optimized.' :
                  overallScore >= 50 ? 'Good progress. Some improvements needed.' :
                    'Needs attention. Review the issues below.'}
              </p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid gap-4 lg:gap-6 max-w-4xl mx-auto">
            {results.map((result, index) => (
              <AuditCard key={index} result={result} index={index} />
            ))}
          </div>

          {/* Download Button */}
          <div className="flex justify-center mt-12">
            <PdfDownloadButton results={results} url={auditedUrl} />
          </div>
        </section>
      )}

      {/* Features Section - Only show when no results */}
      {results.length === 0 && !isLoading && (
        <section className="section py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-content-primary mb-4">
              What We Analyze
            </h2>
            <p className="text-content-secondary max-w-xl mx-auto">
              Our comprehensive SEO audit covers all critical aspects of your website's
              search engine optimization.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-content-secondary mb-4">
              Ready to improve your website's SEO?
            </p>
            <a href="#" className="btn-primary inline-flex" onClick={(e) => {
              e.preventDefault();
              document.querySelector('input')?.focus();
            }}>
              <span>Start Your Free Audit</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
