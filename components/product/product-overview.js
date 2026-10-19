
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
      label: 'Product type',
      value: product.type
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
      value: product.foodGroups
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

  const unit = product.quantityUnit;

  if (
    unit == null ||
    String(unit).trim() === ''
  ) {
    return String(quantity).trim();
  }

  return `${String(quantity).trim()} ${String(unit).trim()}`;
}
