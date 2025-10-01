import type { AuditResult } from './types';
import { extractHeadings } from '../utils/parseDom';

export function analyzeHeadings(doc: Document): AuditResult {
  const headings = extractHeadings(doc);
  const issues: string[] = [];
  const suggestions: string[] = [];

  const h1Count = headings.filter(h => h.level === 'H1').length;

  if (h1Count === 0) {
    issues.push('No H1 heading found');
    suggestions.push('Add exactly one H1 heading to your page');
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`);
    suggestions.push('Use only one H1 heading per page');
  }

  const emptyHeadings = headings.filter(h => h.text.trim() === '');
  if (emptyHeadings.length > 0) {
    issues.push(`${emptyHeadings.length} empty heading(s) found`);
    suggestions.push('All headings should contain descriptive text');
  }

  let previousLevel = 0;
  let skippedLevels = false;

  headings.forEach(heading => {
    const currentLevel = parseInt(heading.level.replace('H', ''));
    if (currentLevel - previousLevel > 1) {
      skippedLevels = true;
    }
    previousLevel = currentLevel;
  });

  if (skippedLevels) {
    issues.push('Heading hierarchy is not sequential');
    suggestions.push('Follow proper heading order (H1 → H2 → H3) without skipping levels');
  }

  const status = issues.length === 0 ? 'pass' : issues.length <= 2 ? 'warning' : 'fail';

  return {
    module: 'Headings Structure',
    status,
    summary: `Found ${headings.length} headings with ${issues.length} issues`,
    issues,
    suggestions,
    data: { headings, h1Count }
  };
}
