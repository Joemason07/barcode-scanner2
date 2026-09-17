// Application state.
//
// This file manages:
// - Scan history
// - Inventory
//
// Scan history and inventory are stored separately
// in localStorage.


// ==================================================
// Storage keys
// ==================================================

const HISTORY_KEY = 'scanly-history';
const INVENTORY_KEY = 'scanly-inventory';


// ==================================================
// Scan history
// ==================================================

/**
 * Loads scan history from localStorage.
 */
function loadHistory() {
  try {
    const savedHistory =
      JSON.parse(
        localStorage.getItem(HISTORY_KEY) || '[]'
      );

    if (!Array.isArray(savedHistory)) {
      return [];
    }

    return savedHistory;
  } catch {
    return [];
  }
}


/**
 * Products currently in scan history.
 */
export let scans = loadHistory();


// --------------------------------------------------
// Save history
// --------------------------------------------------

/**
 * Saves scan history to localStorage.
 */
function saveHistory() {
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(scans)
  );
}


// --------------------------------------------------
// Add to history
// --------------------------------------------------

/**
 * Adds a product to scan history.
 *
 * If the product has already been scanned,
 * its old history entry is replaced.
 */
export function addToHistory(product) {
  if (!product?.code) {
    return;
  }

  scans = scans.filter(
    item => item.code !== product.code
  );

  scans = [
    {
      ...product,
      scannedAt: new Date().toISOString()
    },
    ...scans
  ];

  saveHistory();
}


// --------------------------------------------------
// Clear history
// --------------------------------------------------

/**
 * Removes all scan history.
 */
export function clearHistory() {
  scans = [];

  saveHistory();
}


// --------------------------------------------------
// Scans this week
// --------------------------------------------------

/**
 * Counts scans from the last seven days.
 */
export function scansThisWeek() {
  const now = Date.now();

  const sevenDaysAgo =
    now - (7 * 24 * 60 * 60 * 1000);

  return scans.filter(scan => {
    if (!scan.scannedAt) {
      return false;
    }

    const scannedTime =
      new Date(scan.scannedAt).getTime();

    return (
      !Number.isNaN(scannedTime) &&
      scannedTime >= sevenDaysAgo
    );
  }).length;
}


// ==================================================
// Inventory
// ==================================================

/**
 * Loads inventory from localStorage.
 *
 * Older inventory items without a quantity
 * are automatically given quantity = 1.
 */
function loadInventory() {
  try {
    const savedInventory =
      JSON.parse(
        localStorage.getItem(INVENTORY_KEY) || '[]'
      );

    if (!Array.isArray(savedInventory)) {
      return [];
    }

    return savedInventory
      .filter(item => item?.code)
      .map(item => ({
        ...item,
        quantity: normaliseQuantity(item.quantity)
      }));
  } catch {
    return [];
  }
}


/**
 * Makes sure a quantity is always
 * a valid positive number.
 */
function normaliseQuantity(quantity) {
  const number =
    Number(quantity);

  if (!Number.isFinite(number) || number < 1) {
    return 1;
  }

  return Math.floor(number);
}


/**
 * Products currently in inventory.
 *
 * Each item contains a quantity.
 */
export let inventoryItems =
  loadInventory();


// --------------------------------------------------
// Save inventory
// --------------------------------------------------

/**
 * Saves inventory to localStorage.
 */
function saveInventory() {
  localStorage.setItem(
    INVENTORY_KEY,
    JSON.stringify(inventoryItems)
  );
}


// ==================================================
// Add to inventory
// ==================================================

/**
 * Adds a product to inventory.
 *
 * If the product is already there,
 * its quantity increases by one.
 *
 * If it is not there, it is added
 * with a quantity of one.
 */
export function addToInventory(product) {
  if (!product?.code) {
    return;
  }

  const existingItem =
    inventoryItems.find(
      item => item.code === product.code
    );

  if (existingItem) {
    increaseInventory(product.code);
    return;
  }

  inventoryItems = [
    ...inventoryItems,
    {
      ...product,
      quantity: 1
    }
  ];

  saveInventory();
}


// ==================================================
// Increase inventory
// ==================================================

/**
 * Increases the quantity of an existing
 * inventory item by one.
 *
 * This is used by the + button.
 */
export function increaseInventory(code) {
  if (!code) {
    return;
  }

  const exists =
    inventoryItems.some(
      item => item.code === code
    );

  if (!exists) {
    return;
  }

  inventoryItems =
    inventoryItems.map(item => {
      if (item.code !== code) {
        return item;
      }

      return {
        ...item,
        quantity:
          normaliseQuantity(item.quantity) + 1
      };
    });

  saveInventory();
}


// ==================================================
// Decrease inventory
// ==================================================

/**
 * Decreases the quantity of an inventory item
 * by one.
 *
 * When the quantity reaches zero,
 * the item is removed completely.
 *
 * This is used by the − button.
 */
export function decreaseInventory(code) {
  if (!code) {
    return;
  }

  inventoryItems =
    inventoryItems
      .map(item => {
        if (item.code !== code) {
          return item;
        }

        return {
          ...item,
          quantity:
            normaliseQuantity(item.quantity) - 1
        };
      })
      .filter(
        item => item.quantity > 0
      );

  saveInventory();
}


// ==================================================
// Remove from inventory
// ==================================================

/**
 * Removes a product completely from inventory.
 *
 * This removes all quantities of that product.
 *
 * This is used by the × button.
 */
export function removeFromInventory(code) {
  if (!code) {
    return;
  }

  inventoryItems =
    inventoryItems.filter(
      item => item.code !== code
    );

  saveInventory();
}


// ==================================================
// Check inventory
// ==================================================

/**
 * Checks whether a product is currently
 * in the inventory.
 */
export function isInInventory(code) {
  if (!code) {
    return false;
  }

  return inventoryItems.some(
    item => item.code === code
  );
}


// ==================================================
// Get inventory item
// ==================================================

/**
 * Gets a specific inventory item by barcode.
 *
 * Returns undefined if the product isn't
 * currently in inventory.
 */
export function getInventoryItem(code) {
  if (!code) {
    return undefined;
  }

  return inventoryItems.find(
    item => item.code === code
  );
}


// ==================================================
// Inventory count
// ==================================================

/**
 * Returns the total number of physical
 * items in the inventory.
 *
 * Example:
 *
 * Toothpaste × 3
 * Shampoo × 2
 *
 * Returns 5.
 */
export function inventoryCount() {
  return inventoryItems.reduce(
    (total, item) => {
      return total +
        normaliseQuantity(item.quantity);
    },
    0
  );
}