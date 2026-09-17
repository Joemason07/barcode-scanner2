// Application events.
//
// This file connects user interactions to the
// appropriate application modules.
//
// It does not contain page HTML or product mapping.


import { app, toast } from './dom.js';

import {
  clearHistory,
  addToInventory,
  increaseInventory,
  decreaseInventory,
  removeFromInventory,
  scans
} from './state.js';

import { lookupProduct } from './api.js';

import { startCamera } from './camera.js';


// ==================================================
// Global events
// ==================================================

/**
 * Sets up events that work across the entire application.
 */
export function setupGlobalEvents() {
  setupThemeButton();
  setupInventoryEvents();
}


// ==================================================
// Page events
// ==================================================

/**
 * Sets up events for the page that has just been rendered.
 *
 * @param {string} page - Current page name.
 * @param {string} id - Product barcode, if on the item page.
 * @param {Function} render - Function used to re-render the app.
 */
export function bindPageEvents(
  page,
  id,
  render
) {
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


// ==================================================
// Theme
// ==================================================

/**
 * Sets up the theme toggle in the top bar.
 */
function setupThemeButton() {
  const themeButton =
    document.querySelector('#theme-toggle');

  themeButton?.addEventListener(
    'click',
    () => {
      document.body.classList.toggle('dark');
    }
  );
}


// ==================================================
// Settings
// ==================================================

/**
 * Sets up settings toggle switches.
 */
function setupToggles() {
  const toggles =
    document.querySelectorAll('.toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener(
      'click',
      () => {
        toggle.classList.toggle('on');
      }
    );
  });
}


// ==================================================
// Scan page
// ==================================================

/**
 * Sets up all Scan page interactions.
 */
function setupScanPage() {
  startCamera();

  setupManualScan();
  setupImageScan();
}


// --------------------------------------------------
// Manual barcode entry
// --------------------------------------------------

/**
 * Sets up manual barcode entry.
 */
function setupManualScan() {
  const manualButton =
    document.querySelector('#manual');

  manualButton?.addEventListener(
    'click',
    () => {
      const input =
        prompt('Enter the barcode number');

      const code =
        input?.trim();

      if (!code) {
        return;
      }

      location.hash =
        `item/${encodeURIComponent(code)}`;
    }
  );
}


// --------------------------------------------------
// Image scanning
// --------------------------------------------------

/**
 * Sets up image scanning.
 */
function setupImageScan() {
  const imageButton =
    document.querySelector('#image');

  imageButton?.addEventListener(
    'click',
    () => {
      toast(
        'Photo scanning can be connected here next.'
      );
    }
  );
}


// ==================================================
// Product page
// ==================================================

/**
 * Sets up the product lookup.
 */
function setupItemPage(id) {
  if (!id) {
    return;
  }

  lookupProduct(id);
}


// ==================================================
// Inventory events
// ==================================================

/**
 * Sets up inventory controls using event delegation.
 *
 * This is important because product detail buttons
 * are added to the page asynchronously after lookup.
 */
function setupInventoryEvents() {

  // Prevent duplicate listeners.
  if (app.dataset.inventoryEvents === 'true') {
    return;
  }

  app.dataset.inventoryEvents = 'true';

  app.addEventListener(
    'click',
    event => {

      // --------------------------------------------
      // Add one
      // --------------------------------------------

      const plusButton =
        event.target.closest(
          '[data-inventory-plus]'
        );

      if (plusButton) {
        event.preventDefault();
        event.stopPropagation();

        const code =
          plusButton.dataset.inventoryPlus;

        if (!code) {
          return;
        }

        increaseInventory(code);

        refreshCurrentPage();

        return;
      }


      // --------------------------------------------
      // Remove one
      // --------------------------------------------

      const minusButton =
        event.target.closest(
          '[data-inventory-minus]'
        );

      if (minusButton) {
        event.preventDefault();
        event.stopPropagation();

        const code =
          minusButton.dataset.inventoryMinus;

        if (!code) {
          return;
        }

        decreaseInventory(code);

        refreshCurrentPage();

        return;
      }


      // --------------------------------------------
      // Remove completely
      // --------------------------------------------

      const deleteButton =
        event.target.closest(
          '[data-remove-inventory]'
        );

      if (deleteButton) {
        event.preventDefault();
        event.stopPropagation();

        const code =
          deleteButton.dataset.removeInventory;

        if (!code) {
          return;
        }

        removeFromInventory(code);

        toast(
          'Product removed from inventory.'
        );

        refreshCurrentPage();

        return;
      }


      // --------------------------------------------
      // Add to inventory from product page
      // --------------------------------------------

      const addButton =
        event.target.closest(
          '[data-add-inventory]'
        );

      if (addButton) {
        event.preventDefault();
        event.stopPropagation();

        const code =
          addButton.dataset.addInventory;

        if (!code) {
          return;
        }

        const product =
          findScannedProduct(code);

        if (!product) {
          toast(
            'Product could not be added to inventory.'
          );

          return;
        }

        addToInventory(product);

        toast(
          'Product added to inventory.'
        );

        refreshCurrentPage();
      }
    }
  );
}


// ==================================================
// Refresh
// ==================================================

/**
 * Re-renders the current page.
 *
 * Uses the current URL hash so that inventory
 * controls update immediately without navigation.
 */
function refreshCurrentPage() {
  const event =
    new Event('hashchange');

  window.dispatchEvent(event);
}


// ==================================================
// Find scanned product
// ==================================================

/**
 * Finds a product in scan history using
 * its barcode.
 */
function findScannedProduct(code) {
  return scans.find(
    item => item.code === code
  );
}


// ==================================================
// History page
// ==================================================

/**
 * Sets up the History page.
 */
function setupHistoryPage(render) {
  const clearButton =
    document.querySelector(
      '#clear-history'
    );

  clearButton?.addEventListener(
    'click',
    () => {
      clearHistory();

      render();
    }
  );
}