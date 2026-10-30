
/*
 * Product detail pages.
 *
 * Displays loading, successful, missing,
 * and error states for a product lookup.
 *
 * Products can also be added to or removed
 * from the user's inventory from this page.
 */

import { escapeHtml } from '../utils.js';
import { isInInventory } from '../state.js';

import { trafficLights } from '../components/product/traffic-lights.js';
import { productOverview } from '../components/product/product-overview.js';
import { nutrition } from '../components/product/nutrition.js';
import { ingredients } from '../components/product/ingredients.js';
import { allergens } from '../components/product/allergens.js';
import { traces } from '../components/product/traces.js';
import { nutriScore } from '../components/product/nutriscore.js';
import { packSizePill } from '../components/pills/pack-size.js';
import { shopBadge } from '../components/pills/shop-brand.js';

// ==================================================
// Loading state
// ==================================================

export function loadingItem(code) {
  return `
    <a class="link" href="#history">
      ← Back to history
    </a>

    <div class="product-loading">
      <div class="loader"></div>

      <h2>Looking up product</h2>

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
    <div class="product-detail-page">

      <a class="link product-back-link" href="#history">
        ← Back to history
      </a>

      <div class="product-detail-header">
        ${productHeader(product)}
      </div>

      <div class="product-detail-image">
        ${productHero(product)}
      </div>

      <div class="product-detail-overview">
        ${productOverview(product)}
        ${shopBadge(product.stores?.trim())}
        ${inventoryButton(product)}
      </div>

      <div class="product-detail-nutrition">
        ${trafficLights(product.traffic)}
        ${nutriScore(product)}
        ${nutrition(product)}
      </div>

      <div class="product-detail-information">
        ${productInformation(product)}
        ${ingredients(product)}
        ${allergens(product)}
        ${traces(product)}
      </div>

      ${productDataNote()}

    </div>
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
              alt="${escapeHtml(product.name || 'Product image')}"
              loading="lazy"
            />
          `
          : `
            <span aria-hidden="true">⌗</span>
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
        ${escapeHtml(product.name || 'Unnamed product')}
      </h1>

      <p>
        ${escapeHtml(product.brand || 'Brand not listed')}
      </p>

      ${packSizePill(product.packSize)}
    </section>

    <div class="detail-code">
      ${escapeHtml(product.code || 'Barcode unavailable')}
    </div>
  `;
}


// ==================================================
// Inventory button
// ==================================================

function inventoryButton(product) {
  const code = String(product.code || '');

  if (!code) {
    return '';
  }

  if (isInInventory(code)) {
    return `
      <div class="item-actions">
        <button
          class="button"
          type="button"
          data-remove-inventory="${escapeHtml(code)}"
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
        data-add-inventory="${escapeHtml(code)}"
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
  const description =
    product.genericName ||
    product.categories ||
    '';

  return `
    <section class="product-section">

      <div class="section-head">
        <h2>About this product</h2>
      </div>

      <p>
        ${
          description
            ? escapeHtml(description)
            : 'No description is available for this product.'
        }
      </p>

      ${
        product.countries
          ? `
            <p class="product-meta">
              <strong>Countries:</strong>
              ${escapeHtml(product.countries)}
            </p>
          `
          : ''
      }

    </section>
  `;
}

// ==================================================
// Product data note
// ==================================================

function productDataNote() {
  return `
    <p class="data-note">
      Product information depends on the available
      catalogue data.

      Traffic-light colours use UK front-of-pack
      solid-food thresholds and are calculated
      from available per-100g nutrition data.
    </p>
  `;
}

// ==================================================
// Missing product
// ==================================================

export function missingItem(code) {
  return `
    <a class="link" href="#history">
      ← Back to history
    </a>

    <div class="empty">

      <div class="empty-icon">
        ⌗
      </div>

      <h2>Product not found</h2>

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
    <a class="link" href="#history">
      ← Back to history
    </a>

    <div class="empty">

      <div class="empty-icon">
        !
      </div>

      <h2>Couldn’t load product details</h2>

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
