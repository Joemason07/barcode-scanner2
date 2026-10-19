
import { inventoryItems } from '../state.js';

const nutrients = [
  { key: 'energyKcal', label: 'Energy', unit: 'kcal', decimals: 1 },
  { key: 'energyKj', label: 'Energy', unit: 'kJ', decimals: 1 },
  { key: 'fat', label: 'Fat', unit: 'g', decimals: 1 },
  { key: 'saturatedFat', label: 'Saturates', unit: 'g', decimals: 1 },
  { key: 'carbohydrates', label: 'Carbohydrates', unit: 'g', decimals: 1 },
  { key: 'sugars', label: 'Sugars', unit: 'g', decimals: 1 },
  { key: 'fibre', label: 'Fibre', unit: 'g', decimals: 1 },
  { key: 'protein', label: 'Protein', unit: 'g', decimals: 1 },
  { key: 'salt', label: 'Salt', unit: 'g', decimals: 2 }
];

function getAverage(key) {
  const products = inventoryItems.filter(item => {
    const value = item.nutrition?.[key];

    return value !== null &&
      value !== undefined &&
      value !== '' &&
      Number.isFinite(Number(value));
  });

  if (!products.length) return null;

  const quantity = products.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const total = products.reduce(
    (sum, item) =>
      sum + Number(item.nutrition[key]) * (Number(item.quantity) || 1),
    0
  );

  return {
    value: total / quantity,
    count: products.length
  };
}

function format(value, decimals) {
  return value.toLocaleString('en-GB', {
    maximumFractionDigits: decimals
  });
}

export function analytics() {
  const totalItems = inventoryItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  if (!inventoryItems.length) {
    return `
      <section class="page analytics-page">
        <div class="page-header">
          <p class="eyebrow">Your nutrition</p>
          <h1>Analytics</h1>
          <p>Nutrition information from your inventory.</p>
        </div>

        <div class="empty-state">
          <h2>Your inventory is empty</h2>
          <p>Add products to your inventory to see nutrition information.</p>
          <a class="button" href="#inventory">View inventory</a>
        </div>
      </section>
    `;
  }

  return `
    <section class="page analytics-page">
      <div class="page-header">
        <p class="eyebrow">Your nutrition</p>
        <h1>Analytics</h1>
        <p>Nutrition information from your inventory.</p>
      </div>

      <div class="analytics-summary">
        <span>Total stock quantity</span>
        <strong>${totalItems}</strong>
        <p>${inventoryItems.length} different products</p>
      </div>

      <div class="section-head">
        <h2>Nutrition per 100 g</h2>
      </div>

      <div class="analytics-nutrients">
        ${nutrients.map(nutrient => {
          const result = getAverage(nutrient.key);

          return `
            <article class="analytics-nutrient">
              <div>
                <h2>${nutrient.label}</h2>
                <p>${
                  result
                    ? `Available for ${result.count} products`
                    : 'No data available'
                }</p>
              </div>
              <strong>${
                result
                  ? `${format(result.value, nutrient.decimals)} ${nutrient.unit}`
                  : '—'
              }</strong>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}
