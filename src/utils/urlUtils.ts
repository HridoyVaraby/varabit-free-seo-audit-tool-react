import { isUri } from 'valid-url';

/**
 * Sanitizes and validates a URL string
 * @param url - The URL string to sanitize
 * @returns A sanitized URL string or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  // Trim whitespace from the beginning and end
  const trimmedUrl = url.trim();
  
  // Return null if the URL is empty after trimming
  if (!trimmedUrl) {
    return null;
  }
  
  // Check if the URL is valid using the valid-url library
  if (isUri(trimmedUrl)) {
    return trimmedUrl;
  }
  
  // If the URL doesn't have a protocol, try adding https://
  if (!trimmedUrl.match(/^https?:\/\//)) {
    const urlWithProtocol = `https://${trimmedUrl}`;
    if (isUri(urlWithProtocol)) {
      return urlWithProtocol;
    }
  }
  
  // Return null if URL is not valid even after trying to add protocol
  return null;
}