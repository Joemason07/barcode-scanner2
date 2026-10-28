
/*
 * Product overview.
 *
 * Displays the main descriptive information
 * available for a product.
 */

import { escapeHtml } from '../../utils.js';


// ==================================================
// Main product overview
// ==================================================

export function productOverview(product) {
  const rows = [
    {
      label: 'What is it?',
      value: product.genericName
    },
      {
      label: 'Quantity',
      value: formatQuantity(product)
    },
    {
      label: 'Categories',
      value: product.categories
    },
    {
      label: 'Food groups',
      value: formatFoodGroups(product.foodGroups)
    },
    {
      label: 'Countries',
      value: product.countries
    }
  ];

  const availableRows = rows.filter(row => {
    return row.value != null &&
      String(row.value).trim() !== '';
  });

  if (availableRows.length === 0) {
    return '';
  }

  return `
    <section class="product-section">

      <div class="section-head">
        <h2>Product overview</h2>
      </div>

      <dl class="info-list">

        ${availableRows.map(row => `
          <div class="info-row">
            <dt>${escapeHtml(row.label)}</dt>
            <dd>${escapeHtml(String(row.value).trim())}</dd>
          </div>
        `).join('')}

      </dl>

    </section>
  `;
}


// ==================================================
// Quantity
// ==================================================


function formatQuantity(product) {
  const quantity = product.quantity;

  if (
    quantity == null ||
    String(quantity).trim() === ''
  ) {
    return '';
  }

  const value = String(quantity).trim();

  // Reject common placeholder or invalid values.
  if (
    /^(unknown|undefined|null|n\/a)$/i.test(value) ||
    /^1\s*gram$/i.test(value)
  ) {
    return '';
  }

  // PostgreSQL quantity is currently returned as a
  // complete string, e.g. "400 g" or "1 kg".
  return value;
}


function formatFoodGroups(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value
    .split(',')
    .map(group => {
      return group
        .trim()
        .replace(/^[a-z]{2,3}:/i, '')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ');
    })
    .filter(Boolean)
    .map(group => {
      return group.charAt(0).toUpperCase() + group.slice(1);
    })
    .join(', ');
}
