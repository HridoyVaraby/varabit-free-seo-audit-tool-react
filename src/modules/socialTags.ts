import type { AuditResult, DetailItem } from './types';

interface SocialTagsData {
    og: Record<string, string>;
    twitter: Record<string, string>;
}

export function analyzeSocialTags(doc: Document): AuditResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: DetailItem[] = [];

    const og: Record<string, string> = {};
    const twitter: Record<string, string> = {};

    try {
        // Open Graph tags
        const ogTags = doc.querySelectorAll('meta[property^="og:"]');
        ogTags.forEach((tag) => {
            const property = tag.getAttribute('property')?.replace('og:', '') || '';
            const content = tag.getAttribute('content') || '';
            if (property && content) {
                og[property] = content;
            }
        });

        // Twitter Card tags
        const twitterTags = doc.querySelectorAll('meta[name^="twitter:"]');
        twitterTags.forEach((tag) => {
            const name = tag.getAttribute('name')?.replace('twitter:', '') || '';
            const content = tag.getAttribute('content') || '';
            if (name && content) {
                twitter[name] = content;
            }
        });
    } catch {
        return {
            module: 'Social Media Tags',
            status: 'fail',
            score: 0,
            priority: 'medium',
            category: 'social',
            summary: 'Failed to analyze social tags',
            issues: ['Unable to parse social meta tags'],
            suggestions: ['Ensure valid HTML structure'],
        };
    }

    // Check Open Graph tags
    const hasOgTitle = Boolean(og['title']);
    const hasOgDescription = Boolean(og['description']);
    const hasOgImage = Boolean(og['image']);
    const hasOgUrl = Boolean(og['url']);
    const hasOgType = Boolean(og['type']);

    // Check Twitter tags
    const hasTwitterCard = Boolean(twitter['card']);
    const hasTwitterTitle = Boolean(twitter['title']);
    const hasTwitterDescription = Boolean(twitter['description']);
    const hasTwitterImage = Boolean(twitter['image']);

    // Build details
    details.push({ label: 'og:title', value: og['title'] || 'Missing', status: hasOgTitle ? 'pass' : 'fail' });
    details.push({ label: 'og:description', value: (og['description'] || 'Missing').substring(0, 60) + '...', status: hasOgDescription ? 'pass' : 'fail' });
    details.push({ label: 'og:image', value: hasOgImage ? 'Present' : 'Missing', status: hasOgImage ? 'pass' : 'fail' });
    details.push({ label: 'og:url', value: hasOgUrl ? 'Present' : 'Missing', status: hasOgUrl ? 'pass' : 'warning' });
    details.push({ label: 'og:type', value: og['type'] || 'Missing', status: hasOgType ? 'pass' : 'warning' });
    details.push({ label: 'twitter:card', value: twitter['card'] || 'Missing', status: hasTwitterCard ? 'pass' : 'warning' });
    details.push({ label: 'twitter:image', value: hasTwitterImage ? 'Present' : 'Missing', status: hasTwitterImage ? 'pass' : 'warning' });

    // Calculate score
    let score = 0;

    // Open Graph (60 points)
    if (hasOgTitle) score += 15;
    else {
        issues.push('Missing og:title');
        suggestions.push('Add og:title for better social sharing');
    }

    if (hasOgDescription) score += 15;
    else {
        issues.push('Missing og:description');
        suggestions.push('Add og:description for social media previews');
    }

    if (hasOgImage) score += 20;
    else {
        issues.push('Missing og:image');
        suggestions.push('Add og:image (recommended size: 1200x630px)');
    }

    if (hasOgUrl) score += 5;
    if (hasOgType) score += 5;

    // Twitter (40 points)
    if (hasTwitterCard) score += 15;
    else {
        issues.push('Missing twitter:card');
        suggestions.push('Add twitter:card with value "summary_large_image" for rich previews');
    }

    if (hasTwitterImage) score += 15;
    if (hasTwitterTitle || hasOgTitle) score += 5;
    if (hasTwitterDescription || hasOgDescription) score += 5;

    // Check image URL format
    if (hasOgImage && !og['image'].startsWith('http')) {
        issues.push('og:image should use absolute URL');
        suggestions.push('Use full URL (https://...) for og:image');
        score -= 5;
    }

    score = Math.max(0, Math.min(100, score));

    const ogCount = Object.keys(og).length;
    const twitterCount = Object.keys(twitter).length;

    return {
        module: 'Social Media Tags',
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        score,
        priority: score < 50 ? 'high' : 'medium',
        category: 'social',
        summary: `Open Graph: ${ogCount} tags, Twitter: ${twitterCount} tags`,
        issues,
        suggestions,
        details,
        data: { og, twitter } as SocialTagsData,
    };
}
