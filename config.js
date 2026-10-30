
/**
 * Scanly configuration.
 *
 * dataSource:
 * 'demo' = use local demo-products.js catalogue
 * 'api'  = use the local Scanly API
 *
 * lookupEndpoint:
 * Optional URL for the product lookup API.
 *
 * Leave empty to use the default local API:
 * http://localhost:8001/api/product
 */

window.SCANLY_CONFIG = {
  dataSource: 'demo',
  lookupEndpoint: '',
};
