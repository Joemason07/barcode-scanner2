// Scan history: loaded from and saved to localStorage so it survives reloads.
// `scans` is a live binding — other modules that `import { scans }` always
// see the current array, even after it's reassigned in here.

const STORAGE_KEY = 'scanly-history';

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export let scans = loadHistory();

const saveHistory = () =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));

// Adds a looked-up product to the top of the history, removing any earlier
// entry with the same barcode so each code appears once.
export function addToHistory(product) {
  const now = new Date();
  const item = {
    name: product.name,
    code: product.code,
    time: `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    scannedAt: now.toISOString(),
    image: product.image,
    icon: '⌗',
  };
  scans = [item, ...scans.filter(scan => scan.code !== item.code)];
  saveHistory();
}

export function clearHistory() {
  scans = [];
  saveHistory();
}

// Counts scans from the last 7 days, for the "This week" stat on Home.
export function scansThisWeek() {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return scans.filter(scan => new Date(scan.scannedAt || 0).getTime() >= weekAgo).length;
}
