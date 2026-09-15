// Inventory page.
//
// Displays all products that have been scanned
// and saved to the local scan history.

import { scans } from '../state.js';


/**
 * Creates the inventory page.
 */
export function inventory() {
  if (scans.length === 0) {
    return `
      <section class="page inventory-page">
        <div class="page-header">
          <p class="eyebrow">Inventory</p>
          <h1>Your inventory</h1>
          <p>
            Products you have scanned will appear here.
          </p>
        </div>

        <div class="empty-state">
          <div class="empty-state-icon">⌂</div>

          <h2>Your inventory is empty</h2>

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

  return `
    <section class="page inventory-page">
      <div class="page-header">
        <p class="eyebrow">Inventory</p>

        <h1>Your inventory</h1>

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


/**
 * Creates a single inventory item.
 */
function inventoryItem(item) {
  const name =
    item.product_name ||
    item.generic_name ||
    'Unnamed product';

  const brand = item.brands || '';
  const code = item.code || '';

  return `
    <a
      class="inventory-item"
      href="#item/${encodeURIComponent(code)}"
    >
      ${
        item.image_front_url
          ? `
            <img
              class="inventory-item-image"
              src="${escapeHtml(item.image_front_url)}"
              alt=""
              loading="lazy"
            />
          `
          : `
            <div class="inventory-item-image inventory-item-placeholder">
              <span>⌁</span>
            </div>
          `
      }

      <div class="inventory-item-content">
        <h2>${escapeHtml(name)}</h2>

        ${
          brand
            ? `<p>${escapeHtml(brand)}</p>`
            : ''
        }

        <span class="inventory-item-code">
          ${escapeHtml(code)}
        </span>
      </div>
    </a>
  `;
}


/**
 * Escapes text before adding it to HTML.
 */
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
