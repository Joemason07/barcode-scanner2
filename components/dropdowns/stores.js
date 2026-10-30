
/**
 * Scanly — Store dropdown
 *
 * Reusable store selection dropdown.
 */

import { escapeHtml } from '../../utils.js';
import { STORES } from '../../data/stores/stores.js';

export { STORES };

/**
 * Renders the store dropdown.
 *
 * @param {string} code - Product barcode.
 * @param {string} selectedShop - Currently selected store.
 * @param {string} productName - Product name for accessibility.
 */
export function storesDropdown(
  code,
  selectedShop = '',
  productName = 'product'
) {
  const safeCode = escapeHtml(code || '');
  const safeName = escapeHtml(productName);
  const currentShop = STORES.includes(selectedShop)
    ? selectedShop
    : '';

  const options = [
    { value: '', label: 'Select a shop' },
    ...STORES.map(shop => ({
      value: shop,
      label: shop
    }))
  ];

  return `
    <label for="inventory-shop-${safeCode}">
      Purchased from
    </label>

    <select
      class="inventory-shop-select"
      id="inventory-shop-${safeCode}"
      data-inventory-shop="${safeCode}"
      aria-label="Shop where ${safeName} was purchased"
    >
      ${options.map(({ value, label }) => `
        <option
          value="${escapeHtml(value)}"
          ${currentShop === value ? 'selected' : ''}
        >
          ${escapeHtml(label)}
        </option>
      `).join('')}
    </select>
  `;
}
