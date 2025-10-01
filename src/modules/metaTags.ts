import type { AuditResult } from './types';
import { extractMetaTags } from '../utils/parseDom';

export function analyzeMetaTags(doc: Document): AuditResult {
  const meta = extractMetaTags(doc);
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!meta.title) {
    issues.push('Missing page title');
    suggestions.push('Add a <title> tag to your page');
  } else if (meta.title.length < 30) {
    issues.push('Title too short (< 30 characters)');
    suggestions.push('Expand your title to 50-60 characters for better SEO');
  } else if (meta.title.length > 60) {
    issues.push('Title too long (> 60 characters)');
    suggestions.push('Shorten your title to 50-60 characters to avoid truncation');
  }

  if (!meta.description) {
    issues.push('Missing meta description');
    suggestions.push('Add a meta description tag');
  } else if (meta.description.length < 120) {
    issues.push('Description too short (< 120 characters)');
    suggestions.push('Expand your description to 150-160 characters');
  } else if (meta.description.length > 160) {
    issues.push('Description too long (> 160 characters)');
    suggestions.push('Shorten your description to 150-160 characters');
  }

  if (!meta.canonical) {
    issues.push('Missing canonical URL');
    suggestions.push('Add a canonical link tag to avoid duplicate content issues');
  }

  const status = issues.length === 0 ? 'pass' : issues.length <= 2 ? 'warning' : 'fail';

  return {
    module: 'Meta Tags Analysis',
    status,
    summary: `Found ${issues.length} meta tag issues`,
    issues,
    suggestions,
    data: meta
  };
}
