import type { AuditResult, DetailItem } from './types';

interface LinkInfo {
    href: string;
    text: string;
    isExternal: boolean;
    hasNofollow: boolean;
    hasNoopener: boolean;
    isValid: boolean;
}

export function analyzeLinks(doc: Document, baseUrl: string): AuditResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: DetailItem[] = [];

    let links: NodeListOf<HTMLAnchorElement>;
    try {
        links = doc.querySelectorAll('a[href]');
    } catch {
        return {
            module: 'Links Analysis',
            status: 'fail',
            score: 0,
            priority: 'high',
            category: 'technical',
            summary: 'Failed to analyze links',
            issues: ['Unable to parse document links'],
            suggestions: ['Ensure valid HTML structure'],
        };
    }

    const linkData: LinkInfo[] = [];
    let internalLinks = 0;
    let externalLinks = 0;
    let nofollowLinks = 0;
    let emptyLinks = 0;
    let linksWithoutText = 0;
    let javascriptLinks = 0;
    let linksWithoutNoopener = 0;

    let baseHostname = '';
    try {
        baseHostname = new URL(baseUrl).hostname;
    } catch {
        baseHostname = '';
    }

    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const text = link.textContent?.trim() || '';
        const rel = link.getAttribute('rel') || '';

        let isExternal = false;
        let isValid = true;

        // Check link validity
        if (!href || href === '#') {
            emptyLinks++;
            isValid = false;
        } else if (href.startsWith('javascript:')) {
            javascriptLinks++;
            isValid = false;
        } else if (href.startsWith('http://') || href.startsWith('https://')) {
            try {
                const linkHostname = new URL(href).hostname;
                isExternal = linkHostname !== baseHostname;
            } catch {
                isValid = false;
            }
        }

        if (isExternal) {
            externalLinks++;
            if (!rel.includes('noopener') && !rel.includes('noreferrer')) {
                linksWithoutNoopener++;
            }
        } else if (isValid) {
            internalLinks++;
        }

        if (rel.includes('nofollow')) {
            nofollowLinks++;
        }

        if (!text && !link.querySelector('img')) {
            linksWithoutText++;
        }

        linkData.push({
            href,
            text: text.substring(0, 50),
            isExternal,
            hasNofollow: rel.includes('nofollow'),
            hasNoopener: rel.includes('noopener') || rel.includes('noreferrer'),
            isValid,
        });
    });

    const totalLinks = links.length;

    // Build details
    details.push({ label: 'Total Links', value: totalLinks, status: totalLinks > 0 ? 'pass' : 'warning' });
    details.push({ label: 'Internal Links', value: internalLinks, status: 'pass' });
    details.push({ label: 'External Links', value: externalLinks, status: 'pass' });
    details.push({ label: 'Nofollow Links', value: nofollowLinks, status: 'pass' });
    details.push({ label: 'Empty/Invalid Links', value: emptyLinks + javascriptLinks, status: emptyLinks + javascriptLinks > 0 ? 'warning' : 'pass' });
    details.push({ label: 'Links Without Text', value: linksWithoutText, status: linksWithoutText > 0 ? 'warning' : 'pass' });

    // Calculate score
    let score = 100;

    if (totalLinks === 0) {
        score -= 30;
        issues.push('No links found on page');
        suggestions.push('Add internal links to improve site navigation and SEO');
    }

    if (emptyLinks > 0) {
        score -= Math.min(20, emptyLinks * 5);
        issues.push(`${emptyLinks} empty or hash-only links found`);
        suggestions.push('Replace empty links with valid URLs or remove them');
    }

    if (javascriptLinks > 0) {
        score -= Math.min(15, javascriptLinks * 3);
        issues.push(`${javascriptLinks} JavaScript links found`);
        suggestions.push('Replace javascript: links with proper URLs or button elements');
    }

    if (linksWithoutText > 0) {
        score -= Math.min(15, linksWithoutText * 3);
        issues.push(`${linksWithoutText} links without descriptive text`);
        suggestions.push('Add descriptive anchor text for better accessibility and SEO');
    }

    if (linksWithoutNoopener > 0 && externalLinks > 0) {
        score -= Math.min(10, linksWithoutNoopener * 2);
        issues.push(`${linksWithoutNoopener} external links without rel="noopener"`);
        suggestions.push('Add rel="noopener noreferrer" to external links for security');
    }

    if (internalLinks === 0 && totalLinks > 0) {
        score -= 15;
        issues.push('No internal links found');
        suggestions.push('Add internal links to improve site structure and crawlability');
    }

    score = Math.max(0, score);

    return {
        module: 'Links Analysis',
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        score,
        priority: score < 50 ? 'high' : score < 80 ? 'medium' : 'low',
        category: 'technical',
        summary: `Found ${totalLinks} links: ${internalLinks} internal, ${externalLinks} external`,
        issues,
        suggestions,
        details,
        data: { linkData: linkData.slice(0, 20) }, // Only keep first 20 for display
    };
}
