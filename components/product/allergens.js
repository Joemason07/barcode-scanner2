// Product allergens.
//
// Prefers structured database data.
// Falls back to ingredient text independently
// for allergens and traces.


import { escapeHtml } from '../../utils.js';

import {
  getAllergenKeys,
  getAllergenKeyForTerm,
  formatAllergenName
} from './allergen-colours.js';

// ==================================================
// Declared allergen information
// ==================================================

export function allergens(product) {
  const structuredAllergens = parseList(product.allergens);

  const fallback = extractFromIngredients(
    product.ingredients || ''
  );

  const allergenList =
    structuredAllergens.length > 0
      ? structuredAllergens
      : fallback;

  if (allergenList.length === 0) {
    return '';
  }

  return `
    <section class="product-section allergens-section">
      <div class="section-head">
        <h2>Allergen information</h2>
      </div>

      <div class="allergen-group">
        <h3>Contains</h3>

        <ul class="allergen-list">
          ${allergenList.map(renderItem).join('')}
        </ul>
      </div>
    </section>
  `;
}

// ==================================================
// Parse structured database fields
// ==================================================

function parseList(value) {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value)
    ? value
    : String(value).split(/[;,]/);

  return unique(
    values
      .map(item => String(item).trim())
      .filter(Boolean)
  );
}

// ==================================================
// Extract explicitly marked allergens
// ==================================================

function extractFromIngredients(text) {
  const markedAllergens = [];

  // Open Food Facts may mark allergens with * or **.
  const markerPattern =
    /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ -]*?)\*{1,2}(?=$|[\s,);])/g;

  for (const match of text.matchAll(markerPattern)) {
    const item = match[1].trim();

    if (item) {
      markedAllergens.push(item);
    }
  }

  return unique(markedAllergens);
}

// ==================================================
// Render one allergen item
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

// ==================================================
// Remove duplicates
// ==================================================

function unique(values) {
  const seen = new Set();

  return values.filter(value => {
    const key = value.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
