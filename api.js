// Product lookup.
//
// Fetches products from the local Scanly API,
// converts the response into a Scanly product,
// saves successful scans to history,
// and displays the result.

import { app } from './dom.js';
import { addToHistory } from './state.js';
import { createProduct } from './data/product.js';

import {
  productItem,
  missingItem,
  errorItem
} from './pages/item.js';


// --------------------------------------------------
// API configuration
// --------------------------------------------------

const lookupEndpoint =
  window.SCANLY_CONFIG?.lookupEndpoint?.trim() ||
  'http://localhost:8001/api/product';


// --------------------------------------------------
// Product lookup
// --------------------------------------------------

/**
 * Looks up a barcode using the local Scanly API.
 *
 * @param {string} code - Barcode to look up.
 */
export async function lookupProduct(code) {
  if (!code) {
    return;
  }

  try {
    const product = await fetchProduct(code);

    // Product was not found.
    if (!product) {
      showMissingProduct(code);
      return;
    }

    // Save the product to scan history.
    addToHistory(product);

    // Display the product.
    app.innerHTML = productItem(product);

  } catch (error) {
    console.error('Product lookup failed:', error);

    showLookupError(code);
  }
}


// --------------------------------------------------
// API request
// --------------------------------------------------

/**
 * Fetches a product from the local API.
 *
 * Returns null when the barcode does not exist.
 */
async function fetchProduct(code) {
  const url =
    `${lookupEndpoint}/${encodeURIComponent(code)}`;

  const response = await fetch(url);

  // Product does not exist.
  if (response.status === 404) {
    return null;
  }

  // API returned another error.
  if (!response.ok) {
    throw new Error(
      `Catalogue request failed: ${response.status}`
    );
  }

  const data = await response.json();

  // Convert API data into the standard
  // Scanly product format.
  return createProduct(data, code);
}


// --------------------------------------------------
// UI states
// --------------------------------------------------

/**
 * Displays the product-not-found page.
 */
function showMissingProduct(code) {
  app.innerHTML = missingItem(code);

  document
    .querySelector('#try-another')
    ?.addEventListener('click', () => {
      location.hash = 'scan';
    });
}


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