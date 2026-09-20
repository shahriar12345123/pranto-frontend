/**
 * Security & Sanitization Utilities
 * Defense-in-depth protection against Cross-Site Scripting (XSS),
 * parameter tampering, script tag breakouts, and storage injection.
 */

// Strict pattern for Gazet store order IDs: e.g. ORD-20260917-4821
export const ORDER_ID_REGEX = /^ORD-\d{8}-\d{4}$/;

// Whitelist pattern for general identifier parameters (alphanumeric, hyphens, underscores)
export const SAFE_ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;

// Disallowed prototype pollution and special property names
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Validates whether an order ID matches the expected store format or a safe identifier.
 * @param {any} id
 * @returns {boolean}
 */
export const validateOrderId = (id) => {
  if (typeof id !== 'string') return false;
  const trimmed = id.trim();
  return ORDER_ID_REGEX.test(trimmed) || (SAFE_ID_REGEX.test(trimmed) && trimmed.startsWith('ORD-'));
};

/**
 * Validates whether an ID contains only safe whitelisted characters (alphanumeric, -, _)
 * and has a reasonable length (1 to 64 chars).
 * @param {any} id
 * @returns {boolean}
 */
export const isValidId = (id) => {
  if (typeof id !== 'string') return false;
  const trimmed = id.trim();
  return SAFE_ID_REGEX.test(trimmed);
};

/**
 * Sanitizes an ID string by removing any non-whitelisted characters.
 * Any character that is not alphanumeric, hyphen, or underscore is stripped.
 * @param {any} id
 * @returns {string}
 */
export const sanitizeId = (id) => {
  if (!id) return '';
  const str = String(id).trim();
  // Keep only alphanumeric characters, dashes, and underscores
  return str.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64);
};

/**
 * Escapes characters that have special meaning in HTML contexts.
 * Defense-in-depth for any string reflection.
 * @param {string} str
 * @returns {string}
 */
export const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;');
};

/**
 * Sanitizes a URL to ensure it does not use dangerous pseudo-protocols like javascript: or data:
 * Only allows relative paths (/...) or absolute URLs with http: or https:
 * @param {string} url
 * @returns {string}
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Allow relative URLs starting with /
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    // Malformed URL, return empty string for safety
    return '';
  }

  return '';
};

/**
 * Safely serializes JSON for inclusion inside an HTML <script> tag (such as JSON-LD).
 * Escapes '<', '>', and '&' so that `</script>` cannot prematurely close the script element.
 * @param {any} data
 * @returns {string}
 */
export const safeJsonLdStringify = (data) => {
  if (!data) return '';
  try {
    const json = JSON.stringify(data);
    return json
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  } catch (err) {
    console.error('Failed to stringify JSON-LD data safely', err);
    return '';
  }
};

/**
 * Secure wrapper around sessionStorage to prevent prototype pollution
 * and unauthorized key tampering.
 */
export const safeSessionStorage = {
  getItem: (key) => {
    if (!key || typeof key !== 'string' || FORBIDDEN_KEYS.has(key)) return null;
    if (!SAFE_ID_REGEX.test(key)) return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key, value) => {
    if (!key || typeof key !== 'string' || FORBIDDEN_KEYS.has(key)) return;
    if (!SAFE_ID_REGEX.test(key)) return;
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.error('safeSessionStorage: Failed to set item', e);
    }
  },

  removeItem: (key) => {
    if (!key || typeof key !== 'string' || FORBIDDEN_KEYS.has(key)) return;
    if (!SAFE_ID_REGEX.test(key)) return;
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
