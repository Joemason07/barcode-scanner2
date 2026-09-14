// Handles user interactions and buttons throughout the app.

import { toast } from './dom.js';
import { clearHistory } from './state.js';
import { lookupProduct } from './api.js';
import { startCamera } from './camera.js';
import { render } from './router.js';


/**
 * Sets up events that work across the entire application.
 */
export function setupGlobalEvents() {
  // Theme button.
  document.querySelector('#theme-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}


/**
 * Sets up events for the page that has just been rendered.
 */
export function bindPageEvents(page, id) {
  setupToggles();

  switch (page) {
    case 'scan':
      setupScanPage();
      break;

    case 'item':
      setupItemPage(id);
      break;

    case 'history':
      setupHistoryPage();
      break;
  }
}


/**
 * Settings toggle switches.
 */
function setupToggles() {
  document.querySelectorAll('.toggle').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('on');
    });
  });
}


/**
 * Scan page events.
 */
function setupScanPage() {
  startCamera();

  // Enter barcode manually.
  document.querySelector('#manual')?.addEventListener('click', () => {
    const code = prompt('Enter the barcode number');

    if (!code?.trim()) {
      return;
    }

    location.hash = `item/${encodeURIComponent(code.trim())}`;
  });


  // Choose an image.
  document.querySelector('#image')?.addEventListener('click', () => {
    toast('Photo scanning can be connected here next.');
  });
}


/**
 * Product page events.
 */
function setupItemPage(id) {
  lookupProduct(id);
}


/**
 * History page events.
 */
function setupHistoryPage() {
  document.querySelector('#clear-history')?.addEventListener('click', () => {
    clearHistory();
    render();
  });
}

