// Application router.
//
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

import { home } from './pages/home.js';
import { scan } from './pages/scan.js';
import { history as historyPage } from './pages/history.js';
import { inventory } from './pages/inventory.js';
import { settings } from './pages/settings.js';
import { loadingItem } from './pages/item.js';


// --------------------------------------------------
// Route
// --------------------------------------------------

/**
 * Gets the current route from the URL hash.
 */
function getRoute() {
  const route =
    location.hash.slice(1) || 'home';

  const [page, rawId] =
    route.split('/');

  let id = '';

  try {
    id = decodeURIComponent(
      rawId || ''
    );
  } catch {
    id = '';
  }

  return {
    page,
    id
  };
}


// --------------------------------------------------
// Page templates
// --------------------------------------------------

/**
 * Creates the HTML for the current page.
 */
function getPageTemplate(
  page,
  id
) {
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


// --------------------------------------------------
// Rendering
// --------------------------------------------------

/**
 * Renders the current page.
 */
export function render() {
  // Stop the camera whenever the page changes.
  stopCamera();

  const {
    page,
    id
  } = getRoute();

  // Render the page.
  app.innerHTML =
    getPageTemplate(page, id);

  // Update the active navigation item.
  updateNavigation(page);

  // Move keyboard focus to the application.
  app.focus();

  // Set up interactions for the page.
  bindPageEvents(
    page,
    id,
    render
  );
}


// --------------------------------------------------
// Navigation events
// --------------------------------------------------

window.addEventListener(
  'hashchange',
  render
);