// Main application entry point.
//
// This file starts Scanly.
// Routing, navigation, and page events are handled elsewhere.

import { render } from './router.js';
import { setupGlobalEvents } from './events.js';
import { navigation } from './components/navigation.js';


// --------------------------------------------------
// Navigation
// --------------------------------------------------

const navigationContainer =
  document.querySelector('#navigation');

if (navigationContainer) {
  navigationContainer.innerHTML = navigation();
}


// --------------------------------------------------
// Global events
// --------------------------------------------------

setupGlobalEvents();


// --------------------------------------------------
// Initial page
// --------------------------------------------------

render();