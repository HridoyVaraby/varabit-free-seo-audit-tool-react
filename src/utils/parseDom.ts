export function parseDom(htmlString: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
}

export function extractText(doc: Document): string {
  const body = doc.body;
  const scripts = body.querySelectorAll('script, style, noscript');
  scripts.forEach(script => script.remove());
  return body.textContent || '';
}

export function extractMetaTags(doc: Document) {
  const title = doc.querySelector('title')?.textContent || '';
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';

  return {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    canonical
  };
}

export function extractHeadings(doc: Document) {
  const headings: { level: string; text: string }[] = [];

  for (let i = 1; i <= 6; i++) {
    const tags = doc.querySelectorAll(`h${i}`);
    tags.forEach(tag => {
      headings.push({
        level: `H${i}`,
        text: tag.textContent?.trim() || ''
      });
    });
  }

  return headings;
}

export function extractImages(doc: Document) {
  const images = doc.querySelectorAll('img');
  const imageData: { src: string; alt: string; hasAlt: boolean }[] = [];

  images.forEach(img => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    imageData.push({
      src,
      alt,
      hasAlt: alt.length > 0
    });
  });

  return imageData;
}
