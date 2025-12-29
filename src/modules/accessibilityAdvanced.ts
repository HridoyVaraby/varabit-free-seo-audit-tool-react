import type { AuditResult, DetailItem } from './types';

export function analyzeAccessibility(doc: Document): AuditResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: DetailItem[] = [];

    let imagesWithoutAlt = 0;
    let imagesTotal = 0;
    let formsWithoutLabels = 0;
    let formsTotal = 0;
    let buttonsWithoutText = 0;
    let buttonsTotal = 0;
    let linksWithoutText = 0;
    let linksTotal = 0;
    let hasSkipLink = false;
    let hasMainLandmark = false;
    let hasNavLandmark = false;

    try {
        // Check images
        const images = doc.querySelectorAll('img');
        imagesTotal = images.length;
        images.forEach((img) => {
            const alt = img.getAttribute('alt');
            if (alt === null) {
                imagesWithoutAlt++;
            }
        });

        // Check form inputs for labels
        const inputs = doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
        formsTotal = inputs.length;
        inputs.forEach((input) => {
            const id = input.getAttribute('id');
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledby = input.getAttribute('aria-labelledby');
            const hasLabel = id && doc.querySelector(`label[for="${id}"]`);

            if (!hasLabel && !ariaLabel && !ariaLabelledby) {
                formsWithoutLabels++;
            }
        });

        // Check buttons for accessible text
        const buttons = doc.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"]');
        buttonsTotal = buttons.length;
        buttons.forEach((button) => {
            const text = button.textContent?.trim() || '';
            const ariaLabel = button.getAttribute('aria-label');
            const value = button.getAttribute('value') || '';

            if (!text && !ariaLabel && !value) {
                buttonsWithoutText++;
            }
        });

        // Check links for accessible text
        const links = doc.querySelectorAll('a[href]');
        linksTotal = links.length;
        links.forEach((link) => {
            const text = link.textContent?.trim() || '';
            const ariaLabel = link.getAttribute('aria-label');
            const hasImg = link.querySelector('img[alt]');

            if (!text && !ariaLabel && !hasImg) {
                linksWithoutText++;
            }
        });

        // Check for skip navigation link
        const skipLinks = doc.querySelectorAll('a[href^="#"]');
        skipLinks.forEach((link) => {
            const text = (link.textContent || '').toLowerCase();
            if (text.includes('skip') || text.includes('main content')) {
                hasSkipLink = true;
            }
        });

        // Check landmarks
        hasMainLandmark = Boolean(doc.querySelector('main, [role="main"]'));
        hasNavLandmark = Boolean(doc.querySelector('nav, [role="navigation"]'));

    } catch {
        return {
            module: 'Accessibility',
            status: 'fail',
            score: 0,
            priority: 'high',
            category: 'accessibility',
            summary: 'Failed to analyze accessibility',
            issues: ['Unable to parse document'],
            suggestions: ['Ensure valid HTML structure'],
        };
    }

    // Build details
    const imgAltPercent = imagesTotal > 0 ? Math.round(((imagesTotal - imagesWithoutAlt) / imagesTotal) * 100) : 100;
    details.push({
        label: 'Images with Alt Text',
        value: `${imagesTotal - imagesWithoutAlt}/${imagesTotal} (${imgAltPercent}%)`,
        status: imgAltPercent === 100 ? 'pass' : imgAltPercent >= 80 ? 'warning' : 'fail'
    });

    const labelPercent = formsTotal > 0 ? Math.round(((formsTotal - formsWithoutLabels) / formsTotal) * 100) : 100;
    details.push({
        label: 'Form Inputs with Labels',
        value: `${formsTotal - formsWithoutLabels}/${formsTotal} (${labelPercent}%)`,
        status: labelPercent === 100 ? 'pass' : 'fail'
    });

    details.push({
        label: 'Buttons with Text',
        value: `${buttonsTotal - buttonsWithoutText}/${buttonsTotal}`,
        status: buttonsWithoutText === 0 ? 'pass' : 'fail'
    });

    details.push({
        label: 'Links with Text',
        value: `${linksTotal - linksWithoutText}/${linksTotal}`,
        status: linksWithoutText === 0 ? 'pass' : linksWithoutText <= 2 ? 'warning' : 'fail'
    });

    details.push({
        label: 'Skip Navigation Link',
        value: hasSkipLink ? 'Present' : 'Missing',
        status: hasSkipLink ? 'pass' : 'warning'
    });

    details.push({
        label: 'Main Landmark',
        value: hasMainLandmark ? 'Present' : 'Missing',
        status: hasMainLandmark ? 'pass' : 'warning'
    });

    details.push({
        label: 'Navigation Landmark',
        value: hasNavLandmark ? 'Present' : 'Missing',
        status: hasNavLandmark ? 'pass' : 'warning'
    });

    // Calculate score
    let score = 100;

    if (imagesWithoutAlt > 0) {
        score -= Math.min(25, imagesWithoutAlt * 5);
        issues.push(`${imagesWithoutAlt} images missing alt attribute`);
        suggestions.push('Add alt text to all images for screen readers');
    }

    if (formsWithoutLabels > 0) {
        score -= Math.min(20, formsWithoutLabels * 5);
        issues.push(`${formsWithoutLabels} form inputs without labels`);
        suggestions.push('Add <label> elements or aria-label to all form inputs');
    }

    if (buttonsWithoutText > 0) {
        score -= Math.min(15, buttonsWithoutText * 5);
        issues.push(`${buttonsWithoutText} buttons without accessible text`);
        suggestions.push('Add text content or aria-label to all buttons');
    }

    if (linksWithoutText > 0) {
        score -= Math.min(10, linksWithoutText * 2);
        issues.push(`${linksWithoutText} links without accessible text`);
        suggestions.push('Add descriptive text or aria-label to all links');
    }

    if (!hasSkipLink) {
        score -= 5;
        suggestions.push('Add a "Skip to main content" link for keyboard users');
    }

    if (!hasMainLandmark) {
        score -= 5;
        suggestions.push('Add a <main> element to identify the main content');
    }

    score = Math.max(0, score);

    return {
        module: 'Accessibility',
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        score,
        priority: score < 50 ? 'high' : 'medium',
        category: 'accessibility',
        summary: `${issues.length === 0 ? 'Good accessibility practices' : `${issues.length} accessibility issues`}`,
        issues,
        suggestions,
        details,
        data: { imagesWithoutAlt, formsWithoutLabels, buttonsWithoutText, linksWithoutText },
    };
}
