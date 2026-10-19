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
// Main allergens component
// ==================================================

export function allergens(product) {
  const ingredientsText =
    product.ingredients || '';

  const structuredAllergens =
    parseList(product.allergens);

  const structuredTraces =
    parseList(product.traces);

  const fallback =
    extractFromIngredients(ingredientsText);

  const allergenList =
    structuredAllergens.length > 0
      ? structuredAllergens
      : fallback.allergens;

  const traceList =
    structuredTraces.length > 0
      ? structuredTraces
      : fallback.traces;

  if (
    allergenList.length === 0 &&
    traceList.length === 0
  ) {
    return '';
  }

  return `
    <section class="product-section allergens-section">

      <div class="section-head">
        <h2>Allergen information</h2>
      </div>

      ${
        allergenList.length > 0
          ? `
            <div class="allergen-group">
              <h3>Contains</h3>

              <ul class="allergen-list">
                ${allergenList.map(renderItem).join('')}
              </ul>
            </div>
          `
          : ''
      }

      ${
        traceList.length > 0
          ? `
            <div class="allergen-group">
              <h3>May contain</h3>

              <ul class="allergen-list">
                ${traceList.map(renderItem).join('')}
              </ul>
            </div>
          `
          : ''
      }

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
      .map(item => item.trim())
      .filter(Boolean)
  );
}


// ==================================================
// Extract fallback information from ingredients
// ==================================================

function extractFromIngredients(text) {
  const markedAllergens = [];

  // Open Food Facts may mark allergens with * or **.
  const markerPattern =
    /([A-Za-z][A-Za-z -]*?)\*{1,2}(?=$|[\s,);])/g;

  for (const match of text.matchAll(markerPattern)) {
    markedAllergens.push(match[1].trim());
  }

  const mayContainMatch = text.match(
    /\bmay contain\s+(.+?)(?=,\s*\*\*|;\s*|$)/i
  );

  const traces = mayContainMatch
    ? mayContainMatch[1]
        .split(/,|\band\b/i)
        .map(item => item.trim().replace(/[.;]+$/, ''))
        .filter(item => item.length > 0 && item.length < 80)
    : [];

  return {
    allergens: unique(markedAllergens),
    traces: unique(traces)
  };
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
// Format Open Food Facts tags
// ==================================================

function formatName(value) {
  return value
    .replace(/^en:/i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
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