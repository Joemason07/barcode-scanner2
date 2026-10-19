
/*
 * Product ingredients.
 *
 * Displays ingredients as a readable list,
 * automatically highlights recognised allergens,
 * shows a matching colour key, and separates
 * "may contain" warnings from ingredient text.
 */

import { escapeHtml } from '../../utils.js';

import {
  ALLERGENS,
  getAllergenKeys,
  getAllergenKeyForTerm,
  escapeRegExp
} from './allergen-colours.js';


// ==================================================
// Find allergen categories for the colour key
// ==================================================

function getLegendAllergenKeys(product, text, warnings) {
  const keys = new Set(
    getAllergenKeys(product.allergens)
  );

  // Include allergens detected in the ingredient text.
  for (const [key, allergen] of Object.entries(ALLERGENS)) {
    const found = allergen.terms.some(term => {
      const regex = new RegExp(
        `(^|[^a-z])${escapeRegExp(term)}(?=$|[^a-z])`,
        'i'
      );

      return regex.test(text);
    });

    if (found) {
      keys.add(key);
    }
  }

  // Include explicitly marked ingredients, e.g. milk**.
  const markedIngredients = text.matchAll(
    /([^,;*()]+?)\*{1,2}/g
  );

  for (const match of markedIngredients) {
    const key = getAllergenKeyForTerm(
      match[1].trim()
    );

    if (key) {
      keys.add(key);
    }
  }

  // Include allergens named in "may contain" warnings.
  for (const warning of warnings) {
    const key = getAllergenKeyForTerm(warning);

    if (key) {
      keys.add(key);
    }
  }

  // Keep the colour key in the same order as ALLERGENS.
  return Object.keys(ALLERGENS).filter(
    key => keys.has(key)
  );
}


// ==================================================
// Main ingredients component
// ==================================================

export function ingredients(product) {
  const text = decodeEntities(
    product.ingredients || ''
  ).trim();

  if (!text) {
    return '';
  }

  const warnings = extractWarnings(text);

  const cleanedText = removeNonIngredientText(
    removeWarnings(text)
  );

  const items = splitIngredients(cleanedText);

  const legendKeys = getLegendAllergenKeys(
    product,
    text,
    warnings
  );

  if (items.length === 0 && warnings.length === 0) {
    return '';
  }

  return `
    <section class="product-section ingredients-section">

      ${
        items.length
          ? `
            <div class="section-head">
              <h2>Ingredients</h2>
            </div>

            ${
              legendKeys.length
                ? `
                  <div
                    class="allergen-legend"
                    aria-label="Allergen colour key"
                  >
                    <span class="allergen-legend-title">
                      Colour key
                    </span>

                    <ul class="allergen-legend-list">
                      ${legendKeys.map(key => `
                        <li>
                          <span class="allergen-chip allergen-chip--${key}">
                            ${escapeHtml(ALLERGENS[key].label)}
                          </span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                `
                : ''
            }

            <ul class="ingredients-list">
              ${items.map(ingredient => `
                <li class="ingredients-item">
                  ${highlightAllergens(ingredient, product)}
                </li>
              `).join('')}
            </ul>
          `
          : ''
      }

      ${
        warnings.length
          ? `
            <div class="ingredient-warnings">
              <h3>May contain</h3>

              <ul class="ingredient-warning-list">
                ${warnings.map(warning => `
                  <li>${escapeHtml(warning)}</li>
                `).join('')}
              </ul>
            </div>
          `
          : ''
      }

    </section>
  `;
}


// ==================================================
// Split only on commas outside brackets
// ==================================================

function splitIngredients(text) {
  const items = [];
  let current = '';
  let bracketDepth = 0;

  for (const character of text) {
    if (character === '(') {
      bracketDepth++;
    }

    if (character === ')') {
      bracketDepth = Math.max(
        0,
        bracketDepth - 1
      );
    }

    if (character === ',' && bracketDepth === 0) {
      if (current.trim()) {
        items.push(current.trim());
      }

      current = '';
      continue;
    }

    current += character;
  }

  if (current.trim()) {
    items.push(current.trim());
  }

  return items.filter(Boolean);
}


// ==================================================
// Highlight recognised allergens
// ==================================================

function highlightAllergens(text, product = {}) {
  const activeKeys = new Set(
    getAllergenKeys(product.allergens)
  );

  // Automatically detect allergen terms in the text.
  for (const [key, allergen] of Object.entries(ALLERGENS)) {
    const found = allergen.terms.some(term => {
      const regex = new RegExp(
        `(^|[^a-z])${escapeRegExp(term)}(?=$|[^a-z])`,
        'i'
      );

      return regex.test(text);
    });

    if (found) {
      activeKeys.add(key);
    }
  }

  // Build matching terms for all active categories.
  const matches = [...activeKeys].flatMap(key =>
    (ALLERGENS[key]?.terms || []).map(term => ({
      term,
      key
    }))
  );

  // Match longer terms first.
  matches.sort(
    (a, b) => b.term.length - a.term.length
  );

  let result = '';
  let remaining = text;

  while (remaining.length) {
    const found = [];

    for (const item of matches) {
      const regex = new RegExp(
        `(^|[^a-z])(${escapeRegExp(item.term)})(?=$|[^a-z])`,
        'i'
      );

      const match = regex.exec(remaining);

      if (match) {
        found.push({
          ...item,
          index: match.index,
          prefix: match[1],
          matchedText: match[2],
          length: match[0].length
        });
      }
    }

    if (!found.length) {
      result += escapeHtml(remaining);
      break;
    }

    // Choose the earliest match in the remaining text.
    found.sort(
      (a, b) => a.index - b.index
    );

    const match = found[0];

    result += escapeHtml(
      remaining.slice(0, match.index)
    );

    result += escapeHtml(match.prefix);

    result += `
      <strong class="ingredient-allergen ingredient-allergen--${match.key}">
        ${escapeHtml(match.matchedText)}
      </strong>
    `;

    remaining = remaining.slice(
      match.index + match.length
    );
  }

  // Preserve explicitly marked allergens, e.g. milk**.
  return result.replace(
    /(^|[\s(])([^<>,;*]+?)\*{1,2}(?=$|[\s,);])/g,
    (match, prefix, ingredient) => {
      const key = getAllergenKeyForTerm(
        ingredient.trim()
      );

      const category = key || 'unknown';

      return `${prefix}<strong class="ingredient-allergen ingredient-allergen--${category}">${escapeHtml(ingredient.trim())}</strong>`;
    }
  );
}


// ==================================================
// Extract "may contain" warnings
// ==================================================

function extractWarnings(text) {
  const match = text.match(
    /\bmay contain\s+(.+?)(?=,\s*\*\*|;\s*|$)/i
  );

  if (!match) {
    return [];
  }

  return match[1]
    .replace(/[.;]+$/, '')
    .split(/,|\band\b/i)
    .map(item => item.trim())
    .filter(
      item => item.length > 0 && item.length < 80
    );
}


// ==================================================
// Remove warning text from ingredients
// ==================================================

function removeWarnings(text) {
  return text.replace(
    /,?\s*may contain\s+(.+?)(?=,\s*\*\*|;\s*|$)/i,
    ''
  ).trim();
}


// ==================================================
// Remove obvious non-ingredient product copy
// ==================================================

function removeNonIngredientText(text) {
  const marker = text.indexOf(
    '**the equivalent of'
  );

  if (marker !== -1) {
    return text.slice(0, marker).trim();
  }

  return text;
}


// ==================================================
// Decode common HTML entities
// ==================================================

function decodeEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
