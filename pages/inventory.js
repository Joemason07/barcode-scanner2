// Inventory page.
//
// Displays the products that have been added
// to the user's inventory.

import { inventoryItems } from '../state.js';
import { inventoryCard } from '../components/inventory-card.js';

export function inventory() {
  if (inventoryItems.length === 0) {
    return emptyInventory();
  }

  const totalItems = inventoryItems.reduce(
    (total, item) => {
      return total + (item.quantity || 1);
    },
    0
  );

  return `
    <section class="page inventory-page">

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

      <div class="inventory-list">
        ${inventoryItems.map(inventoryCard).join('')}
      </div>

    </section>
  `;
}

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
          Scan a barcode to add a product
          to your inventory.
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