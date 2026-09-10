// Scanly configuration.
//
// lookupEndpoint: optional URL of a deployed Supabase Edge Function that
// proxies and caches product lookups (see README.md for setup steps).
// This URL is public and safe to expose in the browser — it's not a secret.
//
// Leave it as an empty string to use the public Open Food Facts API
// directly instead (no setup required).
window.SCANLY_CONFIG = {
  lookupEndpoint: '',
};
