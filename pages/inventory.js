
/**
 * Scanly — Inventory page
 *
 * Groups inventory products by store.
 * Products without a selected store appear under Select a store.
 */

import { inventoryItems } from '../state.js';
import { inventoryCard } from '../components/cards/inventory-card.js';
import { shopBadge } from '../components/pills/shop-brand.js';
import { inventoryStoreFilter } from '../components/dropdowns/inventory-store-filter.js';
import { STORES } from '../data/stores/stores.js';

// ==================================================
// Inventory filter
// ==================================================

let selectedStoreFilter = 'All';

export function setInventoryFilter(store) {
  selectedStoreFilter = store || 'All';
}

// ==================================================
// Inventory page
// ==================================================

export function inventory() {
  if (inventoryItems.length === 0) {
    return emptyInventory();
  }

  // Total quantity of items.
  const totalItems = inventoryItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  // Group products by store.
  const allGroups = groupInventoryByStore();

  // Count products in each store.
  const storeCounts = Object.fromEntries(
    allGroups.map(group => [
      group.store,
      group.products.length
    ])
  );

  // Total number of products.
  const totalCount = allGroups.reduce(
    (total, group) => total + group.products.length,
    0
  );

  // Apply selected store filter.
  const groups = selectedStoreFilter === 'All'
    ? allGroups
    : allGroups.filter(
        group => group.store === selectedStoreFilter
      );

  return `
    <section class="page inventory-page">

      <!-- Page header -->
      <div class="page-header">

        <p class="eyebrow">Inventory</p>

        <h1>Your inventory</h1>

        <p>
          ${totalItems}
          ${totalItems === 1 ? 'item' : 'items'}
          across
          ${inventoryItems.length}
          ${inventoryItems.length === 1 ? 'product' : 'products'}.
        </p>

      </div>

      <!-- Store filter -->
      ${inventoryStoreFilter({
        selectedStore: selectedStoreFilter,
        storeCounts,
        totalCount
      })}

      <!-- Inventory groups -->
      <div class="inventory-groups">

        ${groups.map(({ store, products }) => `
          <section class="inventory-store-section">

            <div class="inventory-store-heading">

              <div class="inventory-store-identity">

                <div class="inventory-store-logo">
                  ${shopBadge(store)}
                </div>

              </div>

              <span class="inventory-store-count">
                ${products.length}
                ${products.length === 1 ? 'product' : 'products'}
              </span>

            </div>

            <div class="inventory-list">
              ${products.map(inventoryCard).join('')}
            </div>

          </section>
        `).join('')}

      </div>

    </section>
  `;
}

// ==================================================
// Group inventory by store
// ==================================================

function groupInventoryByStore() {
  const groups = new Map();

  // Create a group for each recognised store.
  STORES
    .filter(
      store => store !== 'Other' && store !== 'Select a store'
    )
    .forEach(store => {
      groups.set(store, []);
    });

  groups.set('Other', []);
  groups.set('Select a store', []);

  // Assign each product to its store.
  inventoryItems.forEach(product => {
    const selectedShop = String(product.shop || '').trim();

    // Products without a store.
    if (!selectedShop) {
      groups.get('Select a store').push(product);
      return;
    }

    // Products assigned to Other.
    if (selectedShop.toLowerCase() === 'other') {
      groups.get('Other').push(product);
      return;
    }

    // Find the matching store.
    const matchingStore = [...groups.keys()].find(
      store =>
        store !== 'Other' &&
        store !== 'Select a store' &&
        store.toLowerCase() === selectedShop.toLowerCase()
    );

    if (matchingStore) {
      groups.get(matchingStore).push(product);
    } else {
      groups.get('Select a store').push(product);
    }
  });

  // Return only stores containing products.
  return [...groups.entries()]
    .filter(([, products]) => products.length > 0)
    .map(([store, products]) => ({
      store,
      products
    }));
}

// ==================================================
// Empty inventory
// ==================================================

function emptyInventory() {
  return `
    <section class="page inventory-page">

      <div class="page-header">

        <p class="eyebrow">Inventory</p>

        <h1>Your inventory</h1>

        <p>
          Products you add will appear here.
        </p>

      </div>

      <div class="empty-state">

        <div
          class="empty-state-icon"
          aria-hidden="true"
        >
          ⌁
        </div>

        <h2>Your inventory is empty</h2>

        <p>
          Search for a product or scan its barcode
          to start building your inventory.
        </p>

        <a
          class="button"
          href="#scan"
        >
          Scan a barcode
        </a>

      </div>

    </section>
  `;
}
