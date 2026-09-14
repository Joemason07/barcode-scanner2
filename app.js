// Main entry point.
//
// This file only starts the application.
// Routing and page events are handled elsewhere.

import { render } from './router.js';
import { setupGlobalEvents } from './events.js';

// Set up events that work across the whole app.
setupGlobalEvents();

// Render the current page.
render();
