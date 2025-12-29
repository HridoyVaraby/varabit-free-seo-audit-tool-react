import type { AuditResult, DetailItem } from './types';

interface PageSpeedData {
  mobile: {
    score: number;
    fcp: number;
    lcp: number;
    cls: number;
    tbt: number;
    si: number;
  };
  desktop: {
    score: number;
    fcp: number;
    lcp: number;
    cls: number;
    tbt: number;
    si: number;
  };
}

export async function analyzePageSpeed(url: string): Promise<AuditResult> {
  const apiKey = import.meta.env.VITE_PAGESPEED_API_KEY;
  const details: DetailItem[] = [];

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
    return {
      module: 'Page Speed',
      status: 'warning',
      score: 50,
      priority: 'medium',
      category: 'performance',
      summary: 'PageSpeed API key not configured',
      issues: ['Google PageSpeed Insights API key is not set'],
      suggestions: ['Add VITE_PAGESPEED_API_KEY to your .env file for detailed performance analysis'],
      details: [{ label: 'API Status', value: 'Not configured', status: 'warning' }],
    };
  }

  try {
    const [mobileResponse, desktopResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}`),
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${apiKey}`)
    ]);

    if (!mobileResponse.ok || !desktopResponse.ok) {
      throw new Error('PageSpeed API request failed');
    }

    const mobileData = await mobileResponse.json();
    const desktopData = await desktopResponse.json();

    // Extract scores
    const mobileScore = Math.round((mobileData.lighthouseResult?.categories?.performance?.score || 0) * 100);
    const desktopScore = Math.round((desktopData.lighthouseResult?.categories?.performance?.score || 0) * 100);

    // Extract Core Web Vitals
    const mobileFCP = mobileData.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0;
    const mobileLCP = mobileData.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0;
    const mobileCLS = mobileData.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0;
    const mobileTBT = mobileData.lighthouseResult?.audits?.['total-blocking-time']?.numericValue || 0;
    const mobileSI = mobileData.lighthouseResult?.audits?.['speed-index']?.numericValue || 0;

    const desktopFCP = desktopData.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0;
    const desktopLCP = desktopData.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0;
    const desktopCLS = desktopData.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0;
    const desktopTBT = desktopData.lighthouseResult?.audits?.['total-blocking-time']?.numericValue || 0;
    const desktopSI = desktopData.lighthouseResult?.audits?.['speed-index']?.numericValue || 0;

    const avgScore = Math.round((mobileScore + desktopScore) / 2);
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Build details
    details.push({
      label: 'Mobile Score',
      value: `${mobileScore}/100`,
      status: mobileScore >= 90 ? 'pass' : mobileScore >= 50 ? 'warning' : 'fail'
    });
    details.push({
      label: 'Desktop Score',
      value: `${desktopScore}/100`,
      status: desktopScore >= 90 ? 'pass' : desktopScore >= 50 ? 'warning' : 'fail'
    });
    details.push({
      label: 'First Contentful Paint (Mobile)',
      value: `${(mobileFCP / 1000).toFixed(2)}s`,
      status: mobileFCP <= 1800 ? 'pass' : mobileFCP <= 3000 ? 'warning' : 'fail'
    });
    details.push({
      label: 'Largest Contentful Paint (Mobile)',
      value: `${(mobileLCP / 1000).toFixed(2)}s`,
      status: mobileLCP <= 2500 ? 'pass' : mobileLCP <= 4000 ? 'warning' : 'fail'
    });
    details.push({
      label: 'Cumulative Layout Shift (Mobile)',
      value: mobileCLS.toFixed(3),
      status: mobileCLS <= 0.1 ? 'pass' : mobileCLS <= 0.25 ? 'warning' : 'fail'
    });
    details.push({
      label: 'Total Blocking Time (Mobile)',
      value: `${Math.round(mobileTBT)}ms`,
      status: mobileTBT <= 200 ? 'pass' : mobileTBT <= 600 ? 'warning' : 'fail'
    });
    details.push({
      label: 'Speed Index (Mobile)',
      value: `${(mobileSI / 1000).toFixed(2)}s`,
      status: mobileSI <= 3400 ? 'pass' : mobileSI <= 5800 ? 'warning' : 'fail'
    });

    // Generate issues and suggestions
    if (avgScore < 50) {
      issues.push('Poor overall performance score');
      suggestions.push('Optimize images, reduce JavaScript, and enable caching');
    } else if (avgScore < 90) {
      issues.push('Moderate performance - room for improvement');
      suggestions.push('Consider image optimization and code splitting');
    }

    if (mobileLCP > 2500) {
      issues.push(`Slow LCP on mobile: ${(mobileLCP / 1000).toFixed(2)}s (target: <2.5s)`);
      suggestions.push('Optimize largest content element, use preload for critical resources');
    }

    if (mobileCLS > 0.1) {
      issues.push(`High layout shift: ${mobileCLS.toFixed(3)} (target: <0.1)`);
      suggestions.push('Add size attributes to images, avoid inserting content above existing content');
    }

    if (mobileTBT > 200) {
      issues.push(`High blocking time: ${Math.round(mobileTBT)}ms (target: <200ms)`);
      suggestions.push('Reduce JavaScript execution time, split long tasks');
    }

    if (mobileScore < 50) {
      issues.push('Critical mobile performance issues');
      suggestions.push('Mobile optimization is crucial for SEO - prioritize mobile performance');
    }

    const data: PageSpeedData = {
      mobile: {
        score: mobileScore,
        fcp: Math.round(mobileFCP),
        lcp: Math.round(mobileLCP),
        cls: Number(mobileCLS.toFixed(3)),
        tbt: Math.round(mobileTBT),
        si: Math.round(mobileSI),
      },
      desktop: {
        score: desktopScore,
        fcp: Math.round(desktopFCP),
        lcp: Math.round(desktopLCP),
        cls: Number(desktopCLS.toFixed(3)),
        tbt: Math.round(desktopTBT),
        si: Math.round(desktopSI),
      }
    };

    return {
      module: 'Page Speed',
      status: avgScore >= 90 ? 'pass' : avgScore >= 50 ? 'warning' : 'fail',
      score: avgScore,
      priority: avgScore < 50 ? 'critical' : avgScore < 80 ? 'high' : 'medium',
      category: 'performance',
      summary: `Mobile: ${mobileScore}/100, Desktop: ${desktopScore}/100`,
      issues,
      suggestions,
      details,
      data,
    };
  } catch (error) {
    return {
      module: 'Page Speed',
      status: 'fail',
      score: 0,
      priority: 'high',
      category: 'performance',
      summary: 'Failed to analyze page speed',
      issues: [error instanceof Error ? error.message : 'Unknown error'],
      suggestions: ['Check your API key and URL validity'],
      details: [{ label: 'Error', value: 'API request failed', status: 'fail' }],
    };
  }
}
