// Handles navigation between pages using the URL hash.
//
// Examples:
// #home
// #scan
// #history
// #settings
// #item/5000112548167

import { app } from './dom.js';
import { stopCamera } from './camera.js';
import { bindPageEvents } from './events.js';

// Page templates
import { home } from './pages/home.js';
import { scan } from './pages/scan.js';
import { history as historyPage } from './pages/history.js';
import { settings } from './pages/settings.js';
import { loadingItem } from './pages/item.js';


/**
 * Gets the current route from the URL.
 */
function getRoute() {
  const route = location.hash.slice(1) || 'home';

  const [page, rawId] = route.split('/');

  const id = decodeURIComponent(rawId || '');

  return {
    page,
    id
  };
}


/**
 * Creates the HTML for the current page.
 */
function getPageTemplate(page, id) {
  switch (page) {
    case 'scan':
      return scan();

    case 'history':
      return historyPage();

    case 'settings':
      return settings();

    case 'item':
      return loadingItem(id);

    case 'home':
    default:
      return home();
  }
}


/**
 * Highlights the correct item in the bottom navigation.
 */
function updateNavigation(page) {
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.classList.toggle(
      'active',
      link.dataset.nav === page
    );
  });
}


/**
 * Renders the current page.
 */
export function render() {
  // Stop the camera whenever we change page.
  stopCamera();

  const { page, id } = getRoute();

  // Render the page.
  app.innerHTML = getPageTemplate(page, id);

  // Update the bottom navigation.
  updateNavigation(page);

  // Move keyboard focus to the main application area.
  app.focus();

  // Set up buttons and interactions for this page.
  bindPageEvents(page, id);
}


// Re-render whenever the URL hash changes.
window.addEventListener('hashchange', render);