
/**
 * Scanly — Pack size pill
 *
 * Displays a consistently formatted product pack size.
 */

import { escapeHtml } from '../../utils.js';

function formatPackSize(packSize) {
  let value = String(packSize).trim();

  // Number only: 24 -> 24x
  if (/^\d+$/.test(value)) {
    return `${value}x`;
  }

  // Standardise decimal separators.
  value = value.replace(/(\d),(\d)/g, '$1.$2');

  // Standardise litre units.
  value = value.replace(/\b(?:litres?|liters?|l)\b/gi, 'L');

  // Standardise millilitre units.
  value = value.replace(/\b(?:millilitres?|milliliters?|ml)\b/gi, 'ml');

  // Standardise gram and kilogram units.
  value = value.replace(/\b(?:grams?|g)\b/gi, 'g');
  value = value.replace(/\b(?:kilograms?|kg)\b/gi, 'kg');

  // Standardise multipack separators.
  value = value.replace(/\s+x\s+/gi, ' × ');

  // Clean up spacing.
  value = value.replace(/\s+/g, ' ').trim();

  return value;
}

export function packSizePill(packSize) {
  if (
    packSize === null ||
    packSize === undefined ||
    String(packSize).trim() === ''
  ) {
    return '';
  }

  const formatted = formatPackSize(packSize);

  return `
    <span class="pack-size-pill">
      ${escapeHtml(formatted)}
    </span>
  `;
}
