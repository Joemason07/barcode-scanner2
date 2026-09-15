// Inventory page.
//
// Displays products that have been scanned
// and saved to the local scan history.

import { scans } from '../state.js';
import { escapeHtml } from '../utils.js';


// --------------------------------------------------
// Inventory page
// --------------------------------------------------

/**
 * Creates the inventory page.
 */
export function inventory() {
  if (scans.length === 0) {
    return emptyInventory();
  }

  return `
    <section class="page inventory-page">

      <div class="page-header">

        <p class="eyebrow">
          Inventory
        </p>

        <h1>
          Your inventory
        </h1>

        <p>
          ${scans.length}
          ${scans.length === 1 ? 'product' : 'products'}
          scanned.
        </p>

      </div>

      <div class="inventory-list">
        ${scans.map(inventoryItem).join('')}
      </div>

    </section>
  `;
}


// --------------------------------------------------
// Empty inventory
// --------------------------------------------------

/**
 * Creates the empty inventory state.
 */
function emptyInventory() {
  return `
    <section class="page inventory-page">

      <div class="page-header">

        <p class="eyebrow">
          Inventory
        </p>

        <h1>
          Your inventory
        </h1>

        <p>
          Products you have scanned will appear here.
        </p>

      </div>

      <div class="empty-state">

        <div class="empty-state-icon">
          ⌁
        </div>

        <h2>
          Your inventory is empty
        </h2>

        <p>
          Scan a barcode to add a product to your inventory.
        </p>

        <a class="button" href="#scan">
          Scan a barcode
        </a>

      </div>

    </section>
  `;
}


// --------------------------------------------------
// Inventory item
// --------------------------------------------------

/**
 * Creates a single inventory item.
 */
function inventoryItem(product) {
  const name =
    product.name ||
    'Unnamed product';

  const brand =
    product.brand || '';

  const code =
    product.code || '';

  return `
    <a
      class="inventory-item"
      href="#item/${encodeURIComponent(code)}"
    >

      ${
        product.image
          ? `
            <img
              class="inventory-item-image"
              src="${escapeHtml(product.image)}"
              alt=""
              loading="lazy"
            />
          `
          : `
            <div
              class="inventory-item-image inventory-item-placeholder"
              aria-hidden="true"
            >
              <span>⌁</span>
            </div>
          `
      }

      <div class="inventory-item-content">

        <h2>
          ${escapeHtml(name)}
        </h2>

        ${
          brand
            ? `
              <p>
                ${escapeHtml(brand)}
              </p>
            `
            : ''
        }

        <span class="inventory-item-code">
          ${escapeHtml(code)}
        </span>

      </div>

    </a>
  `;
}