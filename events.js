// Handles user interactions and buttons throughout the app.

import { toast } from './dom.js';
import { clearHistory } from './state.js';
import { lookupProduct } from './api.js';
import { startCamera } from './camera.js';


/**
 * Sets up events that work across the entire application.
 */
export function setupGlobalEvents() {
  setupThemeButton();
}


/**
 * Sets up events for the page that has just been rendered.
 *
 * @param {string} page - Current page name.
 * @param {string} id - Product barcode, if on the item page.
 * @param {Function} render - Function used to re-render the app.
 */
export function bindPageEvents(page, id, render) {
  setupToggles();

  switch (page) {
    case 'scan':
      setupScanPage();
      break;

    case 'item':
      setupItemPage(id);
      break;

    case 'history':
      setupHistoryPage(render);
      break;
  }
}


/**
 * Theme button in the top bar.
 */
function setupThemeButton() {
  const themeButton = document.querySelector('#theme-toggle');

  themeButton?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}


/**
 * Settings toggle switches.
 */
function setupToggles() {
  const toggles = document.querySelectorAll('.toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
    });
  });
}


/**
 * Scan page events.
 */
function setupScanPage() {
  startCamera();

  setupManualScan();

  setupImageScan();
}


/**
 * Manual barcode entry.
 */
function setupManualScan() {
  const manualButton = document.querySelector('#manual');

  manualButton?.addEventListener('click', () => {
    const code = prompt('Enter the barcode number');

    if (!code?.trim()) {
      return;
    }

    location.hash = `item/${encodeURIComponent(code.trim())}`;
  });
}


/**
 * Image barcode scanning.
 */
function setupImageScan() {
  const imageButton = document.querySelector('#image');

  imageButton?.addEventListener('click', () => {
    toast('Photo scanning can be connected here next.');
  });
}


/**
 * Product detail page.
 */
function setupItemPage(id) {
  if (!id) {
    return;
  }

  lookupProduct(id);
}


/**
 * History page.
 */
function setupHistoryPage(render) {
  const clearButton = document.querySelector('#clear-history');

  clearButton?.addEventListener('click', () => {
    clearHistory();

    render();
  });
}