import { escapeHtml } from '../utils.js';

export function inventoryCard(product) {
  const name =
    product.name || 'Unnamed product';

  const brand =
    product.brand || '';

  const code =
    product.code || '';

  const image =
    product.image || '';

  const quantity =
    product.quantity || 1;

  return `
    <article class="inventory-card">

      <a
        class="inventory-card-link"
        href="#item/${encodeURIComponent(code)}"
      >

        <div class="inventory-card-image">

          ${
            image
              ? `
                <img
                  src="${escapeHtml(image)}"
                  alt="${escapeHtml(name)}"
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
                  ${escapeHtml(brand)}
                </p>
              `
              : ''
          }

          <h2 class="inventory-card-name">
            ${escapeHtml(name)}
          </h2>

          <span class="inventory-card-code">
            ${escapeHtml(code)}
          </span>

        </div>

      </a>

      <div class="inventory-card-footer">

        <span class="inventory-card-quantity-label">
          Quantity
        </span>

        <div
          class="inventory-card-controls"
          aria-label="Quantity controls for ${escapeHtml(name)}"
        >

          <button
            class="inventory-card-button"
            type="button"
            data-inventory-minus="${escapeHtml(code)}"
            aria-label="Remove one ${escapeHtml(name)}"
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
            data-inventory-plus="${escapeHtml(code)}"
            aria-label="Add one ${escapeHtml(name)}"
          >
            +
          </button>

        </div>

        <button
          class="inventory-card-remove"
          type="button"
          data-remove-inventory="${escapeHtml(code)}"
          aria-label="Remove ${escapeHtml(name)} from inventory"
        >
          ×
        </button>

      </div>

    </article>
  `;
}