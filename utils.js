// Shared utility functions.


// --------------------------------------------------
// HTML escaping
// --------------------------------------------------

/**
 * Safely converts a value into text that can be
 * inserted into HTML.
 */
export function escapeHtml(value = '') {
  return String(value).replace(
    /[&<>'"]/g,
    char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    })[char]
  );
}