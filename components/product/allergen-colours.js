
/*
 * Shared allergen colours and ingredient matching.
 *
 * Used by the ingredient list and allergen summary.
 */


export const ALLERGENS = {
  gluten: {
    label: 'Gluten',
    terms: [
      'semolina', 'wheat', 'wheat flour', 'durum wheat',
      'barley', 'rye', 'spelt', 'oats',
      'blé', 'farine de blé', 'orge', 'seigle',
      'avoine', 'épeautre'
    ]
  },

  nuts: {
    label: 'Nuts',
    terms: [
      'cashew nut', 'cashew nuts', 'almond', 'almonds',
      'hazelnut', 'hazelnuts', 'walnut', 'walnuts',
      'pistachio', 'pistachios', 'pecan', 'pecans',
      'macadamia', 'brazil nut', 'brazil nuts',
      'amande', 'amandes', 'noisette', 'noisettes',
      'noix', 'pistache', 'pistaches', 'noix de cajou'
    ]
  },

  milk: {
    label: 'Milk',
    terms: [
      'milk', 'whey', 'casein', 'cream', 'cheese',
      'lait', 'petit-lait', 'caséine', 'crème',
      'fromage', 'beurre', 'lactose'
    ]
  },

  eggs: {
    label: 'Eggs',
    terms: ['egg', 'eggs', 'egg white', 'egg yolk', 'œuf', 'œufs', 'oeuf', 'oeufs']
  },

  mustard: {
    label: 'Mustard',
    terms: ['mustard', 'moutarde']
  },

  peanuts: {
    label: 'Peanuts',
    terms: ['peanut', 'peanuts', 'cacahuète', 'cacahuètes', 'arachide', 'arachides']
  },

  soybeans: {
    label: 'Soy',
    terms: ['soy', 'soya', 'soybean', 'soybeans', 'soja', 'lécithine de soja']
  },

  sesame: {
    label: 'Sesame',
    terms: ['sesame', 'sesame seeds', 'sésame', 'graines de sésame']
  },

  celery: {
    label: 'Celery',
    terms: ['celery', 'céleri', 'céleri-rave']
  },

  fish: {
    label: 'Fish',
    terms: ['fish', 'salmon', 'tuna', 'cod', 'anchovy', 'poisson', 'saumon', 'thon', 'morue', 'anchois']
  },

  crustaceans: {
    label: 'Crustaceans',
    terms: ['prawn', 'prawns', 'shrimp', 'crab', 'lobster', 'crevette', 'crevettes', 'crabe', 'homard']
  },

  molluscs: {
    label: 'Molluscs',
    terms: ['mussel', 'mussels', 'oyster', 'oysters', 'squid', 'moule', 'moules', 'huître', 'huîtres', 'calamar', 'poulpe']
  },

  lupin: {
    label: 'Lupin',
    terms: ['lupin', 'lupine']
  },

  sulphites: {
    label: 'Sulphites',
    terms: ['sulphites', 'sulfites', 'sulfite', 'sulphite', 'dioxyde de soufre']
  }
};

  
  
  // Normalise Open Food Facts tags such as en:gluten.
  export function parseAllergenTags(value) {
    if (!value) return [];
  
    const values = Array.isArray(value)
      ? value
      : String(value).split(/[;,]/);
  
    return [...new Set(
      values
        .map(value =>
          String(value)
            .trim()
            .toLowerCase()
            .replace(/^[a-z]{2}:/, '')
            .replace(/-/g, '_')
        )
        .filter(Boolean)
    )];
  }
  
  
  // Return recognised allergen categories.
  export function getAllergenKeys(value) {
    const aliases = {
      nuts: 'nuts',
      tree_nuts: 'nuts',
      gluten: 'gluten',
      cereals: 'gluten',
      milk: 'milk',
      eggs: 'eggs',
      mustard: 'mustard',
      peanuts: 'peanuts',
      soy: 'soybeans',
      soya: 'soybeans',
      soybeans: 'soybeans',
      sesame: 'sesame',
      celery: 'celery',
      fish: 'fish',
      crustaceans: 'crustaceans',
      molluscs: 'molluscs',
      lupin: 'lupin',
      sulphites: 'sulphites',
      sulfites: 'sulphites'
    };
  
    return [...new Set(
      parseAllergenTags(value)
        .map(tag => aliases[tag])
        .filter(key => key && ALLERGENS[key])
    )];
  }
  
  
  // Escape text before using it in a regular expression.
  export function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  
  // Format a database tag for display.
  export function formatAllergenName(value) {
    return String(value)
      .replace(/^[a-z]{2}:/i, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }



  export function getAllergenKeyForTerm(value) {
    if (!value) {
      return null;
    }
  
    const term = String(value)
      .toLowerCase()
      .replace(/^en:/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/[()[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.,;:]+$/, '');
  
    const aliases = {
      gluten: [
        'gluten', 'wheat', 'wheat flour', 'durum wheat',
        'semolina', 'barley', 'rye', 'spelt', 'oats',
        'oat', 'cereals', 'cereal'
      ],
  
      nuts: [
        'nut', 'nuts', 'tree nut', 'tree nuts',
        'cashew', 'cashews', 'cashew nut', 'cashew nuts',
        'almond', 'almonds', 'hazelnut', 'hazelnuts',
        'walnut', 'walnuts', 'pistachio', 'pistachios',
        'pecan', 'pecans', 'macadamia', 'macadamia nut',
        'macadamia nuts', 'brazil nut', 'brazil nuts',
        'pine nut', 'pine nuts'
      ],
  
      milk: [
        'milk', 'whey', 'casein', 'caseinate',
        'cream', 'cheese', 'butter', 'lactose',
        'milk powder', 'milk solids'
      ],
  
      eggs: [
        'egg', 'eggs', 'egg white', 'egg whites',
        'egg yolk', 'egg yolks', 'albumen', 'albumin'
      ],
  
      mustard: ['mustard', 'mustard seed', 'mustard seeds'],
  
      peanuts: [
        'peanut', 'peanuts', 'groundnut', 'groundnuts'
      ],
  
      soybeans: [
        'soy', 'soya', 'soybean', 'soybeans',
        'soya bean', 'soya beans', 'soy protein'
      ],
  
      sesame: [
        'sesame', 'sesame seed', 'sesame seeds',
        'sesame oil'
      ],
  
      celery: ['celery', 'celeriac'],
  
      fish: [
        'fish', 'salmon', 'tuna', 'cod', 'anchovy',
        'anchovies', 'sardine', 'sardines', 'haddock',
        'mackerel', 'trout', 'herring', 'pollock'
      ],
  
      crustaceans: [
        'crustacean', 'crustaceans', 'prawn', 'prawns',
        'shrimp', 'crab', 'crabs', 'lobster', 'lobsters',
        'crayfish', 'langoustine', 'langoustines'
      ],
  
      molluscs: [
        'mollusc', 'molluscs', 'mussel', 'mussels',
        'oyster', 'oysters', 'squid', 'octopus',
        'clam', 'clams', 'snail', 'snails',
        'scallop', 'scallops', 'cockle', 'cockles'
      ],
  
      lupin: ['lupin', 'lupine'],
  
      sulphites: [
        'sulphite', 'sulphites', 'sulfite', 'sulfites',
        'sulphur dioxide', 'sulfur dioxide'
      ]
    };
  
    for (const [key, terms] of Object.entries(aliases)) {
      if (terms.includes(term)) {
        return key;
      }
    }
  
    return null;
  }