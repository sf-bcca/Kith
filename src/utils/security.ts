/**
 * Validates an image URL to prevent CSS injection and other injection attacks.
 * @param url The URL to validate.
 * @returns A safe URL string or a fallback placeholder.
 */
export const validateImageUrl = (url: string | undefined): string => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  }

  // Check for malicious protocols
  const lowerUrl = url.toLowerCase().trim();
  if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:text/html')) {
    console.warn('Blocked potentially malicious URL:', url);
    return '';
  }

  // Prevent CSS injection by escaping or blocking characters that can break out of url()
  // Malicious example: https://example.com/photo.jpg"); background: url("http://evil.com/log
  if (url.includes('"') || url.includes("'") || url.includes(')') || url.includes('(')) {
    console.warn('Blocked potentially malicious characters in URL:', url);
    return '';
  }

  return url;
};
