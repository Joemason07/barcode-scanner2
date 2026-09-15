
// Handles navigation between pages using the URL hash.
//
// Examples:
// #home
// #scan
// #inventory
// #history
// #settings
// #item/5000112548167


import { app } from './dom.js';
import { stopCamera } from './camera.js';
import { bindPageEvents } from './events.js';

import { updateNavigation } from './components/navigation.js';

// Page templates
import { home } from './pages/home.js';
import { scan } from './pages/scan.js';
import { history as historyPage } from './pages/history.js';
import { inventory } from './pages/inventory.js';
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

    case 'inventory':
      return inventory();

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
  bindPageEvents(page, id, render);
}


// Re-render whenever the URL hash changes.
window.addEventListener('hashchange', render);