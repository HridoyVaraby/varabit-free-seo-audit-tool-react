import { useState } from 'react';
import {
  Zap,
  FileText,
  Smartphone,
  Type,
  ArrowRight,
  Sparkles,
  Link2,
  Code,
  Share2,
  Shield,
  BookOpen,
  Settings,
  Accessibility
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
import { analyzeLinks } from '../modules/linksAnalysis';
import { analyzeSchemaMarkup } from '../modules/schemaMarkup';
import { analyzeSocialTags } from '../modules/socialTags';
import { analyzeSecuritySeo } from '../modules/securitySeo';
import { analyzeContentQuality } from '../modules/contentQuality';
import { analyzeTechnicalSeo } from '../modules/technicalSeo';
import { analyzeAccessibility } from '../modules/accessibilityAdvanced';
import type { AuditResult, AuditCategory } from '../modules/types';

const features = [
  {
    icon: Zap,
    title: 'Page Speed Analysis',
    description: 'Core Web Vitals: FCP, LCP, CLS, TBT using Google PageSpeed API.',
  },
  {
    icon: FileText,
    title: 'Meta Tags & Content',
    description: 'Title, description, Open Graph, and content quality analysis.',
  },
  {
    icon: Type,
    title: 'Heading Structure',
    description: 'H1-H6 hierarchy, empty headings, and keyword usage.',
  },
  {
    icon: Link2,
    title: 'Links Analysis',
    description: 'Internal/external links, nofollow, broken links detection.',
  },
  {
    icon: Code,
    title: 'Schema & Technical',
    description: 'JSON-LD structured data, robots meta, canonical URLs.',
  },
  {
    icon: Share2,
    title: 'Social Media Tags',
    description: 'Open Graph and Twitter Card optimization.',
  },
  {
    icon: Shield,
    title: 'Security Checks',
    description: 'HTTPS, mixed content, and external link security.',
  },
  {
    icon: Accessibility,
    title: 'Accessibility',
    description: 'Alt text, form labels, ARIA, semantic HTML.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-Friendliness',
    description: 'Viewport, responsive design, and tap targets.',
  },
];

const CATEGORY_CONFIG: Record<AuditCategory, { label: string; icon: typeof Zap }> = {
  performance: { label: 'Performance', icon: Zap },
  content: { label: 'Content', icon: BookOpen },
  technical: { label: 'Technical', icon: Settings },
  social: { label: 'Social', icon: Share2 },
  accessibility: { label: 'Accessibility', icon: Accessibility },
  security: { label: 'Security', icon: Shield },
};

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [auditedUrl, setAuditedUrl] = useState('');
  const [error, setError] = useState('');

  const calculateOverallScore = (results: AuditResult[]): number => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + r.score, 0);
    return Math.round(total / results.length);
  };

  const getCategoryScores = (results: AuditResult[]): Record<AuditCategory, number> => {
    const categories: Record<AuditCategory, number[]> = {
      performance: [],
      content: [],
      technical: [],
      social: [],
      accessibility: [],
      security: [],
    };

    results.forEach(r => {
      if (categories[r.category]) {
        categories[r.category].push(r.score);
      }
    });

    const scores: Record<AuditCategory, number> = {} as Record<AuditCategory, number>;
    Object.entries(categories).forEach(([cat, scores_arr]) => {
      scores[cat as AuditCategory] = scores_arr.length > 0
        ? Math.round(scores_arr.reduce((a, b) => a + b, 0) / scores_arr.length)
        : 0;
    });

    return scores;
  };

  const runAudit = async (url: string) => {
    setIsLoading(true);
    setError('');
    setResults([]);
    setAuditedUrl(url);

    try {
      const html = await fetchHtml(url);
      const doc = parseDom(html);

      // Run all audit modules
      const [
        pageSpeedResult,
        metaResult,
        headingsResult,
        imageAltResult,
        mobileResult,
        keywordResult,
        linksResult,
        schemaResult,
        socialResult,
        securityResult,
        contentResult,
        technicalResult,
        accessibilityResult
      ] = await Promise.all([
        analyzePageSpeed(url),
        Promise.resolve(analyzeMetaTags(doc)),
        Promise.resolve(analyzeHeadings(doc)),
        Promise.resolve(analyzeImageAlt(doc)),
        Promise.resolve(analyzeMobileFriendly(doc)),
        Promise.resolve(analyzeKeywordDensity(doc)),
        Promise.resolve(analyzeLinks(doc, url)),
        Promise.resolve(analyzeSchemaMarkup(doc)),
        Promise.resolve(analyzeSocialTags(doc)),
        Promise.resolve(analyzeSecuritySeo(doc, url)),
        Promise.resolve(analyzeContentQuality(doc)),
        Promise.resolve(analyzeTechnicalSeo(doc, url)),
        Promise.resolve(analyzeAccessibility(doc))
      ]);

      // Order results by priority: critical > high > medium > low
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const allResults = [
        pageSpeedResult,
        metaResult,
        headingsResult,
        imageAltResult,
        mobileResult,
        keywordResult,
        linksResult,
        schemaResult,
        socialResult,
        securityResult,
        contentResult,
        technicalResult,
        accessibilityResult
      ].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      setResults(allResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during the audit');
    } finally {
      setIsLoading(false);
    }
  };

  const overallScore = calculateOverallScore(results);
  const categoryScores = getCategoryScores(results);

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
              <span className="text-sm text-accent-primary font-medium">Comprehensive SEO Analysis</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-display-lg font-display font-bold text-content-primary mb-6 animate-slide-up">
              Professional{' '}
              <span className="gradient-text">SEO Audit Tool</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-content-secondary max-w-2xl mx-auto mb-10 animate-slide-up animation-delay-100">
              Get detailed insights across 13 SEO factors: page speed, meta tags, links,
              schema markup, security, accessibility, and more.
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
              <p className="text-accent-error font-medium whitespace-pre-line">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="section py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card inline-flex flex-col items-center gap-4 px-8 py-6">
              <div className="w-8 h-8 border-3 border-accent-primary border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-content-primary font-medium">Analyzing {auditedUrl}</p>
                <p className="text-sm text-content-tertiary mt-1">Running 13 SEO checks across 6 categories...</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <section className="section py-12 lg:py-20">
          {/* Results Header with Overall Score */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-content-primary mb-4">
              SEO Audit Results
            </h2>
            <p className="text-content-secondary mb-8">
              Comprehensive analysis for <span className="text-accent-primary font-medium">{auditedUrl}</span>
            </p>

            {/* Overall Score + Category Scores */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {/* Main Score */}
              <div className="card p-6 inline-flex flex-col items-center">
                <ScoreCircle score={overallScore} size="lg" label="Overall Score" />
                <p className="mt-4 text-content-secondary text-sm max-w-[200px]">
                  {overallScore >= 80 ? 'Great job! Your site is well-optimized.' :
                    overallScore >= 50 ? 'Good progress. Some improvements needed.' :
                      'Needs attention. Review the issues below.'}
                </p>
              </div>

              {/* Category Scores */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-content-secondary mb-4 uppercase tracking-wide">Category Scores</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(categoryScores).map(([cat, score]) => {
                    const config = CATEGORY_CONFIG[cat as AuditCategory];
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <ScoreCircle score={score} size="sm" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-content-primary">{config.label}</p>
                          <p className="text-xs text-content-tertiary">{score}/100</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 text-center">
              <p className="text-2xl font-display font-bold text-content-primary">{results.length}</p>
              <p className="text-sm text-content-tertiary">Checks Run</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-display font-bold text-accent-primary">{results.filter(r => r.status === 'pass').length}</p>
              <p className="text-sm text-content-tertiary">Passed</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-display font-bold text-accent-warning">{results.filter(r => r.status === 'warning').length}</p>
              <p className="text-sm text-content-tertiary">Warnings</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-display font-bold text-accent-error">{results.filter(r => r.status === 'fail').length}</p>
              <p className="text-sm text-content-tertiary">Failed</p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid gap-4 lg:gap-6">
            {results.map((result, index) => (
              <AuditCard key={result.module} result={result} index={index} />
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
              13 comprehensive SEO checks across 6 categories to give you actionable insights.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 50}
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
