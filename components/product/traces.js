
import { escapeHtml } from '../../utils.js';

import {
  getAllergenKeys,
  getAllergenKeyForTerm,
  formatAllergenName
} from './allergen-colours.js';

// ==================================================
// Product traces component
// ==================================================

export function traces(product) {
  const items = parseTraces(product.traces);

  if (items.length === 0) {
    return '';
  }

  return `
    <section class="product-section traces-section">
      <div class="section-head">
        <h2>May contain</h2>
      </div>

      <ul class="allergen-list">
        ${items.map(renderItem).join('')}
      </ul>

      <p class="traces-note">
        This information indicates possible cross-contamination.
        Check the product packaging if you have an allergy.
      </p>
    </section>
  `;
}

// ==================================================
// Parse trace data
// ==================================================

function parseTraces(value) {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value)
    ? value
    : String(value).split(/[;,]/);

  return [...new Set(
    values
      .map(item => String(item).trim())
      .filter(Boolean)
      .map(item => item.replace(/^en:/i, ''))
  )];
}

// ==================================================
// Render one trace
// ==================================================

function renderItem(item) {
  const key =
    getAllergenKeys(item)[0] ||
    getAllergenKeyForTerm(item) ||
    'unknown';

  return `
    <li class="allergen-item">
      <span class="allergen-chip allergen-chip--${key}">
        ${escapeHtml(formatAllergenName(item))}
      </span>
    </li>
  `;
}
