/**
 * Validate a URL string.
 * @param {string} url - The URL to validate
 * @returns {boolean}
 */
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Validate a custom alias format.
 * @param {string} alias - The alias to validate
 * @returns {boolean}
 */
const isValidAlias = (alias) => {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(alias);
};

// Reserved paths that cannot be used as aliases
const RESERVED_PATHS = [
  'api',
  'login',
  'register',
  'dashboard',
  'analytics',
  'admin',
  'public',
  'health',
  'static',
  'assets',
];

/**
 * Check if an alias conflicts with application routes.
 * @param {string} alias
 * @returns {boolean}
 */
const isReservedPath = (alias) => {
  return RESERVED_PATHS.includes(alias.toLowerCase());
};

module.exports = { isValidUrl, isValidAlias, isReservedPath };
