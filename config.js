// Scanly configuration.
//
// lookupEndpoint:
// Optional URL for the product lookup API.
//
// Leave this empty to use the local Scanly API:
// http://localhost:8001/api/product
//
// If you deploy the API somewhere else, put its
// base URL here instead.
//
// This value is safe to expose in the browser.
// Never put database passwords, API secrets,
// or service-role keys in this file.

window.SCANLY_CONFIG = {
  lookupEndpoint: '',
};