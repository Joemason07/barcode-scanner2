
 // Home page.
//
// Shows the main scanner action, scan statistics,
// expiring products, and recently scanned products.

import {
  scans,
  scansThisWeek,
  inventoryItems,
  getBestBeforeStatus
} from '../state.js';

import { scanCard } from '../components/cards/scan-card.js';
import { escapeHtml } from '../utils.js';

export function home() {
  return `
    <section class="hero">

      <div
        class="eyebrow"
        style="color:var(--lime)"
      >
        Your everyday scanner
      </div>

      <h1>
        Know what's in your shop.
      </h1>

      <p>
        Scan products, keep track of your stock,
        and keep useful details close at hand.
      </p>

      <a
        class="scan-action"
        href="#scan"
      >
        <span aria-hidden="true">⌗</span>
        Scan a barcode
      </a>

    </section>

    <div class="section-head">
      <h2>Your activity</h2>
    </div>

    <div class="stats">

      <div class="stat">
        <strong>${scans.length}</strong>
        <span>Total scans</span>
      </div>

      <div class="stat">
        <strong>${scansThisWeek()}</strong>
        <span>This week</span>
      </div>

      <div class="stat">
        <strong>${scans.length}</strong>
        <span>Products found</span>
      </div>

    </div>

    ${expiringSoonSection()}

    <div class="section-head">

      <h2>Recent scans</h2>

      <a class="link" href="#history">
        View all
      </a>

    </div>

    ${
      scans.length
        ? `
          <div class="scan-list">
            ${scans
              .slice(0, 2)
              .map(scanCard)
              .join('')}
          </div>
        `
        : emptyHome()
    }
  `;
}

// ==================================================
// Expiring soon
// ==================================================

function expiringSoonSection() {
  const products = inventoryItems
    .filter(item => {
      const status = getBestBeforeStatus(item.bestBeforeDate);

      return status === 'expired' || status === 'soon';
    })
    .sort((a, b) =>
      a.bestBeforeDate.localeCompare(b.bestBeforeDate)
    );

  return `
    <div class="section-head expiry-section-head">
      <h2>Expiring soon</h2>

      <a class="link" href="#inventory">
        View inventory
      </a>
    </div>

    ${
      products.length
        ? `
          <div class="inventory-list expiring-list">
            ${products.map(item => {
              const status = getBestBeforeStatus(
                item.bestBeforeDate
              );

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const expiryDate = new Date(
                `${item.bestBeforeDate}T00:00:00`
              );

              const daysRemaining = Math.round(
                (expiryDate.getTime() - today.getTime()) /
                (24 * 60 * 60 * 1000)
              );

              const daysLabel = daysRemaining < 0
                ? `${Math.abs(daysRemaining)} ${
                    Math.abs(daysRemaining) === 1
                      ? 'day'
                      : 'days'
                  } overdue`
                : daysRemaining === 0
                  ? 'Today'
                  : `${daysRemaining} ${
                      daysRemaining === 1
                        ? 'day'
                        : 'days'
                    } left`;

              const name = item.name || 'Unnamed product';
              const brand = item.brand || '';
              const code = item.code || '';
              const image = item.image || '';
              const quantity = Number(item.quantity) || 1;

              const formattedDate = new Date(
                `${item.bestBeforeDate}T00:00:00`
              ).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return `
                <article class="inventory-card expiring-inventory-card">

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

                  <div class="inventory-card-expiry expiring-card-details">

                    <span class="expiring-date">
                      Best before ${escapeHtml(formattedDate)}
                    </span>

                    <div class="expiring-status-row">

                      <span class="expiry-status expiry-status--${status}">
                        ${status === 'expired'
                          ? 'Past date'
                          : 'Expires soon'}
                      </span>

                      <span class="expiry-days-pill expiry-days-pill--${status}">
                        ${escapeHtml(daysLabel)}
                      </span>

                    </div>
                  </div>

                  <div class="inventory-card-footer">

                    <span class="inventory-card-quantity-label">
                      Quantity
                    </span>

                    <span
                      class="inventory-card-quantity"
                      aria-label="Quantity ${quantity}"
                    >
                      ${quantity}
                    </span>

                  </div>

                </article>
              `;
            }).join('')}
          </div>
        `
        : `
          <div class="empty compact">

            <div
              class="empty-icon"
              aria-hidden="true"
            >
              ✓
            </div>

            <h2>All clear</h2>

            <p>
              No products are expiring within the next 7 days.
              Add best-before dates in your inventory to keep
              track of them here.
            </p>

          </div>
        `
    }
  `;
}

// ==================================================
// Empty home state
// ==================================================

function emptyHome() {
  return `
    <div class="empty compact">

      <div
        class="empty-icon"
        aria-hidden="true"
      >
        ⌗
      </div>

      <h2>No scans yet</h2>

      <p>
        Scan a barcode to begin your history.
      </p>

    </div>
  `;
}
