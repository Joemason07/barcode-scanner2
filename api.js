// Barcode -> product lookup, either via a configured Supabase proxy
// (window.SCANLY_CONFIG.lookupEndpoint, set in config.js) or directly
// against the public Open Food Facts API.

import { app } from './dom.js';
import { addToHistory } from './state.js';
import { productItem, missingItem, errorItem } from './templates.js';

const lookupEndpoint = window.SCANLY_CONFIG?.lookupEndpoint?.trim();

export async function lookupProduct(code) {
  if (!code) return;

  try {
    const fields = 'code,product_name,brands,image_front_url,generic_name,ingredients_text,categories,nutrition_grades,nutriments,product_type';
    const source = lookupEndpoint
      || `https://world.openfoodfacts.org/api/v3.6/product/${encodeURIComponent(code)}.json?fields=${fields}&product_type=all`;

    const response = await fetch(
      lookupEndpoint ? `${lookupEndpoint}?barcode=${encodeURIComponent(code)}` : source
    );

    if (response.status === 404) {
      app.innerHTML = missingItem(code);
      document.querySelector('#try-another').onclick = () => location.hash = 'scan';
      return;
    }
    if (!response.ok) throw new Error('Catalogue request failed');

    const data = await response.json();
    if (!(['success', 1].includes(data.status)) || !data.product) {
      app.innerHTML = missingItem(code);
      document.querySelector('#try-another').onclick = () => location.hash = 'scan';
      return;
    }

    const p = data.product;
    const nutriments = p.nutriments || {};

    // Prefer kcal; fall back to kJ if that's the only energy value present.
    const nutrition = nutriments['energy-kcal_100g']
      ? `${nutriments['energy-kcal_100g']} kcal per 100g`
      : nutriments.energy
        ? `${nutriments.energy} kJ per 100g`
        : '';

    const product = {
      code: p.code || code,
      name: p.product_name || p.generic_name || 'Unnamed product',
      brand: p.brands,
      image: p.image_front_url,
      description: p.generic_name,
      ingredients: p.ingredients_text,
      categories: p.categories,
      type: p.product_type?.replace(/^./, letter => letter.toUpperCase()),
      grade: p.nutrition_grades?.toUpperCase(),
      nutrition,
      traffic: {
        fat: nutriments.fat_100g,
        saturates: nutriments['saturated-fat_100g'],
        sugars: nutriments.sugars_100g,
        // Some products only report sodium; salt ≈ sodium × 2.5.
        salt: nutriments.salt_100g ?? (nutriments.sodium_100g ? nutriments.sodium_100g * 2.5 : undefined),
      },
    };

    addToHistory(product);
    app.innerHTML = productItem(product);
  } catch {
    app.innerHTML = errorItem();
    document.querySelector('#retry-lookup').onclick = () => lookupProduct(code);
  }
}
