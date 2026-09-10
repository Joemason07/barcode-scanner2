create table if not exists public.products (
  barcode text primary key check (barcode ~ '^[0-9]{8,14}$'),
  name text,
  brand text,
  image_url text,
  ingredients text,
  categories text,
  fat_g numeric,
  saturates_g numeric,
  sugars_g numeric,
  salt_g numeric,
  source text not null default 'open_food_facts',
  raw_data jsonb not null,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.product_submissions (
  id bigint generated always as identity primary key,
  barcode text not null check (barcode ~ '^[0-9]{8,14}$'),
  product_name text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'published', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.product_submissions enable row level security;
