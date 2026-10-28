
import { toast } from '../dom.js';
import { addToInventory, addToHistory } from '../state.js';
import { createProduct } from '../data/product.js';
/**
 * Sets up live product search and inventory actions.
 */
export function setupProductSearch() {
  const input = document.querySelector('#product-search-input');
  const results = document.querySelector('#product-search-results');
  const form = document.querySelector('#product-search-form');

  if (!input || !results) return;

  let debounceTimer;
  let controller;

  form?.addEventListener('submit', event => {
    event.preventDefault();
  });

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function renderResults(products) {
    if (!products.length) {
      results.innerHTML = `
        <p class="product-search-empty">
          No matching products found.
        </p>
      `;
      return;
    }

    results.innerHTML = products.map(product => {
      const barcode = escapeHTML(product.barcode);
      const name = escapeHTML(
        product.product_name || 'Unnamed product'
      );
      const brand = escapeHTML(product.brands);

      const imageURL =
        typeof product.image_front_url === 'string' &&
        product.image_front_url.startsWith('https://')
          ? escapeHTML(product.image_front_url)
          : '';

      return `
        <div class="product-search-result">

          <button
            type="button"
            class="product-search-open"
            data-product-barcode="${barcode}"
          >
            <span class="product-search-result-image">
              ${
                imageURL
                  ? `<img src="${imageURL}" alt="" loading="lazy">`
                  : '<span aria-hidden="true">🥫</span>'
              }
            </span>

            <span class="product-search-result-info">
              <span class="product-search-result-name">
                ${name}
              </span>

              ${
                brand
                  ? `<span class="product-search-result-brand">${brand}</span>`
                  : ''
              }

              <span class="product-search-result-barcode">
                ${barcode}
              </span>
            </span>

            <span
              class="product-search-result-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </button>

          <button
            type="button"
            class="product-search-add"
            data-add-search-inventory="${barcode}"
          >
            + Add to inventory
          </button>

        </div>
      `;
    }).join('');
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    controller?.abort();

    const query = input.value.trim();

    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }

    results.innerHTML = `
      <p class="product-search-loading">
        Searching products…
      </p>
    `;

    debounceTimer = setTimeout(async () => {
      controller = new AbortController();

      try {
        const response = await fetch(
          `http://localhost:8001/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Product search failed');
        }

        const products = await response.json();

        if (input.value.trim() !== query) return;

        renderResults(products);

      } catch (error) {
        if (error.name === 'AbortError') return;

        results.innerHTML = `
          <p class="product-search-error">
            Unable to search products. Please try again.
          </p>
        `;

        console.error('Product search error:', error);
      }
    }, 300);
  });

  results.addEventListener('click', async event => {
    console.log('Product search result clicked');
    const addButton = event.target.closest(
      '[data-add-search-inventory]'
    );
    console.log('Add to inventory button detected:', !!addButton);

    if (addButton) {
      event.preventDefault();
      event.stopPropagation();

      const barcode = addButton.dataset.addSearchInventory;

      if (!barcode || addButton.disabled) return;

      const originalText = addButton.textContent;
      addButton.disabled = true;
      addButton.textContent = 'Adding…';

      try {
        const response = await fetch(
          `http://localhost:8001/api/product/${encodeURIComponent(barcode)}`
        );

        if (!response.ok) {
          throw new Error('Could not retrieve product details');
        }

        const data = await response.json();
        const product = createProduct(data, barcode);

addToInventory(product);
addToHistory(product);

console.log('Added to inventory and history:', product.code);

addButton.textContent = 'Added ✓';
toast('Product added to inventory.');

      } catch (error) {
        console.error('Add to inventory failed:', error);

        addButton.disabled = false;
        addButton.textContent = originalText;

        toast('Product could not be added to inventory.');
      }

      return;
    }

    const result = event.target.closest('[data-product-barcode]');

if (result) {
  const barcode = result.dataset.productBarcode;

  if (!barcode) return;

  try {
    const response = await fetch(
      `http://localhost:8001/api/product/${encodeURIComponent(barcode)}`
    );

    if (!response.ok) {
      throw new Error('Could not retrieve product details');
    }

    const data = await response.json();
    const product = createProduct(data, barcode);

    console.log('Search result product:', product);
    console.log('Product code:', product.code);

    addToHistory(product);

    console.log('History after selection:', scans);

    location.hash = `item/${encodeURIComponent(barcode)}`;

  } catch (error) {
    console.error('Could not save searched product to history:', error);
    toast('Could not open this product. Please try again.');
  }
}
  });
}
