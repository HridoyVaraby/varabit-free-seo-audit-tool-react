import type { AuditResult, DetailItem } from './types';

export function analyzeMobileFriendly(doc: Document): AuditResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const details: DetailItem[] = [];

  let hasViewport = false;
  let viewportContent = '';
  let hasWidthDevice = false;
  let hasInitialScale = false;

  try {
    const viewport = doc.querySelector('meta[name="viewport"]');
    if (viewport) {
      hasViewport = true;
      viewportContent = viewport.getAttribute('content') || '';
      hasWidthDevice = viewportContent.includes('width=device-width');
      hasInitialScale = viewportContent.includes('initial-scale=');
    }
  } catch {
    return {
      module: 'Mobile-Friendliness',
      status: 'fail',
      score: 0,
      priority: 'critical',
      category: 'technical',
      summary: 'Failed to analyze mobile-friendliness',
      issues: ['Unable to query DOM elements'],
      suggestions: ['Check if the page has valid HTML structure'],
    };
  }

  // Check for touch-friendly elements
  let smallTapTargets = 0;
  try {
    const clickables = doc.querySelectorAll('a, button, input, select, textarea');
    // We can't actually measure rendered sizes, but we can check for inline styles
    clickables.forEach(el => {
      const style = el.getAttribute('style') || '';
      // Very basic check - not comprehensive
      if (style.includes('font-size') && style.includes('8px')) {
        smallTapTargets++;
      }
    });
  } catch {
    // Query failed
  }

  // Check for horizontal scroll issues (basic check)
  let hasFixedWidthElements = 0;
  try {
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      const style = el.getAttribute('style') || '';
      if (style.includes('width:') && style.includes('px') && !style.includes('max-width')) {
        const widthMatch = style.match(/width:\s*(\d+)px/);
        if (widthMatch && parseInt(widthMatch[1]) > 500) {
          hasFixedWidthElements++;
        }
      }
    });
  } catch {
    // Query failed
  }

  // Check for responsive images
  let responsiveImages = 0;
  let totalImages = 0;
  try {
    const images = doc.querySelectorAll('img');
    totalImages = images.length;
    images.forEach(img => {
      const srcset = img.getAttribute('srcset');
      const sizes = img.getAttribute('sizes');
      const style = img.getAttribute('style') || '';
      const className = img.getAttribute('class') || '';

      if (srcset || sizes || style.includes('max-width') || className.includes('responsive')) {
        responsiveImages++;
      }
    });
  } catch {
    // Query failed
  }

  // Build details
  details.push({
    label: 'Viewport Meta',
    value: hasViewport ? 'Present' : 'Missing',
    status: hasViewport ? 'pass' : 'fail'
  });

  if (hasViewport) {
    details.push({
      label: 'width=device-width',
      value: hasWidthDevice ? 'Yes' : 'No',
      status: hasWidthDevice ? 'pass' : 'fail'
    });
    details.push({
      label: 'initial-scale',
      value: hasInitialScale ? 'Set' : 'Not set',
      status: hasInitialScale ? 'pass' : 'warning'
    });
  }

  details.push({
    label: 'Fixed Width Elements',
    value: hasFixedWidthElements,
    status: hasFixedWidthElements === 0 ? 'pass' : 'warning'
  });

  if (totalImages > 0) {
    details.push({
      label: 'Responsive Images',
      value: `${responsiveImages}/${totalImages}`,
      status: responsiveImages === totalImages ? 'pass' : 'warning'
    });
  }

  // Generate issues and suggestions
  let score = 100;

  if (!hasViewport) {
    score -= 40;
    issues.push('No viewport meta tag found');
    suggestions.push('Add <meta name="viewport" content="width=device-width, initial-scale=1">');
  } else {
    if (!hasWidthDevice) {
      score -= 20;
      issues.push('Viewport does not include width=device-width');
      suggestions.push('Update viewport to include width=device-width');
    }
    if (!hasInitialScale) {
      score -= 5;
      suggestions.push('Consider adding initial-scale=1 to viewport');
    }
  }

  if (hasFixedWidthElements > 0) {
    score -= Math.min(15, hasFixedWidthElements * 3);
    issues.push(`${hasFixedWidthElements} elements with large fixed widths may cause horizontal scrolling`);
    suggestions.push('Use percentage or max-width instead of fixed pixel widths');
  }

  if (totalImages > 0 && responsiveImages < totalImages) {
    score -= 10;
    issues.push('Some images may not be responsive');
    suggestions.push('Use srcset and sizes attributes for responsive images');
  }

  score = Math.max(0, score);

  return {
    module: 'Mobile-Friendliness',
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score,
    priority: score < 50 ? 'critical' : score < 80 ? 'high' : 'medium',
    category: 'technical',
    summary: hasViewport ? 'Viewport configured' : 'Viewport not configured',
    issues,
    suggestions,
    details,
    data: { hasViewport, viewportContent, hasFixedWidthElements, responsiveImages, totalImages },
  };
}
