
/**
 * Scanly — Application state
 *
 * Manages:
 * - Scan history
 * - Inventory and quantities
 * - Shop tracking
 * - Best-before dates
 *
 * Store names are shared with the store dropdown.
 * Data is stored locally in localStorage.
 */

import { STORES } from './components/dropdowns/stores.js';

// ==================================================
// Storage keys and constants
// ==================================================

const HISTORY_KEY = 'scanly-history';
const INVENTORY_KEY = 'scanly-inventory';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const ALLOWED_SHOPS = new Set([
  '',
  ...STORES
]);

// ==================================================
// Shared helpers
// ==================================================

/**
 * Reads and parses an array from localStorage.
 * Returns an empty array if storage is unavailable
 * or the stored value is invalid.
 */
function loadArray(key) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Could not load ${key}:`, error);
    return [];
  }
}

/**
 * Saves an array to localStorage.
 * Returns true when the save succeeds.
 */
function saveArray(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error(`Could not save ${key}:`, error);
    return false;
  }
}

/**
 * Normalises a product barcode/code.
 */
function normaliseCode(code) {
  if (code === null || code === undefined) {
    return '';
  }

  return String(code).trim();
}

/**
 * Ensures inventory quantities are positive integers.
 */
function normaliseQuantity(quantity) {
  const number = Number(quantity);

  if (!Number.isFinite(number) || number < 1) {
    return 1;
  }

  return Math.floor(number);
}

/**
 * Validates a YYYY-MM-DD date without allowing
 * impossible calendar dates.
 */
function isValidDateString(date) {
  if (typeof date !== 'string') {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const parsed = new Date(year, month - 1, day);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

/**
 * Creates a local date at midnight from a validated
 * YYYY-MM-DD string.
 */
function parseLocalDate(date) {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day);
}

// ==================================================
// Scan history
// ==================================================

function loadHistory() {
  return loadArray(HISTORY_KEY).filter(
    item =>
      item &&
      typeof item === 'object' &&
      !Array.isArray(item) &&
      normaliseCode(item.code) !== ''
  );
}

/**
 * Products currently in scan history.
 */
export let scans = loadHistory();

/**
 * Saves the current scan history.
 */
function saveHistory() {
  return saveArray(HISTORY_KEY, scans);
}

/**
 * Adds a product to scan history.
 *
 * A repeat scan moves the product to the top
 * and updates its scan timestamp.
 */
export function addToHistory(product) {
  if (!product || typeof product !== 'object') {
    return;
  }

  const code = normaliseCode(product.code);

  if (!code) {
    return;
  }

  scans = [
    {
      ...product,
      code,
      scannedAt: new Date().toISOString()
    },
    ...scans.filter(
      item => normaliseCode(item.code) !== code
    )
  ];

  saveHistory();
}

/**
 * Removes all scan history.
 */
export function clearHistory() {
  scans = [];
  saveHistory();
}

/**
 * Counts scans made within the last seven days.
 */
export function scansThisWeek() {
  const now = Date.now();
  const cutoff = now - 7 * DAY_IN_MS;

  return scans.filter(scan => {
    if (!scan.scannedAt) {
      return false;
    }

    const timestamp = new Date(scan.scannedAt).getTime();

    return (
      Number.isFinite(timestamp) &&
      timestamp >= cutoff &&
      timestamp <= now
    );
  }).length;
}

// ==================================================
// Inventory loading
// ==================================================

function loadInventory() {
  const items = loadArray(INVENTORY_KEY);
  const seenCodes = new Set();

  return items
    .filter(item =>
      item &&
      typeof item === 'object' &&
      !Array.isArray(item) &&
      normaliseCode(item.code) !== ''
    )
    .map(item => ({
      ...item,
      code: normaliseCode(item.code),
      quantity: normaliseQuantity(item.quantity),

      // Keep only stores defined in the shared store list.
      shop: ALLOWED_SHOPS.has(item.shop)
        ? item.shop
        : '',

      bestBeforeDate:
        typeof item.bestBeforeDate === 'string' &&
        isValidDateString(item.bestBeforeDate)
          ? item.bestBeforeDate
          : ''
    }))
    .filter(item => {
      if (seenCodes.has(item.code)) {
        return false;
      }

      seenCodes.add(item.code);
      return true;
    });
}

/**
 * Products currently in inventory.
 */
export let inventoryItems = loadInventory();

/**
 * Saves the current inventory.
 */
function saveInventory() {
  return saveArray(INVENTORY_KEY, inventoryItems);
}

// ==================================================
// Update inventory helper
// ==================================================

/**
 * Updates one inventory item by barcode.
 * The updater must return the updated item.
 */
function updateInventoryItem(code, updater) {
  const targetCode = normaliseCode(code);

  if (!targetCode) {
    return;
  }

  const exists = inventoryItems.some(
    item => item.code === targetCode
  );

  if (!exists) {
    return;
  }

  inventoryItems = inventoryItems.map(item =>
    item.code === targetCode
      ? updater(item)
      : item
  );

  saveInventory();
}
// ==================================================
// Automatic store detection
// ==================================================

function detectProductShop(product) {
  const fields = [
    product.name,
    product.brand,
    product.stores
  ];

  const productInformation = fields
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return STORES.find(shop => {
    if (!shop || shop === 'Other') {
      return false;
    }

    const escapedShop = shop.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const pattern = new RegExp(
      `(^|[^a-z0-9])${escapedShop.toLowerCase()}([^a-z0-9]|$)`,
      'i'
    );

    return pattern.test(productInformation);
  }) || '';
}
// ==================================================
// Add to inventory
// ==================================================

/**
 * Adds a product to inventory.
 *
 * Existing products have their quantity increased.
 * New products start with a quantity of one.
 */
export function addToInventory(product) {
  if (!product || typeof product !== 'object') {
    return;
  }

  const code = normaliseCode(product.code);

  if (!code) {
    return;
  }

  const existing = inventoryItems.find(
    item => item.code === code
  );

  if (existing) {
    increaseInventory(code);
    return;
  }

  const detectedShop = detectProductShop(product);

  inventoryItems = [
    ...inventoryItems,
    {
      ...product,
      code,
      quantity: 1,

      shop:
        typeof product.shop === 'string' &&
        product.shop.trim() !== '' &&
        ALLOWED_SHOPS.has(product.shop)
          ? product.shop
          : detectedShop,

      bestBeforeDate:
        typeof product.bestBeforeDate === 'string' &&
        isValidDateString(product.bestBeforeDate)
          ? product.bestBeforeDate
          : ''
    }
  ];

  saveInventory();
}

// ==================================================
// Increase and decrease quantities
// ==================================================

/**
 * Increases an existing item's quantity by one.
 */
export function increaseInventory(code) {
  console.log('Saving store:', { code, shop });
  updateInventoryItem(code, item => ({
    ...item,
    quantity: normaliseQuantity(item.quantity) + 1
  }));
}

/**
 * Decreases an item's quantity by one.
 * Removes the item when its quantity reaches zero.
 */
export function decreaseInventory(code) {
  const targetCode = normaliseCode(code);

  if (!targetCode) {
    return;
  }

  const existing = inventoryItems.find(
    item => item.code === targetCode
  );

  if (!existing) {
    return;
  }

  const nextQuantity =
    normaliseQuantity(existing.quantity) - 1;

  if (nextQuantity <= 0) {
    removeFromInventory(targetCode);
    return;
  }

  updateInventoryItem(targetCode, item => ({
    ...item,
    quantity: nextQuantity
  }));
}

// ==================================================
// Remove from inventory
// ==================================================

/**
 * Removes all quantities of a product from inventory.
 */
export function removeFromInventory(code) {
  const targetCode = normaliseCode(code);

  if (!targetCode) {
    return;
  }

  const nextItems = inventoryItems.filter(
    item => item.code !== targetCode
  );

  if (nextItems.length === inventoryItems.length) {
    return;
  }

  inventoryItems = nextItems;
  saveInventory();
}

// ==================================================
// Inventory lookup
// ==================================================

/**
 * Checks whether a product is in inventory.
 */
export function isInInventory(code) {
  const targetCode = normaliseCode(code);

  if (!targetCode) {
    return false;
  }

  return inventoryItems.some(
    item => item.code === targetCode
  );
}

/**
 * Returns an inventory item by barcode,
 * or undefined if it is not found.
 */
export function getInventoryItem(code) {
  const targetCode = normaliseCode(code);

  if (!targetCode) {
    return undefined;
  }

  return inventoryItems.find(
    item => item.code === targetCode
  );
}

/**
 * Returns the total number of physical items,
 * including quantities.
 */
export function inventoryCount() {
  return inventoryItems.reduce(
    (total, item) =>
      total + normaliseQuantity(item.quantity),
    0
  );
}

// ==================================================
// Shop tracking
// ==================================================

/**
 * Sets the shop for an inventory item.
 * Pass an empty string to clear the shop.
 */
export function setInventoryShop(code, shop) {
  if (
    typeof shop !== 'string' ||
    !ALLOWED_SHOPS.has(shop)
  ) {
    return;
  }

  updateInventoryItem(code, item => ({
    ...item,
    shop
  }));
}

// ==================================================
// Best-before and expiry tracking
// ==================================================

/**
 * Sets or clears an item's best-before date.
 *
 * Accepts a valid YYYY-MM-DD date or an empty string.
 */
export function setBestBeforeDate(code, date) {
  if (typeof date !== 'string') {
    return;
  }

  if (date !== '' && !isValidDateString(date)) {
    return;
  }

  updateInventoryItem(code, item => ({
    ...item,
    bestBeforeDate: date
  }));
}

/**
 * Returns an item's best-before status:
 * - expired: the date has passed
 * - soon: today or within the next seven days
 * - fresh: more than seven days away
 * - unknown: no valid date
 */
export function getBestBeforeStatus(date) {
  if (!date || !isValidDateString(date)) {
    return 'unknown';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = parseLocalDate(date);

  const daysRemaining = Math.round(
    (target.getTime() - today.getTime()) / DAY_IN_MS
  );

  if (daysRemaining < 0) {
    return 'expired';
  }

  if (daysRemaining <= 7) {
    return 'soon';
  }

  return 'fresh';
}
