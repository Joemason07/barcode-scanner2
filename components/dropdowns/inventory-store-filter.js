
/**
 * Scanly — Inventory store filter
 *
 * Displays stores sorted by product count.
 */

import { STORES } from '../../data/stores/stores.js';

// ==================================================
// Store filter dropdown
// ==================================================

export function inventoryStoreFilter({
  selectedStore = 'All',
  storeCounts = {},
  totalCount = 0
} = {}) {

  // Sort stores by product count, highest first.
  const sortedStores = [
    ...STORES.filter(
      store => store !== 'Other' && store !== 'Select a store'
    ),
    'Other',
    'Select a store'
  ].sort(
    (a, b) => (storeCounts[b] || 0) - (storeCounts[a] || 0)
  );

  return `
    <div class="inventory-filter">

      <label for="inventory-store-filter">
        Filter by store
      </label>

      <select
        id="inventory-store-filter"
        data-inventory-filter
      >

        <option
          value="All"
          ${selectedStore === 'All' ? 'selected' : ''}
        >
          All stores (${totalCount})
        </option>

        ${sortedStores.map(store => `
          <option
            value="${store}"
            ${selectedStore === store ? 'selected' : ''}
          >
            ${store} (${storeCounts[store] || 0})
          </option>
        `).join('')}

      </select>

    </div>
  `;
}
