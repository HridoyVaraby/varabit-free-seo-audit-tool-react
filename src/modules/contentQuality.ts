import type { AuditResult, DetailItem } from './types';

export function analyzeContentQuality(doc: Document): AuditResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: DetailItem[] = [];

    let textContent = '';
    try {
        const body = doc.body?.cloneNode(true) as HTMLElement;
        if (body) {
            // Remove script and style elements
            body.querySelectorAll('script, style, noscript').forEach(el => el.remove());
            textContent = body.textContent || '';
        }
    } catch {
        return {
            module: 'Content Quality',
            status: 'fail',
            score: 0,
            priority: 'high',
            category: 'content',
            summary: 'Failed to analyze content',
            issues: ['Unable to extract text content'],
            suggestions: ['Ensure valid HTML structure'],
        };
    }

    // Clean and analyze text
    const cleanText = textContent.replace(/\s+/g, ' ').trim();
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Sentence analysis
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

    // Paragraph analysis
    let paragraphCount = 0;
    try {
        paragraphCount = doc.querySelectorAll('p').length;
    } catch {
        // Query failed
    }

    // Calculate content-to-HTML ratio
    const htmlLength = doc.documentElement?.outerHTML?.length || 0;
    const textLength = cleanText.length;
    const contentRatio = htmlLength > 0 ? Math.round((textLength / htmlLength) * 100) : 0;

    // Check for placeholder content
    const lowerText = cleanText.toLowerCase();
    const hasLoremIpsum = lowerText.includes('lorem ipsum');
    const hasPlaceholder = lowerText.includes('placeholder') || lowerText.includes('coming soon');

    // Reading level estimation (simple Flesch-Kincaid approximation)
    const avgSyllables = 1.5; // Simplified assumption
    const readingLevel = sentenceCount > 0
        ? Math.round(0.39 * avgWordsPerSentence + 11.8 * avgSyllables - 15.59)
        : 0;

    // Build details
    details.push({
        label: 'Word Count',
        value: wordCount,
        status: wordCount >= 300 ? 'pass' : wordCount >= 100 ? 'warning' : 'fail'
    });
    details.push({
        label: 'Sentence Count',
        value: sentenceCount,
        status: 'pass'
    });
    details.push({
        label: 'Paragraph Count',
        value: paragraphCount,
        status: paragraphCount > 0 ? 'pass' : 'warning'
    });
    details.push({
        label: 'Avg Words/Sentence',
        value: avgWordsPerSentence,
        status: avgWordsPerSentence <= 20 ? 'pass' : 'warning'
    });
    details.push({
        label: 'Content-to-HTML Ratio',
        value: `${contentRatio}%`,
        status: contentRatio >= 15 ? 'pass' : contentRatio >= 10 ? 'warning' : 'fail'
    });
    details.push({
        label: 'Est. Reading Level',
        value: `Grade ${readingLevel}`,
        status: readingLevel <= 12 ? 'pass' : 'warning'
    });
    details.push({
        label: 'Lorem Ipsum Detected',
        value: hasLoremIpsum ? 'Yes' : 'No',
        status: hasLoremIpsum ? 'fail' : 'pass'
    });

    // Calculate score
    let score = 100;

    // Word count scoring
    if (wordCount < 100) {
        score -= 40;
        issues.push('Very low word count (under 100 words)');
        suggestions.push('Add more content - aim for at least 300-500 words for most pages');
    } else if (wordCount < 300) {
        score -= 20;
        issues.push('Low word count (under 300 words)');
        suggestions.push('Consider expanding content to 500+ words for better SEO');
    }

    // Paragraph check
    if (paragraphCount === 0) {
        score -= 15;
        issues.push('No paragraph elements found');
        suggestions.push('Structure content with <p> tags for better readability');
    }

    // Content ratio
    if (contentRatio < 10) {
        score -= 15;
        issues.push('Low content-to-HTML ratio');
        suggestions.push('Add more text content relative to HTML markup');
    }

    // Sentence length
    if (avgWordsPerSentence > 25) {
        score -= 10;
        issues.push('Sentences are too long on average');
        suggestions.push('Break up long sentences for better readability');
    }

    // Placeholder content
    if (hasLoremIpsum) {
        score -= 30;
        issues.push('Lorem Ipsum placeholder text detected');
        suggestions.push('Replace placeholder text with real content');
    }

    if (hasPlaceholder) {
        score -= 15;
        issues.push('Placeholder or "coming soon" text detected');
        suggestions.push('Complete the content before publishing');
    }

    score = Math.max(0, score);

    return {
        module: 'Content Quality',
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        score,
        priority: score < 50 ? 'high' : 'medium',
        category: 'content',
        summary: `${wordCount} words, ${sentenceCount} sentences, ${contentRatio}% content ratio`,
        issues,
        suggestions,
        details,
        data: { wordCount, sentenceCount, paragraphCount, contentRatio },
    };
}
