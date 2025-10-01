import type { AuditResult } from './types';

interface PageSpeedData {
  mobile: {
    score: number;
    fcp: number;
    lcp: number;
    cls: number;
  };
  desktop: {
    score: number;
    fcp: number;
    lcp: number;
    cls: number;
  };
}

export async function analyzePageSpeed(url: string): Promise<AuditResult> {
  const apiKey = import.meta.env.VITE_PAGESPEED_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return {
      module: 'Page Speed Analysis',
      status: 'warning',
      summary: 'API key not configured',
      issues: ['PageSpeed Insights API key is not set'],
      suggestions: ['Add your Google PageSpeed Insights API key to the .env file'],
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

    const mobileScore = Math.round((mobileData.lighthouseResult?.categories?.performance?.score || 0) * 100);
    const desktopScore = Math.round((desktopData.lighthouseResult?.categories?.performance?.score || 0) * 100);

    const mobileFCP = mobileData.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0;
    const mobileLCP = mobileData.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0;
    const mobileCLS = mobileData.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0;

    const desktopFCP = desktopData.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0;
    const desktopLCP = desktopData.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0;
    const desktopCLS = desktopData.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0;

    const avgScore = (mobileScore + desktopScore) / 2;
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (avgScore < 50) {
      issues.push('Poor performance score');
      suggestions.push('Optimize images, reduce JavaScript execution time, and enable caching');
    } else if (avgScore < 90) {
      issues.push('Moderate performance score');
      suggestions.push('Consider image optimization, minifying CSS/JS, and improving server response time');
    }

    if (mobileLCP > 2500) {
      issues.push('Slow Largest Contentful Paint on mobile');
      suggestions.push('Optimize large images and improve server response time');
    }

    if (mobileCLS > 0.1) {
      issues.push('Layout shift detected on mobile');
      suggestions.push('Add width and height attributes to images and avoid inserting content above existing content');
    }

    const data: PageSpeedData = {
      mobile: {
        score: mobileScore,
        fcp: Math.round(mobileFCP),
        lcp: Math.round(mobileLCP),
        cls: Number(mobileCLS.toFixed(3))
      },
      desktop: {
        score: desktopScore,
        fcp: Math.round(desktopFCP),
        lcp: Math.round(desktopLCP),
        cls: Number(desktopCLS.toFixed(3))
      }
    };

    return {
      module: 'Page Speed Analysis',
      status: avgScore >= 90 ? 'pass' : avgScore >= 50 ? 'warning' : 'fail',
      summary: `Average performance score: ${Math.round(avgScore)}/100`,
      issues,
      suggestions,
      data
    };
  } catch (error) {
    return {
      module: 'Page Speed Analysis',
      status: 'fail',
      summary: 'Failed to analyze page speed',
      issues: [error instanceof Error ? error.message : 'Unknown error'],
      suggestions: ['Check your API key and URL validity']
    };
  }
}
