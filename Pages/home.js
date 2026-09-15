import { scans, scansThisWeek } from '../state.js';
import { scanCard } from '../components/scan-card.js';

export function home() {
  return `
    <section class="hero">
      <div class="eyebrow" style="color:var(--lime)">
        Your everyday scanner
      </div>

      <h1>Upload your lastest shop.</h1>

      <p>
        Scan products, Keep stock, and keep useful details close at hand.
      </p>

      <a class="scan-action" href="#scan">
        <span>⌗</span>
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


    <div class="section-head">
      <h2>Recent scans</h2>

      <a class="link" href="#history">
        View all
      </a>
    </div>


    ${
      scans.length
        ? scans
            .slice(0, 2)
            .map(scanCard)
            .join('')

        : `
          <div class="empty compact">
            <div class="empty-icon">⌗</div>

            <h2>No scans yet</h2>

            <p>
              Scan a barcode to begin your history.
            </p>
          </div>
        `
    }
  `;
}