import type { AuditResult, DetailItem } from './types';

export function analyzeSecuritySeo(doc: Document, url: string): AuditResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: DetailItem[] = [];

    let isHttps = false;
    try {
        isHttps = new URL(url).protocol === 'https:';
    } catch {
        // Invalid URL
    }

    // Check for mixed content indicators
    let mixedContentPotential = 0;
    let externalLinksChecked = 0;
    let linksWithoutSecurityRel = 0;

    try {
        // Check images for HTTP src
        const images = doc.querySelectorAll('img[src^="http://"]');
        mixedContentPotential += images.length;

        // Check scripts for HTTP src
        const scripts = doc.querySelectorAll('script[src^="http://"]');
        mixedContentPotential += scripts.length;

        // Check stylesheets for HTTP href
        const stylesheets = doc.querySelectorAll('link[rel="stylesheet"][href^="http://"]');
        mixedContentPotential += stylesheets.length;

        // Check external links for security attributes
        const externalLinks = doc.querySelectorAll('a[href^="http"]');
        externalLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            const rel = link.getAttribute('rel') || '';

            try {
                const linkUrl = new URL(href);
                const pageUrl = new URL(url);

                if (linkUrl.hostname !== pageUrl.hostname) {
                    externalLinksChecked++;
                    if (!rel.includes('noopener') && !rel.includes('noreferrer')) {
                        linksWithoutSecurityRel++;
                    }
                }
            } catch {
                // Invalid URL
            }
        });

        // Check for form security
        const forms = doc.querySelectorAll('form');
        let insecureForms = 0;
        forms.forEach((form) => {
            const action = form.getAttribute('action') || '';
            if (action.startsWith('http://')) {
                insecureForms++;
            }
        });

        if (insecureForms > 0) {
            issues.push(`${insecureForms} form(s) submit to insecure HTTP URLs`);
            suggestions.push('Update form actions to use HTTPS');
        }

    } catch {
        // Query failed
    }

    // Build details
    details.push({
        label: 'HTTPS',
        value: isHttps ? 'Yes' : 'No',
        status: isHttps ? 'pass' : 'fail',
        description: 'Page served over secure connection'
    });

    details.push({
        label: 'Mixed Content Risk',
        value: mixedContentPotential === 0 ? 'None' : `${mixedContentPotential} potential issues`,
        status: mixedContentPotential === 0 ? 'pass' : 'warning'
    });

    details.push({
        label: 'External Links Checked',
        value: externalLinksChecked,
        status: 'pass'
    });

    details.push({
        label: 'Links Without noopener',
        value: linksWithoutSecurityRel,
        status: linksWithoutSecurityRel === 0 ? 'pass' : 'warning'
    });

    // Calculate score
    let score = 100;

    if (!isHttps) {
        score -= 40;
        issues.push('Page is not served over HTTPS');
        suggestions.push('Migrate to HTTPS for security and SEO benefits');
    }

    if (mixedContentPotential > 0) {
        score -= Math.min(20, mixedContentPotential * 5);
        issues.push(`${mixedContentPotential} resources loaded over HTTP (mixed content)`);
        suggestions.push('Update all resource URLs to use HTTPS');
    }

    if (linksWithoutSecurityRel > 0) {
        score -= Math.min(15, linksWithoutSecurityRel * 2);
        issues.push(`${linksWithoutSecurityRel} external links without rel="noopener"`);
        suggestions.push('Add rel="noopener noreferrer" to external links');
    }

    score = Math.max(0, score);

    return {
        module: 'Security & SEO',
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        score,
        priority: score < 50 ? 'critical' : score < 80 ? 'high' : 'low',
        category: 'security',
        summary: isHttps ? 'HTTPS enabled' : 'HTTPS not enabled',
        issues,
        suggestions,
        details,
    };
}
