insert into site_settings (key, value) values
  ('announcement_text', 'Handcrafted in India · Bulk Orders Welcome · New Arrivals Every Week'),
  ('offer_text', 'CLEARANCE OFFER - Upto 50% sitewide · Bulk discounts available · WhatsApp us for pricing')
on conflict (key) do update set value = excluded.value;

insert into categories (name, slug, sort_order) values
  ('Drinkware', 'drinkware', 1),
  ('Serveware', 'serveware', 2),
  ('Dinnerware', 'dinnerware', 3),
  ('Kitchenware', 'kitchenware', 4),
  ('Home Decor', 'homedecor', 5),
  ('Flower', 'flower', 6),
  ('Pot', 'pot', 7),
  ('Bathware', 'bathware', 8)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

update subcategories
set category_id = (select id from categories where slug = 'pot'),
    name = 'Pots',
    sort_order = 1
where slug = 'pots';

insert into subcategories (category_id, name, slug, sort_order)
select c.id, v.name, v.slug, v.sort_order
from categories c
join (values
  ('drinkware', 'Mugs', 'mugs', 1), ('drinkware', 'Cups', 'cups', 2), ('drinkware', 'Cups & Saucers', 'cups-and-saucers', 3), ('drinkware', 'Kettle Set', 'kettle-set', 4), ('drinkware', 'Glasses', 'glasses', 5),
  ('serveware', 'Plates', 'plates', 1), ('serveware', 'Serving Set', 'serving-set', 2), ('serveware', 'Bowls', 'bowls', 3), ('serveware', 'Platter', 'platter', 4),
  ('dinnerware', 'Dinner Set', 'dinner-set', 1),
  ('kitchenware', 'Jars & Containers', 'jars-and-containers', 1), ('kitchenware', 'Oil Bottles', 'oil-bottles', 2),
  ('homedecor', 'Vases', 'vases', 1), ('homedecor', 'Decor Finds', 'decor-finds', 2),
  ('flower', 'Flowers', 'flowers', 1),
  ('pot', 'Pots', 'pots', 1),
  ('bathware', 'Bath Accessories', 'bath-accessories', 1), ('bathware', 'Soap Dispensers', 'soap-dispensers', 2)
) as v(category_slug, name, slug, sort_order) on c.slug = v.category_slug
where not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = v.slug);

insert into reviews (name, location, rating, review_text) values
  ('Priya Mehta', 'Ahmedabad', 5, 'Absolutely love the mugs I ordered! Each piece feels unique and the quality is exceptional. Will definitely order again.'),
  ('Rohan Shah', 'Surat', 5, 'Ordered a full dinner set for my restaurant. Outstanding quality and great bulk pricing too!'),
  ('Anita Patel', 'Mumbai', 5, 'The vases I bought are stunning. My guests always ask where I got them. Pure art!'),
  ('Vikram Desai', 'Vadodara', 4, 'Good quality ceramics at reasonable prices. Delivery was quick. Highly recommend for gifting.'),
  ('Neha Joshi', 'Rajkot', 5, 'Got a custom kettle set made. The craftsmanship is beautiful - exactly what I wanted.'),
  ('Amit Trivedi', 'Ahmedabad', 5, 'Been buying from One Way Ceramic for 2 years. Consistent quality, always handmade with love.'),
  ('Sunita Rao', 'Pune', 4, 'The bowls and plates are gorgeous. Earthy tones that go perfectly with my home decor.'),
  ('Kavya Nair', 'Bangalore', 5, 'Ordered for a wedding gift. Beautiful packaging, stunning pieces. 10/10 would recommend!');

with product_ranges(slug, min_price, max_price, min_original, max_original) as (
  values
  ('mugs', 299, 599, 399, 799), ('cups', 199, 449, null, null), ('cups-and-saucers', 449, 899, 599, 1199),
  ('kettle-set', 1299, 2499, null, null), ('glasses', 249, 549, null, null), ('plates', 349, 699, null, null),
  ('serving-set', 999, 2199, 1299, 2799), ('bowls', 299, 649, null, null), ('platter', 799, 1499, null, null),
  ('dinner-set', 2499, 5999, 3499, 7499), ('jars-and-containers', 399, 849, null, null), ('oil-bottles', 499, 999, null, null),
  ('flowers', 199, 799, null, null), ('pots', 699, 1799, null, null), ('vases', 549, 1299, 799, 1699), ('decor-finds', 349, 999, null, null),
  ('bath-accessories', 449, 1199, null, null), ('soap-dispensers', 599, 1399, null, null)
),
names(n, adjective) as (
  values (1, 'Rustic'), (2, 'Ivory'), (3, 'Forest'), (4, 'Terracotta'), (5, 'Speckled'), (6, 'Midnight'), (7, 'Blush'), (8, 'Sage'), (9, 'Striped'), (10, 'Glazed')
)
insert into products (subcategory_id, name, description, image_url, badge, tags, price_inr, original_price_inr, stock_quantity, sort_order)
select
  s.id,
  names.adjective || ' ' || regexp_replace(s.name, 's$', '') as name,
  'Handcrafted ' || lower(s.name) || ' with a tactile glaze, made for everyday use, gifting and bulk orders.' as description,
  'https://picsum.photos/seed/oneway-' || s.slug || '-' || names.n || '/700/700' as image_url,
  case names.n when 1 then 'Bestseller' when 3 then 'New' when 5 then 'Sale' when 7 then 'Limited' when 10 then 'New' else null end as badge,
  array['handmade', c.slug, s.slug] as tags,
  round((r.min_price + ((r.max_price - r.min_price) * ((names.n * 13) % 37) / 36.0)) / 10) * 10 - 1 as price_inr,
  case
    when names.n in (1, 3, 5, 7, 10) then
      coalesce(round((r.min_original + ((r.max_original - r.min_original) * ((names.n * 17) % 41) / 40.0)) / 10) * 10 - 1,
      round(((r.min_price + ((r.max_price - r.min_price) * ((names.n * 13) % 37) / 36.0)) * 1.28) / 10) * 10 - 1)
    else null
  end as original_price_inr,
  12 + ((names.n * 7) % 24) as stock_quantity,
  names.n
from subcategories s
join categories c on c.id = s.category_id
join product_ranges r on r.slug = s.slug
cross join names
where not exists (
  select 1 from products p where p.subcategory_id = s.id
);
