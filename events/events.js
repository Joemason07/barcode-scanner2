
/**
 * Application events.
 *
 * Connects user interactions to the appropriate
 * application modules.
 *
 * Does not contain page HTML or product mapping.
 */

import { app, toast } from '../dom.js';
import { setupProductSearch } from './product-search.js';

import {
  clearHistory,
  addToInventory,
  increaseInventory,
  decreaseInventory,
  removeFromInventory,
  scans,
  setBestBeforeDate,
  setInventoryShop
} from '../state.js';

import { lookupProduct } from '../api.js';
import { startCamera } from '../camera.js';
import { updateProfile } from '../profile/profile.js';
import { shopBadge } from '../components/pills/shop-brand.js';
import { setInventoryFilter } from '../pages/inventory.js';

import {
  expiryStatusPill,
  daysLeftPill
} from '../components/pills/days-left.js';


// ==================================================
// Global events
// ==================================================

export function setupGlobalEvents() {
  setupThemeButton();
  setupInventoryEvents();
}


// ==================================================
// Page events
// ==================================================

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

    case 'profile':
      setupProfilePage(render);
      break;
  }
}


// ==================================================
// Theme
// ==================================================

function setupThemeButton() {
  const themeButton = document.querySelector('#theme-toggle');

  themeButton?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}


// ==================================================
// Settings toggles
// ==================================================

function setupToggles() {
  document.querySelectorAll('.toggle').forEach(toggle => {
    if (toggle.dataset.toggleBound === 'true') return;

    toggle.dataset.toggleBound = 'true';

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
    });
  });
}


// ==================================================
// Scan page
// ==================================================

function setupScanPage() {
  startCamera();
  setupManualScan();
  setupImageScan();
  setupProductSearch();
}

function setupImageScan() {
  const imageButton = document.querySelector('#image');

  if (!imageButton) return;

  imageButton.addEventListener('click', () => {
    toast('Image scanning is not available yet.');
  });
}

function setupManualScan() {
  const manualButton = document.querySelector('#manual');

  manualButton?.addEventListener('click', () => {
    const input = prompt('Enter the barcode number');
    const code = input?.trim();

    if (!code) return;

    location.hash = `item/${encodeURIComponent(code)}`;
  });
}


// ==================================================
// Product page
// ==================================================

function setupItemPage(id) {
  if (!id) return;

  lookupProduct(id);
}


// ==================================================
// Inventory events
// ==================================================

function setupInventoryEvents() {
  if (app.dataset.inventoryEvents === 'true') return;

  app.dataset.inventoryEvents = 'true';

  // ----------------------------------------------
  // Inventory buttons
  // ----------------------------------------------

  app.addEventListener('click', event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    // Increase quantity.
    const plusButton = target.closest('[data-inventory-plus]');

    if (plusButton) {
      event.preventDefault();
      event.stopPropagation();

      const code = plusButton.dataset.inventoryPlus;

      if (!code) return;

      increaseInventory(code);
      refreshCurrentPage();
      return;
    }

    // Decrease quantity.
    const minusButton = target.closest('[data-inventory-minus]');

    if (minusButton) {
      event.preventDefault();
      event.stopPropagation();

      const code = minusButton.dataset.inventoryMinus;

      if (!code) return;

      decreaseInventory(code);
      refreshCurrentPage();
      return;
    }

    // Remove a product completely.
    const deleteButton = target.closest('[data-remove-inventory]');

    if (deleteButton) {
      event.preventDefault();
      event.stopPropagation();

      const code = deleteButton.dataset.removeInventory;

      if (!code) return;

      removeFromInventory(code);

      toast('Product removed from inventory.');
      refreshCurrentPage();
      return;
    }

    // Add a product from its detail page.
    const addButton = target.closest('[data-add-inventory]');

    if (addButton) {
      event.preventDefault();
      event.stopPropagation();

      const code = addButton.dataset.addInventory;

      if (!code) return;

      const product = findScannedProduct(code);

      if (!product) {
        toast('Product could not be added to inventory.');
        return;
      }

      addToInventory(product);

      toast('Product added to inventory.');
      refreshCurrentPage();
    }
  });


  // ----------------------------------------------
  // Inventory changes
  // ----------------------------------------------

  app.addEventListener('change', event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    // Store filter.
    const inventoryFilter = target.closest('[data-inventory-filter]');

    if (inventoryFilter) {
      setInventoryFilter(inventoryFilter.value);
      refreshCurrentPage();
      return;
    }

    // Shop selection.
    const shopSelect = target.closest('[data-inventory-shop]');

    if (shopSelect) {
      const code = shopSelect.dataset.inventoryShop;
      const shop = shopSelect.value;

      if (!code) return;

      setInventoryShop(code, shop);

      const badgeContainer = findByDataAttribute(
        '[data-inventory-shop-badge]',
        'inventoryShopBadge',
        code
      );

      if (badgeContainer) {
        badgeContainer.innerHTML = shopBadge(shop);
      }

      toast(
        shop
          ? `Shop saved: ${shop}`
          : 'Shop selection cleared.'
      );

      refreshCurrentPage();
      return;
    }

    // Best-before date.
    const dateInput = target.closest('[data-best-before]');

    if (!dateInput) return;

    const code = dateInput.dataset.bestBefore;
    const date = dateInput.value;

    if (!code) return;

    setBestBeforeDate(code, date);

    // Update the status pill.
    const statusElement = findByDataAttribute(
      '[data-expiry-status]',
      'expiryStatus',
      code
    );

    if (statusElement) {
      statusElement.outerHTML = expiryStatusPill(date, code);
    }

    // Update or remove the days-left pill.
    const daysElement = findByDataAttribute(
      '[data-expiry-days]',
      'expiryDays',
      code
    );

    const newDaysPill = daysLeftPill(date, code);

    if (daysElement) {
      if (newDaysPill) {
        daysElement.outerHTML = newDaysPill;
      } else {
        daysElement.remove();
      }
    } else if (newDaysPill) {
      const statusRow = dateInput
        .closest('.inventory-card')
        ?.querySelector('.expiry-status-row');

      statusRow?.insertAdjacentHTML('beforeend', newDaysPill);
    }

    toast(date ? 'Best-before date saved.' : 'Date cleared.');
  });
}


// ==================================================
// Inventory DOM helpers
// ==================================================

function findByDataAttribute(selector, property, value) {
  return [
    ...app.querySelectorAll(selector)
  ].find(element => element.dataset[property] === value);
}


// ==================================================
// Refresh
// ==================================================

function refreshCurrentPage() {
  window.dispatchEvent(new Event('hashchange'));
}


// ==================================================
// Find scanned product
// ==================================================

function findScannedProduct(code) {
  return scans.find(item => String(item.code) === String(code));
}


// ==================================================
// History page
// ==================================================

function setupHistoryPage(render) {
  const clearButton = document.querySelector('#clear-history');

  clearButton?.addEventListener('click', () => {
    clearHistory();
    render();
  });
}


// ==================================================
// Profile page
// ==================================================

function setupProfilePage(render) {
  const dialog = document.querySelector('[data-profile-dialog]');
  const editButton = document.querySelector('[data-profile-edit]');
  const form = document.querySelector('[data-profile-form]');

  const nutritionSelect = document.querySelector(
    '[data-profile-nutrition]'
  );

  // Open the edit dialog.
  editButton?.addEventListener('click', () => {
    dialog?.showModal();
  });

  // Close the dialog.
  document.querySelectorAll('[data-profile-close]').forEach(button => {
    button.addEventListener('click', () => {
      dialog?.close();
    });
  });

  // Save profile details.
  form?.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(form);

    updateProfile({
      displayName: String(
        formData.get('displayName') || ''
      ).trim(),

      email: String(
        formData.get('email') || ''
      ).trim()
    });

    dialog?.close();

    toast('Profile saved.');
    render();
  });

  // Save nutrition display preference.
  nutritionSelect?.addEventListener('change', () => {
    updateProfile({
      preferences: {
        nutritionUnit: nutritionSelect.value
      }
    });

    toast('Preference saved.');
  });
}
