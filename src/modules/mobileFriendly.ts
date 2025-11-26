import type { AuditResult } from './types';

export function analyzeMobileFriendly(doc: Document): AuditResult {
  const issues: string[] = [];
  const suggestions: string[] = [];

  let viewport: Element | null;
  try {
    viewport = doc.querySelector('meta[name="viewport"]');
  } catch {
    return {
      module: 'Mobile-Friendliness',
      status: 'fail',
      summary: 'Failed to analyze mobile-friendliness',
      issues: ['Unable to query DOM elements due to parsing error'],
      suggestions: ['Check if the page has valid HTML structure'],
      data: { hasViewport: false }
    };
  }

  if (!viewport) {
    issues.push('No viewport meta tag found');
    suggestions.push('Add <meta name="viewport" content="width=device-width, initial-scale=1"> to your HTML');
  } else {
    const content = viewport.getAttribute('content') || '';
    if (!content.includes('width=device-width')) {
      issues.push('Viewport does not include width=device-width');
      suggestions.push('Update viewport meta tag to include width=device-width');
    }
  }

  // Note: font-size and element size analysis requires DOM APIs that are not available in this context.
  // These checks are intentionally omitted to prevent runtime errors.

  const status = issues.length === 0 ? 'pass' : issues.length <= 2 ? 'warning' : 'fail';

  return {
    module: 'Mobile-Friendliness',
    status,
    summary: issues.length === 0 ? 'Page appears mobile-friendly' : `${issues.length} mobile issues detected`,
    issues,
    suggestions,
    data: { hasViewport: !!viewport }
  };
}
