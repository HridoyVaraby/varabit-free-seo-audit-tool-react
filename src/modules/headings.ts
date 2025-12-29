import type { AuditResult, DetailItem } from './types';
import { extractHeadings } from '../utils/parseDom';

export function analyzeHeadings(doc: Document): AuditResult {
  let headings: { level: string; text: string }[];
  const details: DetailItem[] = [];

  try {
    headings = extractHeadings(doc);
  } catch (error) {
    return {
      module: 'Heading Structure',
      status: 'fail',
      score: 0,
      priority: 'high',
      category: 'content',
      summary: 'Failed to analyze headings',
      issues: ['Unable to extract heading information'],
      suggestions: ['Check if the page has valid HTML structure'],
    };
  }

  const issues: string[] = [];
  const suggestions: string[] = [];

  // Count headings by level
  const headingCounts: Record<string, number> = { H1: 0, H2: 0, H3: 0, H4: 0, H5: 0, H6: 0 };
  headings.forEach(h => {
    if (headingCounts[h.level] !== undefined) {
      headingCounts[h.level]++;
    }
  });

  const h1Count = headingCounts.H1;
  const totalHeadings = headings.length;

  // Add count details
  details.push({ label: 'Total Headings', value: totalHeadings, status: totalHeadings > 0 ? 'pass' : 'warning' });
  details.push({ label: 'H1 Tags', value: h1Count, status: h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warning' });
  details.push({ label: 'H2 Tags', value: headingCounts.H2, status: 'pass' });
  details.push({ label: 'H3 Tags', value: headingCounts.H3, status: 'pass' });
  details.push({ label: 'H4-H6 Tags', value: headingCounts.H4 + headingCounts.H5 + headingCounts.H6, status: 'pass' });

  // H1 checks
  if (h1Count === 0) {
    issues.push('No H1 heading found');
    suggestions.push('Add exactly one H1 heading as the main page title');
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`);
    suggestions.push('Use only one H1 heading per page');
  }

  // Empty headings
  const emptyHeadings = headings.filter(h => h.text.trim() === '');
  if (emptyHeadings.length > 0) {
    issues.push(`${emptyHeadings.length} empty heading(s) found`);
    suggestions.push('All headings should contain descriptive text');
    details.push({ label: 'Empty Headings', value: emptyHeadings.length, status: 'fail' });
  }

  // Heading hierarchy check
  let previousLevel = 0;
  let skippedLevels = 0;

  headings.forEach(heading => {
    const currentLevel = parseInt(heading.level.replace('H', ''));
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      skippedLevels++;
    }
    previousLevel = currentLevel;
  });

  if (skippedLevels > 0) {
    issues.push(`Heading hierarchy skipped ${skippedLevels} level(s)`);
    suggestions.push('Follow proper heading order (H1 → H2 → H3) without skipping levels');
    details.push({ label: 'Hierarchy Issues', value: skippedLevels, status: 'warning' });
  } else {
    details.push({ label: 'Hierarchy', value: 'Valid', status: 'pass' });
  }

  // Add first few headings as preview
  const headingPreview = headings.slice(0, 5).map(h => `${h.level}: ${h.text.substring(0, 40)}${h.text.length > 40 ? '...' : ''}`);
  if (headingPreview.length > 0) {
    details.push({
      label: 'Heading Preview',
      value: headingPreview.join(' | '),
      status: 'pass'
    });
  }

  // Calculate score
  let score = 100;

  if (h1Count === 0) score -= 30;
  else if (h1Count > 1) score -= 20;

  if (emptyHeadings.length > 0) score -= Math.min(20, emptyHeadings.length * 5);
  if (skippedLevels > 0) score -= Math.min(15, skippedLevels * 5);
  if (totalHeadings === 0) score -= 20;

  score = Math.max(0, score);

  return {
    module: 'Heading Structure',
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score,
    priority: score < 50 ? 'high' : 'medium',
    category: 'content',
    summary: `${totalHeadings} headings: ${h1Count} H1, ${headingCounts.H2} H2, ${headingCounts.H3} H3`,
    issues,
    suggestions,
    details,
    data: { headings: headings.slice(0, 20), counts: headingCounts },
  };
}
