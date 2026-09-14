// Barcode -> product lookup using the local Scanly API.
//
// Scanly runs on localhost:8000.
// The local database API runs on localhost:8001.
// The API then looks up the barcode in PostgreSQL.

import { app } from './dom.js';
import { addToHistory } from './state.js';
import { productItem, missingItem, errorItem } from './templates.js';

const lookupEndpoint =
  window.SCANLY_CONFIG?.lookupEndpoint?.trim()
  || 'http://localhost:8001/api/product';


export async function lookupProduct(code) {
  if (!code) return;

  try {
    const url = `${lookupEndpoint}/${encodeURIComponent(code)}`;

    const response = await fetch(url);

    // Product was not found.
    if (response.status === 404) {
      app.innerHTML = missingItem(code);

      document.querySelector('#try-another').onclick = () => {
        location.hash = 'scan';
      };

      return;
    }

    // API returned another error.
    if (!response.ok) {
      throw new Error('Catalogue request failed');
    }

    // Our local API returns the product directly.
    const p = await response.json();

    // Prefer kcal when available.
    const nutrition = p.energy_kcal_100g != null
      ? `${p.energy_kcal_100g} kcal per 100g`
      : '';

    // Convert the database product into the format
    // the existing Scanly templates expect.
    const product = {
      code: p.barcode || code,

      name:
        p.product_name ||
        p.generic_name ||
        'Unnamed product',

      brand: p.brands,

      image: p.image_front_url,

      description: p.generic_name,

      ingredients: p.ingredients_text,

      categories: p.categories,

      grade: p.nutrition_grade
        ? p.nutrition_grade.toUpperCase()
        : undefined,

      nutrition,

      traffic: {
        fat: p.fat_100g,
        saturates: p.saturated_fat_100g,
        sugars: p.sugars_100g,
        salt: p.salt_100g,
      },
    };

    // Save the product to Scanly history.
    addToHistory(product);

    // Display the product.
    app.innerHTML = productItem(product);

  } catch (error) {
    console.error('Product lookup failed:', error);

    app.innerHTML = errorItem();

    document.querySelector('#retry-lookup').onclick = () => {
      lookupProduct(code);
    };
  }
}