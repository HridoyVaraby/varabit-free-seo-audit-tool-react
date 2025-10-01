import type { AuditResult } from './types';
import { extractImages } from '../utils/parseDom';

export function analyzeImageAlt(doc: Document): AuditResult {
  const images = extractImages(doc);
  const issues: string[] = [];
  const suggestions: string[] = [];

  const missingAlt = images.filter(img => !img.hasAlt);
  const totalImages = images.length;

  if (totalImages === 0) {
    return {
      module: 'Image Alt Text Check',
      status: 'pass',
      summary: 'No images found on page',
      issues: [],
      suggestions: []
    };
  }

  if (missingAlt.length > 0) {
    issues.push(`${missingAlt.length} out of ${totalImages} images missing alt text`);
    suggestions.push('Add descriptive alt attributes to all images for accessibility and SEO');
  }

  const percentage = ((totalImages - missingAlt.length) / totalImages) * 100;
  const status = percentage === 100 ? 'pass' : percentage >= 70 ? 'warning' : 'fail';

  return {
    module: 'Image Alt Text Check',
    status,
    summary: `${totalImages - missingAlt.length}/${totalImages} images have alt text (${Math.round(percentage)}%)`,
    issues,
    suggestions,
    data: { images: missingAlt.slice(0, 10) }
  };
}
