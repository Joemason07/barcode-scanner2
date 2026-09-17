// Product detail pages.
//
// Displays loading, successful, missing,
// and error states for a product lookup.
//
// Products can also be added to or removed
// from the user's inventory from this page.

import { escapeHtml } from '../utils.js';

import {
  isInInventory
} from '../state.js';

import { trafficLights } from '../components/traffic-lights.js';


// ==================================================
// Loading state
// ==================================================

export function loadingItem(code) {
  return `
    <a
      class="link"
      href="#history"
    >
      ← Back to history
    </a>

    <div class="product-loading">

      <div class="loader"></div>

      <h2>
        Looking up product
      </h2>

      <p>
        Finding details for
        ${escapeHtml(code)}…
      </p>

    </div>
  `;
}


// ==================================================
// Product details
// ==================================================

export function productItem(product) {
  return `
    <a
      class="link"
      href="#history"
    >
      ← Back to history
    </a>

    ${productHero(product)}

    ${productHeader(product)}

    ${productSummary(product)}

    ${inventoryButton(product)}

    ${trafficLights(product.traffic)}

    ${productInformation(product)}

    ${productDataNote()}
  `;
}


// ==================================================
// Product hero
// ==================================================

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
            <span aria-hidden="true">
              ⌗
            </span>
          `
      }

    </div>
  `;
}


// ==================================================
// Product header
// ==================================================

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


// ==================================================
// Product summary
// ==================================================

function productSummary(product) {
  return `
    <div class="product-grid">

      <div>
        <span>
          Price
        </span>

        <b>
          ${escapeHtml(
            product.price || 'Not available'
          )}
        </b>
      </div>

      <div>
        <span>
          Nutri-Score
        </span>

        <b class="grade">
          ${escapeHtml(
            product.grade || '—'
          )}
        </b>
      </div>

    </div>
  `;
}


// ==================================================
// Inventory button
// ==================================================

function inventoryButton(product) {
  const inInventory =
    isInInventory(product.code);

  if (inInventory) {
    return `
      <div class="item-actions">

        <button
          class="button"
          type="button"
          data-remove-inventory="${escapeHtml(product.code)}"
        >
          Remove from inventory
        </button>

      </div>
    `;
  }

  return `
    <div class="item-actions">

      <button
        class="button"
        type="button"
        data-add-inventory="${escapeHtml(product.code)}"
      >
        Add to inventory
      </button>

    </div>
  `;
}


// ==================================================
// Product information
// ==================================================

function productInformation(product) {
  return `
    <div class="section-head">

      <h2>
        About this product
      </h2>

    </div>

    <p>
      ${escapeHtml(
        product.description ||
        'No description is available for this product.'
      )}
    </p>

    <div class="info-list">

      <div>

        <span>
          Product type
        </span>

        <b>
          ${escapeHtml(
            product.type || 'Product'
          )}
        </b>

      </div>

      <div>

        <span>
          Categories
        </span>

        <b>
          ${escapeHtml(
            product.categories || 'Not listed'
          )}
        </b>

      </div>

      <div>

        <span>
          Ingredients
        </span>

        <b>
          ${escapeHtml(
            product.ingredients || 'Not listed'
          )}
        </b>

      </div>

      <div>

        <span>
          Nutrition
        </span>

        <b>
          ${formatNutrition(product)}
        </b>

      </div>

    </div>
  `;
}


// ==================================================
// Nutrition
// ==================================================

function formatNutrition(product) {
  const energy =
    product.nutrition?.energy_kcal;

  if (energy == null) {
    return 'Not available';
  }

  return `
    ${escapeHtml(energy)}
    kcal per 100g
  `;
}


// ==================================================
// Data note
// ==================================================

function productDataNote() {
  return `
    <p class="data-note">

      The lookup searches Open Food Facts,
      Open Beauty Facts, Open Pet Food Facts,
      and Open Products Facts.

      Traffic-light colours use UK
      front-of-pack solid-food thresholds
      and are calculated from available
      per-100g data.

    </p>
  `;
}


// ==================================================
// Missing product
// ==================================================

export function missingItem(code) {
  return `
    <a
      class="link"
      href="#history"
    >
      ← Back to history
    </a>

    <div class="empty">

      <div class="empty-icon">
        ⌗
      </div>

      <h2>
        Product not found
      </h2>

      <p>
        We couldn’t find details for barcode
        ${escapeHtml(code)}
        in the product catalogue.
      </p>

      <button
        class="scan-action"
        id="try-another"
        type="button"
      >
        Try another barcode
      </button>

    </div>
  `;
}


// ==================================================
// Lookup error
// ==================================================

export function errorItem() {
  return `
    <a
      class="link"
      href="#history"
    >
      ← Back to history
    </a>

    <div class="empty">

      <div class="empty-icon">
        !
      </div>

      <h2>
        Couldn’t load product details
      </h2>

      <p>
        Check your connection and try again.
      </p>

      <button
        class="scan-action"
        id="retry-lookup"
        type="button"
      >
        Try again
      </button>

    </div>
  `;
}