import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses a strict whitelist of allowed tags and attributes
 *
 * @param dirtyHtml - Unsanitized HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirtyHtml: string): string {
  return sanitizeHtmlLib(dirtyHtml, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'img', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div'
    ],
    allowedAttributes: {
      '*': ['class', 'align', 'dir', 'style', 'title'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
  });
}