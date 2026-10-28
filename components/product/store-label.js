
import { escapeHtml } from '../../utils.js';

export function storeLabel(product) {
  const store = product?.stores?.trim();

  if (!store) {
    return '';
  }

  return `
    <span class="store-label">
      ${escapeHtml(store)}
    </span>
  `;
}
