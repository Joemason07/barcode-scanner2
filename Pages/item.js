// Product detail pages.
//
// Displays loading, successful, missing,
// and error states for a product lookup.

import { escapeHtml } from '../utils.js';
import { trafficLights } from '../components/traffic-lights.js';


// --------------------------------------------------
// Loading state
// --------------------------------------------------

/**
 * Displays while a product is being looked up.
 */
export function loadingItem(code) {
  return `
    <a class="link" href="#history">
      ← Back to history
    </a>

    <div class="product-loading">

      <div class="loader"></div>

      <h2>Looking up product</h2>

      <p>
        Finding details for ${escapeHtml(code)}…
      </p>

    </div>
  `;
}


// --------------------------------------------------
// Product details
// --------------------------------------------------

/**
 * Displays a successfully found product.
 */
export function productItem(product) {
  return `
    <a class="link" href="#history">
      ← Back to history
    </a>

    ${productHero(product)}

    ${productHeader(product)}

    ${productSummary(product)}

    ${trafficLights(product.traffic)}

    ${productInformation(product)}

    ${productDataNote()}
  `;
}


// --------------------------------------------------
// Product hero
// --------------------------------------------------

/**
 * Creates the product image area.
 */
function productHero(product) {
  return `
    <div class="detail-hero">
      ${
        product.image
          ? `
            <img
              src="${escapeHtml(product.image)}"
              alt="${escapeHtml(product.name)}"
            />
          `
          : `
            <span aria-hidden="true">⌗</span>
          `
      }
    </div>
  `;
}


// --------------------------------------------------
// Product header
// --------------------------------------------------

/**
 * Creates the product name and brand.
 */
function productHeader(product) {
  return `
    <section class="page-intro">

      <div class="eyebrow">
        Product found
      </div>

      <h1>
        ${escapeHtml(product.name)}
      </h1>

      <p>
        ${escapeHtml(
          product.brand || 'Brand not listed'
        )}
      </p>

    </section>

    <div class="detail-code">
      ${escapeHtml(product.code)}
    </div>
  `;
}


// --------------------------------------------------
// Product summary
// --------------------------------------------------

/**
 * Creates the price and Nutri-Score cards.
 */
function productSummary(product) {
  return `
    <div class="product-grid">

      <div>
        <span>Price</span>

        <b>
          ${escapeHtml(
            product.price || 'Not available'
          )}
        </b>
      </div>

      <div>
        <span>Nutri-Score</span>

        <b class="grade">
          ${escapeHtml(
            product.grade || '—'
          )}
        </b>
      </div>

    </div>
  `;
}


// --------------------------------------------------
// Product information
// --------------------------------------------------

/**
 * Creates the main product information section.
 */
function productInformation(product) {
  return `
    <div class="section-head">
      <h2>About this product</h2>
    </div>

    <p>
      ${escapeHtml(
        product.description ||
        'No description is available for this product.'
      )}
    </p>

    <div class="info-list">

      <div>
        <span>Product type</span>

        <b>
          ${escapeHtml(
            product.type || 'Product'
          )}
        </b>
      </div>

      <div>
        <span>Categories</span>

        <b>
          ${escapeHtml(
            product.categories || 'Not listed'
          )}
        </b>
      </div>

      <div>
        <span>Ingredients</span>

        <b>
          ${escapeHtml(
            product.ingredients || 'Not listed'
          )}
        </b>
      </div>

      <div>
        <span>Nutrition</span>

        <b>
          ${formatNutrition(product)}
        </b>
      </div>

    </div>
  `;
}


// --------------------------------------------------
// Nutrition
// --------------------------------------------------

/**
 * Formats the nutrition information for display.
 */
function formatNutrition(product) {
  const energy = product.nutrition?.energy_kcal;

  if (energy == null) {
    return 'Not available';
  }

  return `${escapeHtml(energy)} kcal per 100g`;
}


// --------------------------------------------------
// Data note
// --------------------------------------------------

/**
 * Displays information about the product data source.
 */
function productDataNote() {
  return `
    <p class="data-note">
      The lookup searches Open Food Facts, Open Beauty Facts,
      Open Pet Food Facts, and Open Products Facts.
      Traffic-light colours use UK front-of-pack solid-food
      thresholds and are calculated from available per-100g data.
    </p>
  `;
}


// --------------------------------------------------
// Missing product
// --------------------------------------------------

/**
 * Displays when a barcode isn't found.
 */
export function missingItem(code) {
  return `
    <a class="link" href="#history">
      ← Back to history
    </a>

    <div class="empty">

      <div class="empty-icon">⌗</div>

      <h2>Product not found</h2>

      <p>
        We couldn’t find details for barcode
        ${escapeHtml(code)}
        in the product catalogue.
      </p>

      <button class="scan-action" id="try-another">
        Try another barcode
      </button>

    </div>
  `;
}


// --------------------------------------------------
// Lookup error
// --------------------------------------------------

/**
 * Displays when the API request fails.
 */
export function errorItem() {
  return `
    <a class="link" href="#history">
      ← Back to history
    </a>

    <div class="empty">

      <div class="empty-icon">!</div>

      <h2>Couldn’t load product details</h2>

      <p>
        Check your connection and try again.
      </p>

      <button class="scan-action" id="retry-lookup">
        Try again
      </button>

    </div>
  `;
}