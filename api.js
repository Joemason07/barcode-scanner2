
/**
 * Product lookup.
 *
 * Supports two data sources:
 * - demo: local products from demo-products.js
 * - api: local Scanly API
 *
 * Saves successful scans to history
 * and displays the product details.
 */

import { app } from './dom.js';
import { addToHistory } from './state.js';
import { createProduct } from './data/product.js';
import { DEMO_PRODUCTS } from './data/demo-products.js';

import {
  productItem,
  missingItem,
  errorItem
} from './pages/item.js';


// --------------------------------------------------
// Configuration
// --------------------------------------------------

const dataSource =
  window.SCANLY_CONFIG?.dataSource || 'demo';

const lookupEndpoint =
  window.SCANLY_CONFIG?.lookupEndpoint?.trim() ||
  'http://localhost:8001/api/product';


// --------------------------------------------------
// Product lookup
// --------------------------------------------------

/**
 * Looks up a product by barcode.
 *
 * @param {string} code - The product barcode.
 */
export async function lookupProduct(code) {
  if (!code) {
    return;
  }

  try {
    const product = await fetchProduct(code);

    if (!product) {
      showMissingProduct(code);
      return;
    }

    // Save the successful scan to history.
    addToHistory(product);

    // Render the product details.
    app.innerHTML = productItem(product);

  } catch (error) {
    console.error('Product lookup failed:', error);

    showLookupError(code);
  }
}


// --------------------------------------------------
// Product data source
// --------------------------------------------------

/**
 * Fetches a product from the selected data source.
 *
 * @param {string} code - The product barcode.
 * @returns {Promise<object|null>}
 */
async function fetchProduct(code) {

  // Temporary local demo mode.
  if (dataSource === 'demo') {
    const data = DEMO_PRODUCTS.find(
      product => String(product.barcode) === String(code)
    );

    if (!data) {
      return null;
    }

    return createProduct(data, code);
  }

  // Original API mode.
  return fetchApiProduct(code);
}


// --------------------------------------------------
// API request
// --------------------------------------------------

/**
 * Fetches a product from the local Scanly API.
 *
 * @param {string} code - The product barcode.
 * @returns {Promise<object|null>}
 */
async function fetchApiProduct(code) {
  const url =
    `${lookupEndpoint}/${encodeURIComponent(code)}`;

  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Catalogue request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return createProduct(data, code);
}


// --------------------------------------------------
// Product not found
// --------------------------------------------------

/**
 * Displays the product-not-found page.
 *
 * @param {string} code - The scanned barcode.
 */
function showMissingProduct(code) {
  app.innerHTML = missingItem(code);

  document
    .querySelector('#try-another')
    ?.addEventListener('click', () => {
      location.hash = 'scan';
    });
}


// --------------------------------------------------
// Lookup error
// --------------------------------------------------

/**
 * Displays the lookup error page.
 */
function showLookupError(code) {
  app.innerHTML = errorItem();

  document
    .querySelector('#retry-lookup')
    ?.addEventListener('click', () => {
      lookupProduct(code);
    });
}
