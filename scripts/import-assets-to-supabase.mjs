import { createClient } from '@supabase/supabase-js'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const envPath = path.join(rootDir, '.env.local')
const assetsDir = path.join(rootDir, 'public', 'assets')

const CATEGORY_META = [
  { name: 'Drinkware', slug: 'drinkware', folder: 'drinkware', subs: ['Mugs', 'Cups', 'Cups & Saucers', 'Kettle Set', 'Glasses'] },
  { name: 'Serveware', slug: 'serveware', folder: 'serveware', subs: ['Plates', 'Serving Set', 'Bowls', 'Platter'] },
  { name: 'Dinnerware', slug: 'dinnerware', folder: 'dinnerware', subs: ['Dinner Set'] },
  { name: 'Kitchenware', slug: 'kitchenware', folder: 'kitchenware', subs: ['Jars & Containers', 'Oil Bottles'] },
  { name: 'Home Decor', slug: 'homedecor', folder: 'homedecor', subs: ['Vases', 'Decor Finds'] },
  { name: 'Flower', slug: 'flower', folder: 'flower', subs: ['Flowers'] },
  { name: 'Pot', slug: 'pot', folder: 'homedecor', subs: ['Pots'] },
  { name: 'Bathware', slug: 'bathware', folder: 'bathware', subs: ['Bath Accessories', 'Soap Dispensers'] }
]

const PRICE_RANGES = {
  mugs: [299, 599, 399, 799],
  cups: [199, 449, null, null],
  'cups-and-saucers': [449, 899, 599, 1199],
  'kettle-set': [1299, 2499, null, null],
  glasses: [249, 549, null, null],
  plates: [349, 699, null, null],
  'serving-set': [999, 2199, 1299, 2799],
  bowls: [299, 649, null, null],
  platter: [799, 1499, null, null],
  'dinner-set': [2499, 5999, 3499, 7499],
  'jars-and-containers': [399, 849, null, null],
  'oil-bottles': [499, 999, null, null],
  flowers: [199, 799, null, null],
  pots: [699, 1799, null, null],
  vases: [549, 1299, 799, 1699],
  'decor-finds': [349, 999, null, null],
  'bath-accessories': [449, 1199, null, null],
  'soap-dispensers': [599, 1399, null, null]
}

const ADJECTIVES = ['Rustic', 'Ivory', 'Forest', 'Terracotta', 'Speckled', 'Midnight', 'Blush', 'Sage', 'Striped', 'Glazed']
const BADGES = ['Bestseller', null, 'New', null, 'Sale', null, 'Limited', null, null, 'New']
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const WEB_CATEGORY_IMAGES = {
  drinkware: 'drinkware.webp',
  serveware: 'serveware.jpg',
  dinnerware: 'dinnerware.jpg',
  kitchenware: 'kitchenware.webp',
  bathware: 'bathware.jpg'
}

function loadEnvFile(contents) {
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator === -1) continue
    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function folderify(value) {
  return slugify(value).replace(/-/g, '_')
}

function singular(value) {
  return value.replace(/s$/, '')
}

function priceFor(slug, index) {
  const [min, max, originalMin, originalMax] = PRICE_RANGES[slug]
  const spread = max - min
  const price = Math.round((min + (spread * ((index * 13) % 37)) / 36) / 10) * 10 - 1
  const sale = index % 2 === 0 || index === 7
  if (!sale) return { price, original: null }
  if (originalMin && originalMax) {
    const original = Math.max(price + 100, Math.round((originalMin + ((originalMax - originalMin) * ((index * 17) % 41)) / 40) / 10) * 10 - 1)
    return { price, original }
  }
  return { price, original: Math.round((price * 1.28) / 10) * 10 - 1 }
}

function contentTypeFor(fileName) {
  const extension = path.extname(fileName).toLowerCase()
  if (extension === '.png') return 'image/png'
  if (extension === '.webp') return 'image/webp'
  return 'image/jpeg'
}

async function ensureCategory(supabase, category, sortOrder) {
  const { data, error } = await supabase
    .from('categories')
    .upsert(
      {
        name: category.name,
        slug: category.slug,
        sort_order: sortOrder
      },
      { onConflict: 'slug' }
    )
    .select('id, name, slug')
    .single()

  if (error) throw new Error(`Category "${category.name}" failed: ${error.message}`)
  return data
}

async function ensureSubcategory(supabase, categoryId, name, sortOrder) {
  const slug = slugify(name)
  const { data: existing, error: findError } = await supabase
    .from('subcategories')
    .select('id')
    .eq('category_id', categoryId)
    .eq('slug', slug)
    .limit(1)
    .maybeSingle()

  if (findError) throw new Error(`Subcategory lookup "${name}" failed: ${findError.message}`)

  if (existing) {
    const { data, error } = await supabase
      .from('subcategories')
      .update({ name, sort_order: sortOrder })
      .eq('id', existing.id)
      .select('id, slug')
      .single()
    if (error) throw new Error(`Subcategory update "${name}" failed: ${error.message}`)
    return data
  }

  const { data, error } = await supabase
    .from('subcategories')
    .insert({ category_id: categoryId, name, slug, sort_order: sortOrder })
    .select('id, slug')
    .single()

  if (error) throw new Error(`Subcategory "${name}" failed: ${error.message}`)
  return data
}

async function upsertProduct(supabase, payload) {
  const { data: existing, error: findError } = await supabase
    .from('products')
    .select('id')
    .eq('subcategory_id', payload.subcategory_id)
    .eq('sort_order', payload.sort_order)
    .limit(1)
    .maybeSingle()

  if (findError) throw new Error(`Product lookup "${payload.name}" failed: ${findError.message}`)

  if (existing) {
    const { error } = await supabase.from('products').update(payload).eq('id', existing.id)
    if (error) throw new Error(`Product update "${payload.name}" failed: ${error.message}`)
    return 'updated'
  }

  const { error } = await supabase.from('products').insert(payload)
  if (error) throw new Error(`Product insert "${payload.name}" failed: ${error.message}`)
  return 'created'
}

async function uploadPublicFile(supabase, localPath, storagePath) {
  const fileBuffer = await readFile(localPath)
  const { error } = await supabase.storage
    .from('product-images')
    .upload(storagePath, fileBuffer, {
      contentType: contentTypeFor(localPath),
      upsert: true
    })

  if (error) throw new Error(`Upload "${storagePath}" failed: ${error.message}`)
  const { data } = supabase.storage.from('product-images').getPublicUrl(storagePath)
  return data.publicUrl
}

async function main() {
  try {
    loadEnvFile(await readFile(envPath, 'utf8'))
  } catch {
    throw new Error('Missing .env.local. Create it from .env.local.example before importing.')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  const { error: bucketError } = await supabase.storage.createBucket('product-images', { public: true })
  if (bucketError && !bucketError.message.toLowerCase().includes('already exists')) {
    throw new Error(`Storage bucket failed: ${bucketError.message}`)
  }

  let created = 0
  let updated = 0
  let uploaded = 0

  for (const [categoryIndex, category] of CATEGORY_META.entries()) {
    const categoryRow = await ensureCategory(supabase, category, categoryIndex + 1)
    let categoryImageUrl = null
    const webCategoryImage = WEB_CATEGORY_IMAGES[category.slug]
    if (webCategoryImage) {
      const webImagePath = path.join(rootDir, 'public', 'web-images', webCategoryImage)
      try {
        categoryImageUrl = await uploadPublicFile(supabase, webImagePath, `site-categories/${webCategoryImage}`)
      } catch {
        categoryImageUrl = null
      }
    }

    for (const [subIndex, subcategoryName] of category.subs.entries()) {
      const subcategorySlug = slugify(subcategoryName)
      const subcategoryFolder = folderify(subcategoryName)
      const subcategoryPath = path.join(assetsDir, category.folder, subcategoryFolder)
      const subcategoryRow = await ensureSubcategory(supabase, categoryRow.id, subcategoryName, subIndex + 1)
      let files = []
      try {
        files = (await readdir(subcategoryPath))
          .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      } catch {
        files = []
      }

      for (const [fileIndex, fileName] of files.entries()) {
        const sortOrder = fileIndex + 1
        const filePath = path.join(subcategoryPath, fileName)
        const storagePath = `${category.slug}/${subcategorySlug}/${fileName}`
        const publicUrl = await uploadPublicFile(supabase, filePath, storagePath)
        uploaded += 1

        if (!categoryImageUrl) categoryImageUrl = publicUrl
        const { price, original } = priceFor(subcategorySlug, sortOrder)
        const status = await upsertProduct(supabase, {
          subcategory_id: subcategoryRow.id,
          name: `${ADJECTIVES[fileIndex] || 'Handmade'} ${singular(subcategoryName)}`,
          description: `Handcrafted ${subcategoryName.toLowerCase()} with a tactile glaze, made for everyday use and thoughtful gifting.`,
          image_url: publicUrl,
          badge: BADGES[fileIndex] || null,
          tags: ['handmade', category.slug, subcategorySlug],
          price_inr: price,
          original_price_inr: original,
          stock_quantity: Number(process.env.DEFAULT_STOCK_QUANTITY || 10),
          is_active: true,
          sort_order: sortOrder
        })

        if (status === 'created') created += 1
        else updated += 1
      }
    }

    if (categoryImageUrl) {
      const { error } = await supabase.from('categories').update({ image_url: categoryImageUrl }).eq('id', categoryRow.id)
      if (error) throw new Error(`Category image update "${category.name}" failed: ${error.message}`)
    }
  }

  console.log(`Imported ${uploaded} images. Created ${created} products, updated ${updated} products.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
