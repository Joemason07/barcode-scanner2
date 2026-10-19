
/*
 * Product nutrition.
 *
 * Displays available nutrition information per 100g.
 * Missing or invalid values are omitted.
 */

import { escapeHtml } from '../../utils.js';


// ==================================================
// Main nutrition component
// ==================================================

export function nutrition(product) {
  const data = product.nutrition || {};

  const values = [
    {
      label: 'Energy',
      value: formatEnergy(data.energyKcal, data.energyKj)
    },
    {
      label: 'Fat',
      value: formatNutritionValue(data.fat)
    },
    {
      label: 'Saturates',
      value: formatNutritionValue(data.saturatedFat)
    },
    {
      label: 'Carbohydrates',
      value: formatNutritionValue(data.carbohydrates)
    },
    {
      label: 'Sugars',
      value: formatNutritionValue(data.sugars)
    },
    {
      label: 'Fibre',
      value: formatNutritionValue(data.fibre)
    },
    {
      label: 'Protein',
      value: formatNutritionValue(data.protein)
    },
    {
      label: 'Salt',
      value: formatNutritionValue(data.salt)
    }
  ];

  const availableValues = values.filter(
    item => item.value !== ''
  );

  if (availableValues.length === 0) {
    return '';
  }

  return `
    <section class="product-section nutrition-section">

      <div class="section-head">
        <h2>Nutrition</h2>

        <span class="per-100">
          Per 100g
        </span>
      </div>

      <dl class="nutrition-list">
        ${availableValues.map(nutritionRow).join('')}
      </dl>

    </section>
  `;
}


// ==================================================
// Nutrition row
// ==================================================

function nutritionRow(item) {
  return `
    <div class="nutrition-row">
      <dt>${escapeHtml(item.label)}</dt>
      <dd>${item.value}</dd>
    </div>
  `;
}


// ==================================================
// Energy
// ==================================================

function formatEnergy(kcalValue, kjValue) {
  const kcal = parseNutritionNumber(kcalValue);
  const kj = parseNutritionNumber(kjValue);

  if (kcal === null && kj === null) {
    return '';
  }

  const parts = [];

  if (kcal !== null) {
    parts.push(`${formatNumber(kcal)} kcal`);
  }

  if (kj !== null) {
    parts.push(`${formatNumber(kj)} kJ`);
  } else if (kcal !== null) {
    // Approximate conversion if the database has kcal only.
    parts.push(`${formatNumber(kcal * 4.184)} kJ`);
  }

  return parts.map(escapeHtml).join(' / ');
}


// ==================================================
// Nutrition values
// ==================================================

function formatNutritionValue(value) {
  const number = parseNutritionNumber(value);

  if (number === null) {
    return '';
  }

  return `${escapeHtml(formatNumber(number))} g`;
}


// ==================================================
// Validate numeric values
// ==================================================

function parseNutritionNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number;
}


// ==================================================
// Number formatting
// ==================================================

function formatNumber(value) {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 2,
    useGrouping: false
  }).format(value);
}
