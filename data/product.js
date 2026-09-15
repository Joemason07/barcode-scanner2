// Product data.
//
// This file defines the standard product format
// used throughout Scanly.
//
// The API may return database-specific field names.
// This file converts them into the format used
// by the rest of the application.

/**
 * Creates a Scanly product from API/database data.
 *
 * @param {object} data - Product data from the API.
 * @param {string} fallbackCode - Barcode used if the API has no barcode.
 * @returns {object} A standard Scanly product.
 */
export function createProduct(data = {}, fallbackCode = '') {
    return {
      code: data.barcode || fallbackCode,
  
      name:
        data.product_name ||
        data.generic_name ||
        'Unnamed product',
  
      brand:
        data.brands || '',
  
      image:
        data.image_front_url || '',
  
      description:
        data.generic_name || '',
  
      ingredients:
        data.ingredients_text || '',
  
      categories:
        data.categories || '',
  
      grade:
        data.nutrition_grade
          ? data.nutrition_grade.toUpperCase()
          : '',
  
      nutrition: {
        energy_kcal: data.energy_kcal_100g ?? null
      },
  
      traffic: {
        fat: data.fat_100g ?? null,
        saturates: data.saturated_fat_100g ?? null,
        sugars: data.sugars_100g ?? null,
        salt: data.salt_100g ?? null
      }
    };
  }