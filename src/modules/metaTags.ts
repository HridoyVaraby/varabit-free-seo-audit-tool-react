import type { AuditResult, DetailItem } from './types';
import { extractMetaTags } from '../utils/parseDom';

export function analyzeMetaTags(doc: Document): AuditResult {
  const meta = extractMetaTags(doc);
  const issues: string[] = [];
  const suggestions: string[] = [];
  const details: DetailItem[] = [];

  // Title analysis
  const titleLength = meta.title?.length || 0;
  let titleStatus: 'pass' | 'warning' | 'fail' = 'pass';

  if (!meta.title) {
    titleStatus = 'fail';
    issues.push('Missing page title');
    suggestions.push('Add a <title> tag with 50-60 characters');
  } else if (titleLength < 30) {
    titleStatus = 'warning';
    issues.push(`Title too short: ${titleLength} characters`);
    suggestions.push('Expand title to 50-60 characters for better visibility');
  } else if (titleLength > 60) {
    titleStatus = 'warning';
    issues.push(`Title too long: ${titleLength} characters (may be truncated)`);
    suggestions.push('Shorten title to 50-60 characters');
  }

  details.push({
    label: 'Title',
    value: meta.title || 'Missing',
    status: titleStatus,
    description: `${titleLength}/60 characters`
  });

  // Description analysis
  const descLength = meta.description?.length || 0;
  let descStatus: 'pass' | 'warning' | 'fail' = 'pass';

  if (!meta.description) {
    descStatus = 'fail';
    issues.push('Missing meta description');
    suggestions.push('Add a meta description with 150-160 characters');
  } else if (descLength < 120) {
    descStatus = 'warning';
    issues.push(`Description too short: ${descLength} characters`);
    suggestions.push('Expand description to 150-160 characters');
  } else if (descLength > 160) {
    descStatus = 'warning';
    issues.push(`Description too long: ${descLength} characters (may be truncated)`);
    suggestions.push('Shorten description to 150-160 characters');
  }

  details.push({
    label: 'Description',
    value: meta.description ? `${meta.description.substring(0, 80)}...` : 'Missing',
    status: descStatus,
    description: `${descLength}/160 characters`
  });

  // Canonical
  const hasCanonical = Boolean(meta.canonical);
  details.push({
    label: 'Canonical URL',
    value: hasCanonical ? meta.canonical : 'Missing',
    status: hasCanonical ? 'pass' : 'warning'
  });

  if (!hasCanonical) {
    issues.push('Missing canonical URL');
    suggestions.push('Add a canonical link to prevent duplicate content issues');
  }

  // Keywords (informational - deprecated for SEO)
  details.push({
    label: 'Keywords',
    value: meta.keywords || 'Not set',
    status: 'pass',
    description: 'Keywords meta tag is ignored by Google but may be used by other engines'
  });

  // Open Graph basics
  details.push({
    label: 'OG Title',
    value: meta.ogTitle || 'Missing',
    status: meta.ogTitle ? 'pass' : 'warning'
  });
  details.push({
    label: 'OG Description',
    value: meta.ogDescription ? `${meta.ogDescription.substring(0, 50)}...` : 'Missing',
    status: meta.ogDescription ? 'pass' : 'warning'
  });
  details.push({
    label: 'OG Image',
    value: meta.ogImage ? 'Set' : 'Missing',
    status: meta.ogImage ? 'pass' : 'warning'
  });

  // Calculate score
  let score = 100;

  if (!meta.title) score -= 30;
  else if (titleLength < 30 || titleLength > 60) score -= 10;

  if (!meta.description) score -= 25;
  else if (descLength < 120 || descLength > 160) score -= 10;

  if (!meta.canonical) score -= 10;
  if (!meta.ogTitle) score -= 5;
  if (!meta.ogDescription) score -= 5;
  if (!meta.ogImage) score -= 5;

  score = Math.max(0, score);

  return {
    module: 'Meta Tags',
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score,
    priority: score < 50 ? 'critical' : score < 80 ? 'high' : 'medium',
    category: 'content',
    summary: `Title: ${titleLength} chars, Description: ${descLength} chars`,
    issues,
    suggestions,
    details,
    data: meta,
  };
}
