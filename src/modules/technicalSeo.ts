import type { AuditResult, DetailItem } from './types';

export function analyzeTechnicalSeo(doc: Document, url: string): AuditResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: DetailItem[] = [];

    // Check DOCTYPE
    const hasDoctype = doc.doctype !== null;

    // Check language attribute
    const htmlLang = doc.documentElement?.getAttribute('lang') || '';
    const hasLang = Boolean(htmlLang);

    // Check robots meta
    let robotsMeta = '';
    let hasRobotsMeta = false;
    let isNoindex = false;
    let isNofollow = false;

    try {
        const robotsTag = doc.querySelector('meta[name="robots"]');
        if (robotsTag) {
            hasRobotsMeta = true;
            robotsMeta = robotsTag.getAttribute('content') || '';
            isNoindex = robotsMeta.toLowerCase().includes('noindex');
            isNofollow = robotsMeta.toLowerCase().includes('nofollow');
        }
    } catch {
        // Query failed
    }

    // Check canonical
    let canonical = '';
    let hasCanonical = false;
    let canonicalMatchesUrl = false;

    try {
        const canonicalTag = doc.querySelector('link[rel="canonical"]');
        if (canonicalTag) {
            hasCanonical = true;
            canonical = canonicalTag.getAttribute('href') || '';

            // Check if canonical matches current URL
            try {
                const canonicalUrl = new URL(canonical, url);
                const currentUrl = new URL(url);
                canonicalMatchesUrl = canonicalUrl.href === currentUrl.href;
            } catch {
                // Invalid URL
            }
        }
    } catch {
        // Query failed
    }

    // Check hreflang tags
    let hreflangCount = 0;
    try {
        const hreflangTags = doc.querySelectorAll('link[rel="alternate"][hreflang]');
        hreflangCount = hreflangTags.length;
    } catch {
        // Query failed
    }

    // Check charset
    let hasCharset = false;
    try {
        const charsetMeta = doc.querySelector('meta[charset]') ||
            doc.querySelector('meta[http-equiv="Content-Type"]');
        hasCharset = Boolean(charsetMeta);
    } catch {
        // Query failed
    }

    // Check viewport
    let hasViewport = false;
    try {
        const viewportMeta = doc.querySelector('meta[name="viewport"]');
        hasViewport = Boolean(viewportMeta);
    } catch {
        // Query failed
    }

    // Build details
    details.push({
        label: 'DOCTYPE',
        value: hasDoctype ? 'Present' : 'Missing',
        status: hasDoctype ? 'pass' : 'fail'
    });
    details.push({
        label: 'HTML Language',
        value: htmlLang || 'Not set',
        status: hasLang ? 'pass' : 'warning'
    });
    details.push({
        label: 'Character Encoding',
        value: hasCharset ? 'Defined' : 'Missing',
        status: hasCharset ? 'pass' : 'warning'
    });
    details.push({
        label: 'Viewport Meta',
        value: hasViewport ? 'Present' : 'Missing',
        status: hasViewport ? 'pass' : 'fail'
    });
    details.push({
        label: 'Robots Meta',
        value: hasRobotsMeta ? robotsMeta : 'Not set',
        status: isNoindex ? 'warning' : 'pass'
    });
    details.push({
        label: 'Canonical URL',
        value: hasCanonical ? 'Set' : 'Missing',
        status: hasCanonical ? 'pass' : 'warning'
    });
    details.push({
        label: 'Hreflang Tags',
        value: hreflangCount,
        status: 'pass'
    });

    // Calculate score
    let score = 100;

    if (!hasDoctype) {
        score -= 15;
        issues.push('Missing DOCTYPE declaration');
        suggestions.push('Add <!DOCTYPE html> at the beginning of your HTML');
    }

    if (!hasLang) {
        score -= 10;
        issues.push('Missing lang attribute on HTML element');
        suggestions.push('Add lang="en" (or appropriate language) to <html> tag');
    }

    if (!hasCharset) {
        score -= 10;
        issues.push('Character encoding not specified');
        suggestions.push('Add <meta charset="UTF-8"> to the <head>');
    }

    if (!hasViewport) {
        score -= 20;
        issues.push('Missing viewport meta tag');
        suggestions.push('Add viewport meta tag for mobile responsiveness');
    }

    if (isNoindex) {
        score -= 25;
        issues.push('Page is set to noindex - will not be indexed by search engines');
        suggestions.push('Remove noindex if you want this page to appear in search results');
    }

    if (!hasCanonical) {
        score -= 10;
        issues.push('No canonical URL specified');
        suggestions.push('Add a canonical link to prevent duplicate content issues');
    } else if (!canonicalMatchesUrl && canonical) {
        issues.push('Canonical URL differs from current URL');
        suggestions.push('Verify canonical URL is correct or matches the current page');
    }

    if (isNofollow) {
        issues.push('Page has nofollow directive - links will not pass authority');
        // Not penalizing as this might be intentional
    }

    score = Math.max(0, score);

    return {
        module: 'Technical SEO',
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        score,
        priority: score < 50 ? 'critical' : score < 80 ? 'high' : 'medium',
        category: 'technical',
        summary: `${issues.length === 0 ? 'All checks passed' : `${issues.length} issues found`}`,
        issues,
        suggestions,
        details,
        data: { canonical, robotsMeta, htmlLang, hreflangCount },
    };
}
