// Product data.
//
// This file converts the API response into
// the standard product format used by Scanly.
//
// The API uses database column names.
// Scanly uses a cleaner frontend structure.
//
// Database/API:
//   product_name
//   energy_kcal_100g
//   saturated_fat_100g
//
// Scanly:
//   product.name
//   product.nutrition.energyKcal
//   product.nutrition.saturatedFat


/**
 * Creates a Scanly product from API data.
 *
 * @param {object} data
 *   Product data returned by the Scanly API.
 *
 * @param {string} fallbackCode
 *   Barcode to use if the API does not provide one.
 *
 * @returns {object}
 *   Product in Scanly's standard format.
 */
export function createProduct(
  data = {},
  fallbackCode = ''
) {
  return {
    // ==================================================
    // Identity
    // ==================================================

    id:
      data.id ?? null,

    code:
      data.barcode ||
      fallbackCode,

    name:
      data.product_name ||
      data.generic_name ||
      'Unnamed product',

    brand:
      data.brands ||
      '',

    genericName:
      data.generic_name ||
      '',


    // ==================================================
    // Product information
    // ==================================================

    categories:
      data.categories ||
      '',

    countries:
      data.countries ||
      '',

    // ==================================================
    // Ingredients & allergens
    // ==================================================

    ingredients:
      data.ingredients_text ||
      '',

    allergens:
      data.allergens ||
      '',

    traces:
      data.traces ||
      '',

    // ==================================================
    // Images
    // ==================================================

    image:
      data.image_front_url ||
      '',

    imageIngredients:
      data.image_ingredients_url ||
      '',


    // ==================================================
    // Nutrition
    // ==================================================

    nutrition: {
      energyKcal:
        data.energy_kcal_100g ?? null,

      fat:
        data.fat_100g ?? null,

      saturatedFat:
        data.saturated_fat_100g ?? null,

      carbohydrates:
        data.carbohydrates_100g ?? null,

      sugars:
        data.sugars_100g ?? null,

      fibre:
        data.fiber_100g ?? null,

      protein:
        data.proteins_100g ?? null,

      salt:
        data.salt_100g ?? null
    },


    // ==================================================
    // Nutri-Score
    // ==================================================

    grade:
      data.nutriscore_grade ||
      data.nutrition_grade ||
      '',

    nutriscoreScore:
      data.nutriscore_score ?? null,


    // ==================================================
    // Nutrition traffic lights
    // ==================================================

    traffic: {
      fat:
        data.fat_100g ?? null,

      saturates:
        data.saturated_fat_100g ?? null,

      sugars:
        data.sugars_100g ?? null,

      salt:
        data.salt_100g ?? null
    },


    // ==================================================
    // Data information
    // ==================================================

    lastModified:
      data.last_modified ||
      null
  };
}