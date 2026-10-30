
/**
 * Scanly — Demo Products
 *
 * Local product catalogue for laptop development.
 * Product objects follow the API response structure.
 *
 * Current products:
 * 1. FAGE Total 0% Fat Greek Yoghurt
 * 2. Tesco British Chicken Breast Fillets
 * 3. Coca-Cola
 */

export const DEMO_PRODUCTS = [
    // ==================================================
    // 1. FAGE Total 0% Fat Greek Yoghurt
    // ==================================================
  
    {
      id: 2311912,
      barcode: '5201054017418',
  
      product_name: 'Total 0% fat',
      generic_name: null,
      brands: 'FAGE',
      quantity: '450 g',
  
      categories: null,
      countries: null,
      stores: null,
      purchase_places: null,
      origins: null,
      manufacturing_places: null,
  
      image_front_url:
        'https://images.openfoodfacts.org/images/products/520/105/401/7418/front_en.74.400.jpg',
      image_ingredients_url: null,
  
      ingredients_text:
        'Pasteurised skimmed milk, cultures (L. Bulgaricus, S. Thermophilus, L.Acidophilus, Bifidus, L. Casei)',
  
      ingredients: [
        {
          id: 'en:pasteurized-skimmed-milk',
          text: 'Pasteurised skimmed milk',
          vegan: 'no',
          vegetarian: 'yes',
          percent_max: 100,
          percent_min: 50,
          percent_estimate: 75,
          is_in_taxonomy: 1
        },
        {
          id: 'en:microbial-culture',
          text: 'cultures',
          vegan: 'maybe',
          vegetarian: 'maybe',
          percent_max: 50,
          percent_min: 0,
          percent_estimate: 25,
          is_in_taxonomy: 1,
          ingredients: [
            {
              id: 'en:lactobacillus-bulgaricus',
              text: 'lactobacillus bulgaricus',
              vegan: 'maybe',
              vegetarian: 'yes',
              percent_estimate: 12.5
            },
            {
              id: 'en:streptococcus-thermophilus',
              text: 'streptococcus thermophilus',
              vegan: 'maybe',
              vegetarian: 'yes',
              percent_estimate: 6.25
            },
            {
              id: 'en:lactobacillus-acidophilus',
              text: 'lactobacillus acidophilus',
              vegan: 'maybe',
              vegetarian: 'yes',
              percent_estimate: 3.125
            },
            {
              id: 'en:bifidus',
              text: 'Bifidus',
              vegan: 'maybe',
              vegetarian: 'yes',
              percent_estimate: 1.5625
            },
            {
              id: 'en:lactobacillus-casei',
              text: 'lactobacillus casei',
              vegan: 'maybe',
              vegetarian: 'yes',
              percent_estimate: 1.5625
            }
          ]
        }
      ],
  
      allergens: null,
      traces: null,
  
      additives_n: 0,
      additives_tags: [],
  
      energy_kcal_100g: 54,
      fat_100g: 0,
      saturated_fat_100g: 0,
      carbohydrates_100g: 3,
      sugars_100g: 3,
      fiber_100g: 0,
      proteins_100g: 10.3,
      salt_100g: 0.1,
  
      serving_size: '1 portion (100 g)',
      serving_quantity: 100,
  
      nutrition_grade: null,
      nutriscore_grade: 'a',
      nutriscore_score: -4,
      nutriscore_version: '2023',
  
      nutriscore_data: {
        grade: 'a',
        score: -4,
        is_water: 0,
        is_cheese: 0,
        components: {
          negative: [
            { id: 'energy', unit: 'kJ', value: 226.1, points: 0, points_max: 10 },
            { id: 'sugars', unit: 'g', value: 3, points: 0, points_max: 15 },
            { id: 'saturated_fat', unit: 'g', value: 0, points: 0, points_max: 10 },
            { id: 'salt', unit: 'g', value: 0.1, points: 0, points_max: 20 }
          ],
          positive: [
            { id: 'proteins', unit: 'g', value: 10.3, points: 4, points_max: 7 },
            { id: 'fiber', unit: 'g', value: 0, points: 0, points_max: 5 },
            { id: 'fruits_vegetables_legumes', unit: '%', value: 0, points: 0, points_max: 5 }
          ]
        }
      },
  
      food_groups: 'en:milk-and-yogurt',
      nova_group: 1,
  
      labels: null,
      labels_tags: [
        'en:low-or-no-fat',
        'en:vegetarian',
        'en:no-gluten',
        'en:no-preservatives',
        'en:calcium-source',
        'en:no-added-sugar',
        'en:no-additives',
        'en:no-fat',
        'en:vegetarian-society'
      ],
  
      packaging:
        'Foil lid, Paper disk, Polypropylene lid, Polypropylene pot, en:pp-tub',
  
      packagings: [],
      packaging_recycling_tags: [],
  
      ecoscore_grade: null,
      ecoscore_score: null,
  
      environmental_score_data: {
        grade: 'b',
        score: 71
      },
  
      completeness: 0.8,
      last_modified: '2026-05-29T15:25:21+01:00'
    },
  
    // ==================================================
    // 2. Tesco British Chicken Breast Fillets
    // ==================================================
  
    {
      id: 3914592,
      barcode: '5063250546662',
  
      product_name: 'BRITISH CHICKEN BREAST FILLETS',
      brands: 'TESCO',
      generic_name: null,
      quantity: null,
  
      categories:
        'Meats and their products, Meats, Chicken and its products, Poultries, Chickens, en:chicken-breasts',
  
      countries: 'en:United Kingdom',
      stores: 'Tesco',
  
      image_front_url:
        'https://images.openfoodfacts.org/images/products/506/325/054/6662/front_en.43.400.jpg',
      image_ingredients_url: null,
  
      ingredients_text: 'Chicken',
  
      ingredients: [
        {
          id: 'en:chicken',
          text: 'Chicken',
          vegan: 'no',
          vegetarian: 'no',
          percent_max: 100,
          percent_min: 100,
          percent_estimate: 100,
          is_in_taxonomy: 1
        }
      ],
  
      allergens: null,
      traces: null,
  
      additives_n: 0,
      additives_tags: [],
  
      energy_kcal_100g: 115,
      fat_100g: 3.3125,
      saturated_fat_100g: 0.8125,
      carbohydrates_100g: 0,
      sugars_100g: 0,
      fiber_100g: 0,
      proteins_100g: 21.5,
      salt_100g: 0.184375,
  
      serving_size: '1 breast (160 g)',
      serving_quantity: 160,
  
      nutrition_grade: null,
      nutriscore_grade: 'a',
      nutriscore_score: -6,
      nutriscore_version: '2023',
  
      nutriscore_data: {
        grade: 'a',
        score: -6,
        components: {
          negative: [
            { id: 'energy', unit: 'kJ', value: 488.06, points: 1, points_max: 10 },
            { id: 'sugars', unit: 'g', value: 0, points: 0, points_max: 15 },
            { id: 'saturated_fat', unit: 'g', value: 0.81, points: 0, points_max: 10 },
            { id: 'salt', unit: 'g', value: 0.18, points: 0, points_max: 20 }
          ],
          positive: [
            { id: 'proteins', unit: 'g', value: 21.5, points: 7, points_max: 7 },
            { id: 'fiber', unit: 'g', value: 0, points: 0, points_max: 5 },
            { id: 'fruits_vegetables_legumes', unit: '%', value: 0, points: 0, points_max: 5 }
          ]
        }
      },
  
      food_groups: 'en:poultry',
      nova_group: 1,
  
      labels: null,
      labels_tags: null,
  
      packaging: null,
  
      packagings: [
        {
          shape: 'en:film',
          food_contact: 1
        }
      ],
  
      packaging_recycling_tags: [],
  
      ecoscore_grade: null,
      ecoscore_score: null,
  
      environmental_score_data: {
        grade: 'd',
        score: 34
      },
  
      completeness: 0.575,
      last_modified: '2026-04-26T19:24:59+01:00'
    },
  
    // ==================================================
    // 3. Coca-Cola
    // ==================================================
  
    {
      id: 1042976,
      barcode: '5000112637922',
  
      product_name: 'Coca Cola',
      brands: 'Coca-Cola',
      generic_name: 'Kolsyrad läskedryck',
      quantity: '330 ml',
  
      categories:
        'Beverages and beverages preparations, Beverages, Carbonated drinks, Sodas, Colas, Sweetened beverages',
  
      countries: 'France,Sweden',
      stores: 'ICA',
      purchase_places: 'Sverige,Sweden',
      origins: null,
      manufacturing_places: 'Sweden,Sverige',
  
      image_front_url:
        'https://images.openfoodfacts.org/images/products/500/011/263/7922/front_en.40.400.jpg',
      image_ingredients_url: null,
  
      // Ingredients
      ingredients_text:
        'Kolsyrat vatten, socker, färgämne (sockerkulör (E150d)), surhetsreglerande medel (E338), naturliga aromer (inkl koffein).',
  
      ingredients: [
        {
          id: 'en:carbonated-water',
          text: 'Kolsyrat vatten',
          vegan: 'yes',
          vegetarian: 'yes',
          percent_max: 100,
          percent_min: 20,
          percent_estimate: 60,
          is_in_taxonomy: 1
        },
        {
          id: 'en:sugar',
          text: 'socker',
          vegan: 'maybe',
          vegetarian: 'yes',
          percent_max: 35,
          percent_min: 0,
          percent_estimate: 17.5,
          is_in_taxonomy: 1
        },
        {
          id: 'en:colour',
          text: 'färgämne',
          ingredients: [
            {
              id: 'en:e150a',
              text: 'sockerkulör',
              vegan: 'yes',
              vegetarian: 'yes',
              ingredients: [
                {
                  id: 'en:e150d',
                  text: 'e150d',
                  vegan: 'yes',
                  vegetarian: 'yes',
                  percent_max: 33.333333333333336,
                  percent_min: 0,
                  percent_estimate: 11.25,
                  is_in_taxonomy: 1
                }
              ],
              percent_max: 33.333333333333336,
              percent_min: 0,
              percent_estimate: 11.25,
              is_in_taxonomy: 1
            }
          ],
          percent_max: 33.333333333333336,
          percent_min: 0,
          percent_estimate: 11.25,
          is_in_taxonomy: 1
        },
        {
          id: 'en:acidity-regulator',
          text: 'surhetsreglerande medel',
          ingredients: [
            {
              id: 'en:e338',
              text: 'e338',
              vegan: 'yes',
              vegetarian: 'yes',
              percent_max: 25,
              percent_min: 0,
              percent_estimate: 5.625,
              is_in_taxonomy: 1
            }
          ],
          percent_max: 25,
          percent_min: 0,
          percent_estimate: 5.625,
          is_in_taxonomy: 1
        },
        {
          id: 'en:natural-flavouring',
          text: 'naturliga aromer',
          vegan: 'maybe',
          vegetarian: 'maybe',
          ingredients: [
            {
              id: 'en:caffeine',
              text: 'inklusive koffein',
              vegan: 'yes',
              vegetarian: 'yes',
              percent_max: 5,
              percent_min: 0,
              percent_estimate: 5.625,
              is_in_taxonomy: 1
            }
          ],
          percent_max: 5,
          percent_min: 0,
          percent_estimate: 5.625,
          is_in_taxonomy: 1
        }
      ],
  
      allergens: null,
      traces: null,
  
      additives_n: 3,
      additives_tags: [
        'en:e150a',
        'en:e150d',
        'en:e338'
      ],
  
      // Nutrition per 100g
      energy_kcal_100g: 42.121212121212125,
      fat_100g: 0,
      saturated_fat_100g: null,
      carbohydrates_100g: 10.606060606060606,
      sugars_100g: 10.606060606060606,
      fiber_100g: null,
      proteins_100g: 0,
      salt_100g: null,
  
      serving_size: '330 g',
      serving_quantity: 330,
  
      // Nutri-Score
      nutrition_grade: null,
      nutriscore_grade: 'unknown',
      nutriscore_score: null,
      nutriscore_version: '2023',
      nutriscore_data: null,
  
      // Product classification
      food_groups: 'en:sweetened-beverages',
      nova_group: 4,
  
      labels: null,
      labels_tags: [],
  
      // Packaging
      packaging: 'Metal,Recyclable Metals,Aluminium,Drink can',
  
      packagings: [
        {
          shape: 'en:drink-can',
          material: 'en:aluminium',
          recycling: 'en:deposit-refunds',
          food_contact: 1,
          number_of_units: 1
        }
      ],
  
      packaging_recycling_tags: [
        'en:deposit-refunds'
      ],
  
      // Environmental information
      ecoscore_grade: null,
      ecoscore_score: null,
  
      environmental_score_data: {
        grade: 'not-applicable',
        status: 'unknown'
      },
  
      completeness: 0.9,
      last_modified: '2026-03-17T11:26:25+00:00'
    }
  ];
  