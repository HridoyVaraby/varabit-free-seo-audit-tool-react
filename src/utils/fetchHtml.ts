// List of CORS proxy services in order of preference
// Note: These are public proxies and may have rate limits or availability issues
const CORS_PROXIES = [
  // Most reliable proxies first
  {
    name: 'allorigins',
    buildUrl: (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    parseResponse: async (response: Response) => {
      const data = await response.json();
      return data.contents;
    }
  },
  {
    name: 'corsproxy.io',
    buildUrl: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    parseResponse: async (response: Response) => response.text()
  },
  {
    name: 'cors.sh',
    buildUrl: (url: string) => `https://cors.sh/${url}`,
    parseResponse: async (response: Response) => response.text()
  },
  {
    name: 'crossorigin.me',
    buildUrl: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    parseResponse: async (response: Response) => response.text()
  }
];

interface ProxyResult {
  proxyName: string;
  success: boolean;
  error?: string;
}

export async function fetchHtml(url: string, maxRetries: number = 2): Promise<string> {
  const results: ProxyResult[] = [];

  // Try each proxy service
  for (const proxy of CORS_PROXIES) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const proxyUrl = proxy.buildUrl(url);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(proxyUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await proxy.parseResponse(response);

        // Basic validation: ensure we got meaningful HTML content
        if (!html || html.length < 50) {
          throw new Error('Empty or too short response');
        }

        if (!html.includes('<') && !html.includes('<!')) {
          throw new Error('Response does not appear to be HTML');
        }

        console.log(`Successfully fetched via ${proxy.name}`);
        return html;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          proxyName: proxy.name,
          success: false,
          error: errorMessage
        });

        // Log for debugging
        console.warn(`Proxy ${proxy.name} attempt ${attempt} failed:`, errorMessage);

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
      }
    }
  }

  // All proxies failed - provide helpful error message
  const lastError = results[results.length - 1]?.error || 'Unknown error';

  console.error('All CORS proxy attempts failed:', results);

  throw new Error(
    `Unable to fetch the URL. This could be because:\n` +
    `• The website blocks automated access\n` +
    `• The website is not publicly accessible\n` +
    `• Network connectivity issues\n\n` +
    `Technical details: ${lastError}`
  );
}
