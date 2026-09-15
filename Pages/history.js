// Scan history page.
//
// Displays products that have been scanned recently
// and saved to the local scan history.

import { scans } from '../state.js';
import { scanCard } from '../components/scan-card.js';

export function history() {
  return `
    <section class="page history-page">

      <div class="page-header">

        <p class="eyebrow">
          History
        </p>

        <h1>
          Scan history
        </h1>

        <p>
          Everything you've scanned in one place.
        </p>

      </div>

      <div class="section-head">

        <h2>
          Recent scans
        </h2>

        ${
          scans.length
            ? `
              <button
                class="link"
                id="clear-history"
                type="button"
              >
                Clear history
              </button>
            `
            : ''
        }

      </div>

      ${
        scans.length
          ? `
            <div class="scan-list">
              ${scans.map(scanCard).join('')}
            </div>
          `
          : emptyHistory()
      }

    </section>
  `;
}

function emptyHistory() {
  return `
    <div class="empty">

      <div
        class="empty-icon"
        aria-hidden="true"
      >
        ⌗
      </div>

      <h2>
        Your history is clear
      </h2>

      <p>
        Scan a barcode to add your first product.
      </p>

      <a
        class="button"
        href="#scan"
      >
        Scan a barcode
      </a>

    </div>
  `;
}