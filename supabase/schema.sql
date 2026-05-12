create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists subcategories (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order int default 0
);

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  subcategory_id uuid references subcategories(id) on delete cascade,
  name text not null,
  description text,
  image_url text not null,
  badge text,
  tags text[],
  price_inr numeric(10,2) not null default 0,
  original_price_inr numeric(10,2),
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table products
add column if not exists stock_quantity int not null default 0 check (stock_quantity >= 0);

create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  rating int check (rating between 1 and 5),
  review_text text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  key text primary key,
  value text
);

alter table categories enable row level security;
alter table subcategories enable row level security;
alter table products enable row level security;
alter table reviews enable row level security;
alter table site_settings enable row level security;

drop policy if exists "Public read categories" on categories;
drop policy if exists "Public read subcategories" on subcategories;
drop policy if exists "Public read products" on products;
drop policy if exists "Public read reviews" on reviews;
drop policy if exists "Public read settings" on site_settings;
drop policy if exists "Admin all categories" on categories;
drop policy if exists "Admin all subcategories" on subcategories;
drop policy if exists "Admin all products" on products;
drop policy if exists "Admin all reviews" on reviews;
drop policy if exists "Admin all settings" on site_settings;

create policy "Public read categories" on categories for select using (true);
create policy "Public read subcategories" on subcategories for select using (true);
create policy "Public read products" on products for select using (is_active = true);
create policy "Public read reviews" on reviews for select using (is_active = true);
create policy "Public read settings" on site_settings for select using (true);

create policy "Admin all categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all subcategories" on subcategories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all products" on products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all reviews" on reviews for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin all settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Admin upload product images" on storage.objects;
drop policy if exists "Public read product images" on storage.objects;

create policy "Public read product images" on storage.objects
for select using (bucket_id = 'product-images');

create policy "Admin upload product images" on storage.objects
for all using (bucket_id = 'product-images' and auth.role() = 'authenticated')
with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
