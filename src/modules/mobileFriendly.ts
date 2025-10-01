import type { AuditResult } from './types';

export function analyzeMobileFriendly(doc: Document): AuditResult {
  const issues: string[] = [];
  const suggestions: string[] = [];

  const viewport = doc.querySelector('meta[name="viewport"]');

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

  const fonts = doc.querySelectorAll('*');
  let smallFontCount = 0;

  fonts.forEach(element => {
    const fontSize = window.getComputedStyle(element as Element).fontSize;
    const size = parseInt(fontSize);
    if (size < 12 && size > 0) {
      smallFontCount++;
    }
  });

  if (smallFontCount > 0) {
    issues.push(`${smallFontCount} elements with font size below 12px`);
    suggestions.push('Use minimum 12px font size for mobile readability');
  }

  const clickableElements = doc.querySelectorAll('a, button');
  let tooSmallCount = 0;

  clickableElements.forEach(element => {
    const rect = (element as HTMLElement).getBoundingClientRect();
    if (rect.width < 48 || rect.height < 48) {
      tooSmallCount++;
    }
  });

  if (tooSmallCount > 0) {
    issues.push(`${tooSmallCount} clickable elements smaller than 48x48px`);
    suggestions.push('Make tap targets at least 48x48px for better mobile usability');
  }

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
