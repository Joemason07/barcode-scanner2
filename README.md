# Scanly — Barcode scanner

A responsive, dependency-free barcode scanner interface with Home, Scan, History, Item details, and Settings pages.

Camera scanning uses the browser's Barcode Detection API when available; manual barcode entry is always available.

Product lookups use the public Open Facts universal product API. It searches the community-maintained Food, Beauty, Pet Food, and general Products catalogues for names, images, ingredients, categories, and nutrition data. Product price is not included in these catalogues, so the app explicitly shows it as unavailable rather than displaying an estimate.

## Running it

The app is split into small ES modules (see **Project structure** below), so it needs to be served over `http://` rather than opened directly as a `file://` URL — browsers block module imports over `file://`.

**Easiest — one command (needs Node.js):**

```
npm run dev
```

Then open the printed URL (defaults to `http://localhost:5173`). This uses `npx serve` behind the scenes, so there's nothing to install up front.

**Alternatives**, if you'd rather not use Node:

- Python (usually preinstalled on macOS/Linux): `python3 -m http.server 5173`
- VS Code: install the "Live Server" extension, right-click `index.html` → *Open with Live Server*

Any static file server works — there's no build step or compilation.

## Project structure

```
index.html      Page shell + nav; loads config.js, then app.js as a module
config.js       Optional Supabase Edge Function URL (see below)
app.js          Entry point: router (hash-based) and page event binding
dom.js          Shared #app element reference + toast() helper
state.js        Scan history: load/save/clear, backed by localStorage
templates.js    One function per page/component, each returns an HTML string
camera.js       getUserMedia + BarcodeDetector handling for the Scan page
api.js          Barcode → product lookup (Supabase proxy or Open Food Facts)
styles.css      All styling, incl. dark mode (toggled via a body.dark class)
```

To change what a page looks like, edit its function in `templates.js`. To change scanning behaviour, edit `camera.js`. To change where product data comes from, edit `api.js`. `app.js` itself should rarely need touching — it's just wiring.

## UK product cache with Supabase

The project includes a Postgres schema and an Edge Function that caches food products after their first UK lookup. It uses Open Food Facts with `cc=gb` and `lc=en`, so future lookup sources can be added without changing the app.

1. Create a Supabase project at [database.new](https://database.new).
2. Run `supabase link --project-ref YOUR_PROJECT_REF`, then `supabase db push` and `supabase functions deploy lookup-product --no-verify-jwt`.
3. In Supabase Edge Function Secrets, add `SUPABASE_SERVICE_ROLE_KEY` with the project's service-role key. Never put this key in `config.js` or send it to anyone.
4. Put the deployed function URL in `config.js`, for example `https://YOUR_PROJECT_REF.supabase.co/functions/v1/lookup-product`.

Until configured, the app continues using the public catalogue directly.
