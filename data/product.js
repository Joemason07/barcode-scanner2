
/**
 * Product data.
 *
 * Converts the PostgreSQL API response into Scanly's
 * standard frontend product format.
 *
 * raw_data is not required or returned by the API.
 */

export function createProduct(data = {}, fallbackCode = '') {
  return {
    // Identity
    id: data.id ?? null,
    code: data.barcode || fallbackCode,
    name:
      data.product_name ||
      data.generic_name ||
      'Unnamed product',
    brand: data.brands || '',
    genericName: data.generic_name || '',

    // Product information
    categories: data.categories || '',
    countries: data.countries || '',
    quantity: data.quantity || '',
    servingSize: data.serving_size || '',
    servingQuantity: data.serving_quantity ?? null,

    // Ingredients and allergens
    ingredients: data.ingredients_text || '',
    ingredientsData: data.ingredients ?? null,
    allergens: data.allergens || '',
    traces: data.traces || '',
    additivesCount: data.additives_n ?? null,
    additives: data.additives_tags ?? [],

    // Images
    image: data.image_front_url || '',
    imageIngredients: data.image_ingredients_url || '',
    images: data.images ?? null,
    selectedImages: data.selected_images ?? null,

    // Nutrition per 100 g
    nutrition: {
      energyKcal: data.energy_kcal_100g ?? null,
      energyKj: data.energy_kj_100g ?? null,
      fat: data.fat_100g ?? null,
      saturatedFat: data.saturated_fat_100g ?? null,
      carbohydrates: data.carbohydrates_100g ?? null,
      sugars: data.sugars_100g ?? null,
      fibre: data.fiber_100g ?? null,
      protein: data.proteins_100g ?? null,
      salt: data.salt_100g ?? null
    },

    /// Nutri-Score
      grade: normalizeNutriScoreGrade(
        data.nutriscore_grade ||
        data.nutrition_grade
      ),
    nutriscoreScore: data.nutriscore_score ?? null,
    nutriscoreData: data.nutriscore_data ?? null,
    nutriscoreVersion: data.nutriscore_version || '',
    nutritionInputSets: data.nutrition_input_sets ?? null,

    // Traffic lights
    traffic: {
      fat: data.fat_100g ?? null,
      saturates: data.saturated_fat_100g ?? null,
      sugars: data.sugars_100g ?? null,
      salt: data.salt_100g ?? null
    },

    // Food processing
    novaGroup: data.nova_group ?? null,
    foodGroups: data.food_groups ?? null,

    // Environmental impact
    ecoScoreGrade: data.ecoscore_grade || '',
    ecoScoreScore: data.ecoscore_score ?? null,
    environmentalScoreData:
      data.environmental_score_data ?? null,

    // Packaging
    packaging: data.packaging || '',
    packagings: data.packagings ?? null,
    packagingRecyclingTags:
      data.packaging_recycling_tags ?? [],

    // Labels
    labels: data.labels || '',
    labelsTags: data.labels_tags ?? [],

    // Origins and manufacturing
    origins: data.origins || '',
    manufacturingPlaces: data.manufacturing_places || '',

    // Retail information
    stores: data.stores || '',
    purchasePlaces: data.purchase_places || '',

    // Data quality
    completeness: data.completeness ?? null,
    dataQualityTags: data.data_quality_tags ?? [],
    dataSourcesTags: data.data_sources_tags ?? [],

    // Timestamps
    lastModified: data.last_modified ?? null,
    createdAt: data.created_t ?? null,
    lastModifiedAt: data.last_modified_t ?? null,
    lastUpdatedAt: data.last_updated_t ?? null
  };

  // ==================================================
// Nutri-Score validation
// ==================================================

function normalizeNutriScoreGrade(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const grade = value.trim().toLowerCase();

  return ['a', 'b', 'c', 'd', 'e'].includes(grade)
    ? grade
    : '';
}
}
