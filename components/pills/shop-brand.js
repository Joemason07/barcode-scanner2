
/**
 * Scanly — Shop brand badge
 *
 * Renders store logos with a text fallback.
 */

import { escapeHtml } from '../../utils.js';
import { SHOPS } from '../../data/stores/brands.js';

function sentenceCase(value) {
  const name = String(value ?? '').trim().toLowerCase();

  return name
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : '';
}

function findKnownShop(name) {
  const entry = Object.entries(SHOPS).find(
    ([key]) => key.toLowerCase() === name.toLowerCase()
  );

  return entry ? entry[1] : null;
}

export function getShopBrand(shop) {
  if (typeof shop !== 'string' || !shop.trim()) {
    return null;
  }

  const name = sentenceCase(shop);
  const knownShop = findKnownShop(name);

  if (knownShop) {
    return {
      ...knownShop,
      name
    };
  }

  // Fallback for stores not in the dropdown.
  return {
    colour: '#666666',
    text: '#FFFFFF',
    name,
    image: null
  };
}

export function shopBadge(shop) {
  const brand = getShopBrand(shop);

  if (!brand) {
    return '';
  }

  const content = brand.image
    ? `
        <img
          class="shop-brand-image"
          src="./assets/stores/${escapeHtml(brand.image)}"
          alt="${escapeHtml(brand.name)}"
          onerror="this.hidden = true; this.nextElementSibling.hidden = false;"
        >
        <span class="shop-brand-logo" hidden>
          ${escapeHtml(brand.name)}
        </span>
      `
    : `
        <span class="shop-brand-logo">
          ${escapeHtml(brand.name)}
        </span>
      `;

  return `
    <span
      class="shop-brand-badge"
      style="--shop-colour: ${brand.colour}; --shop-text: ${brand.text};"
      aria-label="Store: ${escapeHtml(brand.name)}"
    >
      ${content}
    </span>
  `;
}
