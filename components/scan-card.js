
/**
 * Reusable Scanly product card.
 *
 * Used on the Home page and History page.
 * Styled to match the Inventory cards.
 */

import { escapeHtml } from '../utils.js';

export function scanCard(item) {
  const name = item.name || 'Unnamed product';
  const brand = item.brand || '';
  const code = item.code || '';
  const image = item.image || '';
  const time = item.time || item.scannedAt || '';

  return `
    <article class="scan-card">

      <a
        class="scan-card-link"
        href="#item/${encodeURIComponent(code)}"
        aria-label="View ${escapeHtml(name)}"
      >

        <div class="scan-card-image">
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
                  class="scan-card-placeholder"
                  aria-hidden="true"
                >
                  ⌗
                </span>
              `
          }
        </div>

        <div class="scan-card-content">

          ${
            brand
              ? `
                <p class="scan-card-brand">
                  ${escapeHtml(brand)}
                </p>
              `
              : ''
          }

          <h2 class="scan-card-name">
            ${escapeHtml(name)}
          </h2>

          <span class="scan-card-code">
            ${escapeHtml(code)}
          </span>

          ${
            time
              ? `
                <span class="scan-card-time">
                  ${escapeHtml(time)}
                </span>
              `
              : ''
          }

        </div>

        <span
          class="scan-card-arrow"
          aria-hidden="true"
        >
          ›
        </span>

      </a>

    </article>
  `;
}
