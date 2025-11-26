// List of CORS proxy services in order of preference
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://cors-anywhere.herokuapp.com/',
  'https://thingproxy.freeboard.io/fetch/'
];

interface ProxyAttempt {
  url: string;
  success: boolean;
  error?: string;
}

export async function fetchHtml(url: string, maxRetries: number = 3): Promise<string> {
  const attempts: ProxyAttempt[] = [];
  
  // Try each proxy service with retries
  for (const baseProxyUrl of CORS_PROXIES) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const proxyUrl = baseProxyUrl + encodeURIComponent(url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // Basic validation: ensure we got meaningful content
        if (html.length < 100 || !html.includes('<')) {
          throw new Error('Received invalid HTML content');
        }
        
        return html;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        attempts.push({
          url: baseProxyUrl,
          success: false,
          error: errorMessage
        });
        
        // If this is the last attempt with the last proxy, don't wait
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }
  }
  
  // If all proxies failed, throw a comprehensive error
  const errorDetails = attempts
    .map(attempt => `Proxy: ${attempt.url} - Error: ${attempt.error}`)
    .join('; ');
    
  console.warn('All CORS proxy attempts failed:', errorDetails);
    
  throw new Error(`Failed to fetch URL from all CORS proxies. Last error: ${attempts[attempts.length - 1]?.error}. Tried ${CORS_PROXIES.length} different proxy services with ${maxRetries} attempts each.`);
}
