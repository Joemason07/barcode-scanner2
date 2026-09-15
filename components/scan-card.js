// Reusable scan card.
//
// Displays a scanned product in lists such as
// the Home page and History page.

import { escapeHtml } from '../utils.js';


// --------------------------------------------------
// Scan card
// --------------------------------------------------

export function scanCard(item) {
  const name =
    item.name || 'Unnamed product';

  const code =
    item.code || '';

  const time =
    item.time || '';

  return `
    <a
      class="scan-card"
      href="#item/${encodeURIComponent(code)}"
    >

      <div class="code">

        ${
          item.image
            ? `
              <img
                src="${escapeHtml(item.image)}"
                alt=""
                loading="lazy"
              />
            `
            : `
              <span aria-hidden="true">
                ⌗
              </span>
            `
        }

      </div>


      <div>

        <b>
          ${escapeHtml(name)}
        </b>

        <small>
          ${escapeHtml(code)}
          ${
            time
              ? ` · ${escapeHtml(time)}`
              : ''
          }
        </small>

      </div>


      <span
        class="scan-card-arrow"
        aria-hidden="true"
      >
        ›
      </span>

    </a>
  `;
}