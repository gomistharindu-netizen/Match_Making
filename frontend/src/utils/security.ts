/**
 * Security utilities for Next.js frontend
 * Defends against Open Redirects, unsafe protocols, and untrusted inputs.
 */

/**
 * Validates and sanitizes a return/redirect URL to prevent Open Redirect vulnerabilities.
 * Ensures the target is strictly an internal relative path without protocol-relative (//)
 * or backslash (\\) bypasses.
 *
 * @param target The untrusted redirect target from query parameters or user input
 * @param fallback Default route to fallback to if the target is invalid or malicious (default: '/browse')
 * @returns Safe relative path
 */
export function getSafeInternalRedirect(target: unknown, fallback: string = '/browse'): string {
  if (typeof target !== 'string') {
    return fallback;
  }

  const trimmed = target.trim();
  if (!trimmed) {
    return fallback;
  }

  // Must begin with a single forward slash and cannot start with '//' (protocol-relative) or '/\'
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }

  // Disallow any backslashes which can be abused for host parsing in some browsers
  if (trimmed.includes('\\')) {
    return fallback;
  }

  // Disallow carriage returns, newlines, null bytes
  if (/[\r\n\t\x00-\x1f]/.test(trimmed)) {
    return fallback;
  }

  // Parse against an isolated dummy origin to verify that host/origin cannot be altered
  try {
    const dummyOrigin = 'http://safe-internal.local';
    const parsed = new URL(trimmed, dummyOrigin);

    if (parsed.origin !== dummyOrigin) {
      return fallback;
    }

    if (parsed.protocol !== 'http:') {
      return fallback;
    }

    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}

/**
 * Sanitizes external URLs to ensure they only use safe protocols (http, https, mailto, tel).
 * Blocks dangerous schemes such as javascript:, vbscript:, and data:.
 */
export function isSafeExternalUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  );
}
