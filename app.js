// Main entry point.
//
// This file only starts the application.
// Routing and page events are handled elsewhere.

import { render } from './router.js';
import { setupGlobalEvents } from './events.js';
import { navigation } from './components/navigation.js';

// Set up the bottom navigation. 

const navigationContainer = document.querySelector('#navigation'); navigationContainer.innerHTML = navigation();

// Set up events that work across the whole app.
setupGlobalEvents();

// Render the current page.
render();