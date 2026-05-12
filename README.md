# One Way Ceramic Studio

Production-ready mobile-first website for One Way Ceramic Studio, built with Next.js 14, Tailwind, Supabase and WhatsApp enquiries.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.local.example` to `.env.local` and fill Supabase values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_WA_NUMBER=918445618578
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

For a production-style local preview after `npm run build`, Windows users can run:

```bat
start-preview.cmd
```

Without Supabase env vars, the public site uses local fallback seed data so the UI remains previewable.

## Supabase Setup

1. Create a free Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Run `supabase/seed.sql` to create settings, categories, subcategories, reviews and 10 products per subcategory with INR prices.
4. Confirm Storage bucket `product-images` is public.
5. Authentication > Users > Add User:
   - Email: `admin@onewayceramic.com`
   - Password: choose a strong password.

RLS is enabled on all public tables. Public users can only read active data; authenticated admin can manage data.

## Assets

For local product photos, this workspace already has the provided asset pack copied into `public/assets/`. New product photos can replace files using the same structure and be referenced like:

```txt
/assets/drinkware/mugs/mugs_1.jpg
```

For production, upload final photos to Supabase Storage bucket `product-images` and store the public CDN URL in the product record. Supabase CDN images are rendered with `unoptimized={true}` to avoid Vercel image optimization limits.

To mass upload the included asset pack to Supabase Storage and create/update product rows, first run `supabase/schema.sql` in the Supabase SQL Editor, then run:

```bash
npm run import:assets
```

The importer reads `.env.local`, uploads every image in `public/assets/` to the `product-images` bucket, and stores each public URL in `products.image_url`.

## Admin

- Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Products: add, edit, delete, upload images, validate prices and discounts.
- Categories: edit category basics and review subcategories.
- Site settings: announcement text and offer strip text.

## Vercel Deploy

1. Push this repo to GitHub.
2. Vercel > New Project > Import repo.
3. Add all four env vars in Project Settings > Environment Variables.
4. Deploy.
5. Add custom domain `onewayceramic.com` in Vercel Domains.

## Business Details

- Address: 2G52+5R4, Noorani Rd, Prahlad Nagar, Ahmedabad, Gujarat 380015
- WhatsApp: `918445618578`
- Call: `tel:+918445618578`
