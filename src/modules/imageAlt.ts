import type { AuditResult, DetailItem } from './types';
import { extractImages } from '../utils/parseDom';

export function analyzeImageAlt(doc: Document): AuditResult {
  const images = extractImages(doc);
  const issues: string[] = [];
  const suggestions: string[] = [];
  const details: DetailItem[] = [];

  const missingAlt = images.filter(img => !img.hasAlt);
  const totalImages = images.length;

  if (totalImages === 0) {
    return {
      module: 'Image Optimization',
      status: 'pass',
      score: 100,
      priority: 'low',
      category: 'accessibility',
      summary: 'No images found on page',
      issues: [],
      suggestions: ['Consider adding relevant images to improve engagement'],
      details: [{ label: 'Total Images', value: 0, status: 'pass' }],
    };
  }

  const percentage = Math.round(((totalImages - missingAlt.length) / totalImages) * 100);

  // Check for lazy loading
  let lazyLoadedImages = 0;
  try {
    const lazyImages = doc.querySelectorAll('img[loading="lazy"]');
    lazyLoadedImages = lazyImages.length;
  } catch {
    // Query failed
  }

  // Check for missing dimensions
  let imagesWithDimensions = 0;
  try {
    const dimensionedImages = doc.querySelectorAll('img[width][height]');
    imagesWithDimensions = dimensionedImages.length;
  } catch {
    // Query failed
  }

  // Build details
  details.push({
    label: 'Total Images',
    value: totalImages,
    status: 'pass'
  });
  details.push({
    label: 'With Alt Text',
    value: `${totalImages - missingAlt.length} (${percentage}%)`,
    status: percentage === 100 ? 'pass' : percentage >= 80 ? 'warning' : 'fail'
  });
  details.push({
    label: 'Missing Alt Text',
    value: missingAlt.length,
    status: missingAlt.length === 0 ? 'pass' : 'fail'
  });
  details.push({
    label: 'Lazy Loaded',
    value: `${lazyLoadedImages}/${totalImages}`,
    status: lazyLoadedImages > 0 ? 'pass' : 'warning'
  });
  details.push({
    label: 'With Dimensions',
    value: `${imagesWithDimensions}/${totalImages}`,
    status: imagesWithDimensions === totalImages ? 'pass' : 'warning'
  });

  // Show first few images with issues
  if (missingAlt.length > 0) {
    const preview = missingAlt.slice(0, 3).map(img => {
      const src = img.src || 'unknown';
      const filename = src.split('/').pop()?.substring(0, 30) || 'unknown';
      return filename;
    }).join(', ');
    details.push({
      label: 'Missing Alt Examples',
      value: preview + (missingAlt.length > 3 ? ` (+${missingAlt.length - 3} more)` : ''),
      status: 'fail'
    });
  }

  // Generate issues and suggestions
  if (missingAlt.length > 0) {
    issues.push(`${missingAlt.length} out of ${totalImages} images missing alt text`);
    suggestions.push('Add descriptive alt attributes to all images for accessibility and SEO');
  }

  if (lazyLoadedImages === 0 && totalImages > 3) {
    issues.push('No images using lazy loading');
    suggestions.push('Add loading="lazy" to below-the-fold images for better performance');
  }

  if (imagesWithDimensions < totalImages) {
    issues.push(`${totalImages - imagesWithDimensions} images missing width/height attributes`);
    suggestions.push('Add width and height attributes to prevent layout shift');
  }

  // Calculate score
  let score = percentage;

  if (lazyLoadedImages === 0 && totalImages > 3) score -= 10;
  if (imagesWithDimensions < totalImages) score -= Math.min(10, (totalImages - imagesWithDimensions) * 2);

  score = Math.max(0, Math.min(100, score));

  return {
    module: 'Image Optimization',
    status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
    score,
    priority: score < 50 ? 'high' : 'medium',
    category: 'accessibility',
    summary: `${totalImages - missingAlt.length}/${totalImages} images have alt text (${percentage}%)`,
    issues,
    suggestions,
    details,
    data: { images: missingAlt.slice(0, 10), totalImages, lazyLoadedImages, imagesWithDimensions },
  };
}
