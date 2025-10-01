export async function fetchHtml(url: string): Promise<string> {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
