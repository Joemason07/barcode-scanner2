import { escapeHtml } from '../utils.js';


export function scanCard(item) {
  return `
    <a
      class="scan-card"
      href="#item/${encodeURIComponent(item.code)}"
    >

      <div class="code">

        ${
          item.image
            ? `
              <img
                src="${escapeHtml(item.image)}"
                alt=""
              />
            `
            : item.icon
        }

      </div>


      <div>

        <b>
          ${escapeHtml(item.name)}
        </b>

        <small>
          ${escapeHtml(item.code)}
          ·
          ${escapeHtml(item.time)}
        </small>

      </div>


      <span class="scan-card-arrow">
        ›
      </span>

    </a>
  `;
}