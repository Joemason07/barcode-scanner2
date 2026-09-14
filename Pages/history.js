import { scans } from '../state.js';
import { scanCard } from '../components/scan-card.js';

export function history() {
  return `
    <section class="page-intro">
      <div class="eyebrow">
        Your library
      </div>

      <h1>Scan history</h1>

      <p>
        Everything you’ve scanned, in one calm place.
      </p>
    </section>


    <div class="section-head">
      <h2>Recent scans</h2>

      ${
        scans.length
          ? `
            <button class="link" id="clear-history">
              Clear history
            </button>
          `
          : ''
      }
    </div>


    ${
      scans.length
        ? scans.map(scanCard).join('')

        : `
          <div class="empty">

            <div class="empty-icon">⌗</div>

            <h2>Your history is clear</h2>

            <p>
              Scan a barcode to add your first product.
            </p>

          </div>
        `
    }
  `;
}