import type { AuditResult, DetailItem } from './types';
import { extractText } from '../utils/parseDom';

interface KeywordData {
  word: string;
  count: number;
  density: number;
}

// Common stop words to filter out
const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up',
  'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
  'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
  'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new',
  'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were',
  'been', 'has', 'had', 'did', 'does', 'doing', 'done', 'being', 'am', 'more', 'very'
]);

export function analyzeKeywordDensity(doc: Document): AuditResult {
  let text: string;
  const details: DetailItem[] = [];

  try {
    text = extractText(doc);
  } catch {
    return {
      module: 'Keyword Analysis',
      status: 'fail',
      score: 0,
      priority: 'medium',
      category: 'content',
      summary: 'Failed to extract text content',
      issues: ['Unable to analyze text content'],
      suggestions: ['Check if the page has valid HTML structure'],
    };
  }

  // Clean and tokenize text
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));

  const totalWords = words.length;
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (totalWords === 0) {
    return {
      module: 'Keyword Analysis',
      status: 'fail',
      score: 20,
      priority: 'high',
      category: 'content',
      summary: 'No meaningful content found',
      issues: ['Page appears to have no readable text content'],
      suggestions: ['Add meaningful text content to your page'],
      details: [{ label: 'Word Count', value: 0, status: 'fail' }],
    };
  }

  // Count word frequencies
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Get top keywords
  const keywords: KeywordData[] = Object.entries(wordCount)
    .map(([word, count]) => ({
      word,
      count,
      density: (count / totalWords) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Build details
  details.push({
    label: 'Total Words',
    value: totalWords,
    status: totalWords >= 300 ? 'pass' : totalWords >= 100 ? 'warning' : 'fail'
  });

  details.push({
    label: 'Unique Words',
    value: Object.keys(wordCount).length,
    status: 'pass'
  });

  // Top 5 keywords with density
  const topKeywords = keywords.slice(0, 5);
  topKeywords.forEach((kw, i) => {
    details.push({
      label: `#${i + 1} Keyword: "${kw.word}"`,
      value: `${kw.count}x (${kw.density.toFixed(2)}%)`,
      status: kw.density > 3 ? 'warning' : 'pass'
    });
  });

  // Check for issues
  const highDensity = keywords.filter(k => k.density > 3);
  const veryHighDensity = keywords.filter(k => k.density > 5);

  // Calculate score
  let score = 100;

  if (totalWords < 100) {
    score -= 40;
    issues.push(`Very low word count: ${totalWords} words`);
    suggestions.push('Add more content - aim for at least 300-500 words');
  } else if (totalWords < 300) {
    score -= 20;
    issues.push(`Low word count: ${totalWords} words`);
    suggestions.push('Consider expanding content to 500+ words for better ranking');
  }

  if (veryHighDensity.length > 0) {
    score -= 20;
    issues.push(`${veryHighDensity.length} keyword(s) with density over 5% (keyword stuffing)`);
    suggestions.push('Reduce repetition of overused keywords to avoid penalties');
  } else if (highDensity.length > 0) {
    score -= 10;
    issues.push(`${highDensity.length} keyword(s) with density over 3%`);
    suggestions.push('Keep keyword density between 1-2% for natural content');
  }

  // Check vocabulary diversity
  const vocabularyDiversity = Object.keys(wordCount).length / totalWords;
  if (vocabularyDiversity < 0.3) {
    score -= 10;
    issues.push('Low vocabulary diversity');
    suggestions.push('Use more varied vocabulary to improve content quality');
  }

  score = Math.max(0, score);

  // Build keyword summary
  const keywordSummary = topKeywords.slice(0, 3).map(k => k.word).join(', ');

  return {
    module: 'Keyword Analysis',
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score,
    priority: 'medium',
    category: 'content',
    summary: `${totalWords} words. Top keywords: ${keywordSummary}`,
    issues,
    suggestions,
    details,
    data: { totalWords, keywords, vocabularyDiversity },
  };
}
