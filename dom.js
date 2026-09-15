// Shared DOM references and small UI helpers.
//
// This file contains DOM elements and UI utilities
// that are used by multiple parts of the application.


// --------------------------------------------------
// Main application container
// --------------------------------------------------

export const app =
  document.querySelector('#app');


// --------------------------------------------------
// Toast messages
// --------------------------------------------------

/**
 * Shows a temporary message at the bottom of the screen.
 *
 * @param {string} message - Message to display.
 */
export function toast(message) {
  // Remove any existing toast.
  document.querySelector('.toast')?.remove();

  const element =
    document.createElement('div');

  element.className = 'toast';
  element.textContent = message;

  document.body.append(element);

  setTimeout(() => {
    element.remove();
  }, 2800);
}