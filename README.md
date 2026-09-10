# Scanly — Barcode scanner

A responsive, dependency-free barcode scanner interface with Home, Scan, History, Item details, and Settings pages.

Open `index.html` in a modern browser to use it. Camera scanning uses the browser's Barcode Detection API when available; manual barcode entry is always available.

Product lookups use the public Open Facts universal product API. It searches the community-maintained Food, Beauty, Pet Food, and general Products catalogues for names, images, ingredients, categories, and nutrition data. Product price is not included in these catalogues, so the app explicitly shows it as unavailable rather than displaying an estimate.

## UK product cache with Supabase

The project includes a Postgres schema and an Edge Function that caches food products after their first UK lookup. It uses Open Food Facts with `cc=gb` and `lc=en`, so future lookup sources can be added without changing the app.

1. Create a Supabase project at [database.new](https://database.new).
2. Run `supabase link --project-ref YOUR_PROJECT_REF`, then `supabase db push` and `supabase functions deploy lookup-product --no-verify-jwt`.
3. In Supabase Edge Function Secrets, add `SUPABASE_SERVICE_ROLE_KEY` with the project's service-role key. Never put this key in `config.js` or send it to anyone.
4. Put the deployed function URL in `config.js`, for example `https://YOUR_PROJECT_REF.supabase.co/functions/v1/lookup-product`.

Until configured, the app continues using the public catalogue directly.
