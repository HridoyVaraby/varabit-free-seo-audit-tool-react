import type { AuditResult } from './types';
import { extractText } from '../utils/parseDom';

interface KeywordData {
  word: string;
  count: number;
  density: number;
}

export function analyzeKeywordDensity(doc: Document): AuditResult {
  let text: string;
  try {
    text = extractText(doc);
  } catch {
    return {
      module: 'Keyword Density',
      status: 'fail',
      summary: 'Failed to extract text content from page',
      issues: ['Unable to analyze text content due to parsing error'],
      suggestions: ['Check if the page has valid HTML structure'],
      data: { totalWords: 0, keywords: [] }
    };
  }

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const totalWords = words.length;

  if (totalWords === 0) {
    return {
      module: 'Keyword Density',
      status: 'fail',
      summary: 'No content found on page',
      issues: ['Page appears to have no readable text content'],
      suggestions: ['Add meaningful text content to your page'],
      data: { totalWords: 0, keywords: [] }
    };
  }

  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  const keywords: KeywordData[] = Object.entries(wordCount)
    .map(([word, count]) => ({
      word,
      count,
      density: (count / totalWords) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const issues: string[] = [];
  const suggestions: string[] = [];

  const highDensity = keywords.filter(k => k.density > 3);
  if (highDensity.length > 0) {
    issues.push(`${highDensity.length} keyword(s) with density over 3%`);
    suggestions.push('Reduce keyword stuffing to avoid SEO penalties (keep density between 1-2%)');
  }

  if (totalWords < 300) {
    issues.push(`Low word count: ${totalWords} words`);
    suggestions.push('Add more content (aim for at least 300-500 words per page)');
  }

  const status = issues.length === 0 ? 'pass' : issues.length <= 2 ? 'warning' : 'fail';

  return {
    module: 'Keyword Density',
    status,
    summary: `Total words: ${totalWords}, Top keyword density: ${keywords[0]?.density.toFixed(2) || 0}%`,
    issues,
    suggestions,
    data: { totalWords, keywords }
  };
}
