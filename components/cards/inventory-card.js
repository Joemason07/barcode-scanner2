
/**
 * Scanly — Inventory card
 *
 * Displays product information, shop selection,
 * best-before tracking and quantity controls.
 */

import { escapeHtml } from '../../utils.js';
import { shopBadge } from '../pills/shop-brand.js';
import {expiryStatusPill,daysLeftPill} from '../pills/days-left.js';
import { storesDropdown } from '../dropdowns/stores.js';


export function inventoryCard(product) {
  const name = product.name || 'Unnamed product';
  const brand = product.brand || '';
  const code = String(product.code || '');
  const image = product.image || '';
  const quantity = Math.max(1, Math.floor(Number(product.quantity) || 1));
  const bestBeforeDate = product.bestBeforeDate || '';

  const safeName = escapeHtml(name);
  const safeBrand = escapeHtml(brand);
  const safeCode = escapeHtml(code);
  const safeImage = escapeHtml(image);
  const safeDate = escapeHtml(bestBeforeDate);

  return `
    <article class="inventory-card">

      <!-- Product information -->

      <a
        class="inventory-card-link"
        href="#item/${encodeURIComponent(code)}"
      >
        <div class="inventory-card-image">
          ${
            image
              ? `
                <img
                  src="${safeImage}"
                  alt="${safeName}"
                  loading="lazy"
                />
              `
              : `
                <span
                  class="inventory-card-placeholder"
                  aria-hidden="true"
                >
                  ⌁
                </span>
              `
          }
        </div>

        <div class="inventory-card-content">

          ${
            brand
              ? `
                <p class="inventory-card-brand">
                  ${safeBrand}
                </p>
              `
              : ''
          }

          <h2 class="inventory-card-name">
            ${safeName}
          </h2>

          <span class="inventory-card-code">
            ${safeCode}
          </span>

          <div
            class="inventory-card-shop"
            data-inventory-shop-badge="${safeCode}"
          >
            ${shopBadge(product.shop)}
          </div>

        </div>
      </a>


      <!-- Store and expiry information -->

      <div class="inventory-card-expiry">

        <div class="inventory-card-shop">
          ${storesDropdown(code, product.shop, name)}
        </div>

        <label for="best-before-${safeCode}">
          Best-before date
        </label>

        <input
          id="best-before-${safeCode}"
          type="date"
          value="${safeDate}"
          data-best-before="${safeCode}"
          aria-label="Best-before date for ${safeName}"
        />

        <div class="expiry-status-row">
          ${expiryStatusPill(bestBeforeDate, code)}
          ${daysLeftPill(bestBeforeDate, code)}
        </div>

      </div>


      <!-- Quantity controls -->

      <div class="inventory-card-footer">

        <span class="inventory-card-quantity-label">
          Quantity
        </span>

        <div
          class="inventory-card-controls"
          aria-label="Quantity controls for ${safeName}"
        >
          <button
            class="inventory-card-button"
            type="button"
            data-inventory-minus="${safeCode}"
            aria-label="Remove one ${safeName}"
          >
            −
          </button>

          <span
            class="inventory-card-quantity"
            aria-label="Quantity ${quantity}"
          >
            ${quantity}
          </span>

          <button
            class="inventory-card-button"
            type="button"
            data-inventory-plus="${safeCode}"
            aria-label="Add one ${safeName}"
          >
            +
          </button>
        </div>

        <button
          class="inventory-card-remove"
          type="button"
          data-remove-inventory="${safeCode}"
          aria-label="Remove ${safeName} from inventory"
        >
          ×
        </button>

      </div>

    </article>
  `;
}
