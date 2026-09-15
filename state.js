// Application state.
//
// Scan history is stored in localStorage so it survives
// page reloads.
//
// Products stored here use the standard Scanly product
// structure created by data/product.js.

const STORAGE_KEY = 'scanly-history';


// --------------------------------------------------
// Load history
// --------------------------------------------------

function loadHistory() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );
  } catch {
    return [];
  }
}

export let scans = loadHistory();


// --------------------------------------------------
// Save history
// --------------------------------------------------

function saveHistory() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(scans)
  );
}


// --------------------------------------------------
// Add scan
// --------------------------------------------------

/**
 * Adds a product to scan history.
 *
 * The most recently scanned product appears first.
 * A barcode only appears once in the history.
 */
export function addToHistory(product) {
  const now = new Date();

  const scannedProduct = {
    ...product,

    scannedAt: now.toISOString(),

    time: `Today, ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  };

  scans = [
    scannedProduct,
    ...scans.filter(
      scan => scan.code !== product.code
    )
  ];

  saveHistory();
}


// --------------------------------------------------
// Clear history
// --------------------------------------------------

export function clearHistory() {
  scans = [];

  saveHistory();
}


// --------------------------------------------------
// Statistics
// --------------------------------------------------

/**
 * Counts scans from the last 7 days.
 */
export function scansThisWeek() {
  const weekAgo =
    Date.now() -
    7 * 24 * 60 * 60 * 1000;

  return scans.filter(scan => {
    const scannedAt =
      new Date(
        scan.scannedAt || 0
      ).getTime();

    return scannedAt >= weekAgo;
  }).length;
}