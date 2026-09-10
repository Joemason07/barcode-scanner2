import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const fields = 'code,product_name,brands,image_front_url,generic_name,ingredients_text,categories,nutrition_grades,nutriments,product_type'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
})

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'GET') return json({ error: 'Use GET.' }, 405)

  const barcode = new URL(request.url).searchParams.get('barcode')?.trim() ?? ''
  if (!/^\d{8,14}$/.test(barcode)) return json({ error: 'Enter an 8–14 digit barcode.' }, 400)

  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceKey) return json({ error: 'Product service is not configured.' }, 500)
  const db = createClient(url, serviceKey)

  const { data: cached, error: cacheError } = await db
    .from('products')
    .select('raw_data')
    .eq('barcode', barcode)
    .maybeSingle()

  if (cacheError) return json({ error: 'Could not read product cache.' }, 500)
  if (cached?.raw_data) return json({ status: 'success', product: cached.raw_data, source: 'cache' })

  const productUrl = new URL(`https://world.openfoodfacts.org/api/v3.6/product/${barcode}.json`)
  productUrl.searchParams.set('fields', fields)
  productUrl.searchParams.set('product_type', 'food')
  productUrl.searchParams.set('cc', 'gb')
  productUrl.searchParams.set('lc', 'en')

  const response = await fetch(productUrl, { headers: { 'User-Agent': 'Scanly/1.0 (UK barcode scanner)' } })
  if (!response.ok) return json({ error: 'Product catalogue is unavailable.' }, 502)
  const lookup = await response.json()
  if (lookup.status !== 'success' || !lookup.product) return json({ status: 'not_found' }, 404)

  const product = lookup.product
  const nutrients = product.nutriments ?? {}
  const { error: writeError } = await db.from('products').upsert({
    barcode: product.code ?? barcode,
    name: product.product_name ?? product.generic_name,
    brand: product.brands,
    image_url: product.image_front_url,
    ingredients: product.ingredients_text,
    categories: product.categories,
    fat_g: nutrients.fat_100g,
    saturates_g: nutrients['saturated-fat_100g'],
    sugars_g: nutrients.sugars_100g,
    salt_g: nutrients.salt_100g,
    raw_data: product,
    source: 'open_food_facts',
    last_synced_at: new Date().toISOString(),
  })
  if (writeError) return json({ error: 'Product was found but could not be saved.' }, 500)

  return json({ status: 'success', product, source: 'open_food_facts' })
})
