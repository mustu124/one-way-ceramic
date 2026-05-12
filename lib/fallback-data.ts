import type { Category, CategoryTree, Product, Review, SiteSettings, Subcategory } from '@/types'
import { CATEGORY_META, FALLBACK_SETTINGS, folderify, slugify } from './constants'
import fs from 'node:fs'
import path from 'node:path'

const ranges: Record<string, [number, number, number | null, number | null]> = {
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
  pots: [699, 1799, null, null],
  vases: [549, 1299, 799, 1699],
  'decor-finds': [349, 999, null, null],
  'bath-accessories': [449, 1199, null, null],
  'soap-dispensers': [599, 1399, null, null]
}

const adjectives = ['Rustic', 'Ivory', 'Forest', 'Terracotta', 'Speckled', 'Midnight', 'Blush', 'Sage', 'Striped', 'Glazed']
const badges = ['Bestseller', null, 'New', null, 'Sale', null, 'Limited', null, null, 'New']
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const assetRoot = path.join(process.cwd(), 'public', 'assets')
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

function priceFor(slug: string, index: number) {
  const [min, max, originalMin, originalMax] = ranges[slug]
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

function imageFilesFor(categorySlug: string, subcategoryName: string) {
  const subFolder = folderify(subcategoryName)
  const dir = path.join(assetRoot, categorySlug, subFolder)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    .sort((a, b) => collator.compare(a, b))
    .map((file) => `/assets/${categorySlug}/${subFolder}/${file}`)
}

function firstCategoryImage(category: (typeof CATEGORY_META)[number]) {
  for (const subcategoryName of category.subs) {
    const [first] = imageFilesFor(category.slug, subcategoryName)
    if (first) return first
  }
  return null
}

export const fallbackCategories: Category[] = CATEGORY_META.map((cat, index) => ({
  id: `cat-${cat.slug}`,
  name: cat.name,
  slug: cat.slug,
  image_url: firstCategoryImage(cat),
  sort_order: index + 1
}))

export const fallbackSubcategories: Subcategory[] = CATEGORY_META.flatMap((cat) =>
  cat.subs.map((name, index) => ({
    id: `sub-${slugify(name)}`,
    category_id: `cat-${cat.slug}`,
    name,
    slug: slugify(name),
    sort_order: index + 1
  }))
)

export const fallbackCategoryTree: CategoryTree[] = fallbackCategories.map((cat) => ({
  ...cat,
  subcategories: fallbackSubcategories.filter((sub) => sub.category_id === cat.id)
}))

export const fallbackProducts: Product[] = fallbackSubcategories.flatMap((sub) => {
  const cat = fallbackCategories.find((category) => category.id === sub.category_id)!
  const imageFiles = imageFilesFor(cat.slug, sub.name)
  return imageFiles.map((imageUrl, index) => {
    const number = index + 1
    const { price, original } = priceFor(sub.slug, number)
    return {
      id: `product-${sub.slug}-${number}`,
      subcategory_id: sub.id,
      name: `${adjectives[index] || 'Handmade'} ${sub.name.replace(/s$/, '')}`,
      description: `Handcrafted ${sub.name.toLowerCase()} with a tactile glaze, made for everyday use and thoughtful gifting.`,
      image_url: imageUrl,
      badge: badges[index],
      tags: ['handmade', cat.slug, sub.slug],
      price_inr: price,
      original_price_inr: original,
      stock_quantity: 12 + ((index * 7) % 24),
      is_active: true,
      sort_order: number,
      created_at: new Date(2026, 0, number).toISOString(),
      subcategories: { ...sub, categories: cat }
    }
  })
})

export const fallbackReviews: Review[] = [
  { id: 'review-1', name: 'Priya Mehta', location: 'Ahmedabad', rating: 5, review_text: 'Absolutely love the mugs I ordered. Each piece feels unique and the quality is exceptional.' },
  { id: 'review-2', name: 'Rohan Shah', location: 'Surat', rating: 5, review_text: 'Ordered a full dinner set for my restaurant. Outstanding quality and great bulk pricing too.' },
  { id: 'review-3', name: 'Anita Patel', location: 'Mumbai', rating: 5, review_text: 'The vases I bought are stunning. My guests always ask where I got them.' },
  { id: 'review-4', name: 'Vikram Desai', location: 'Vadodara', rating: 4, review_text: 'Good quality ceramics at reasonable prices. Delivery was quick and careful.' },
  { id: 'review-5', name: 'Neha Joshi', location: 'Rajkot', rating: 5, review_text: 'Got a custom kettle set made. The craftsmanship is beautiful and exactly what I wanted.' },
  { id: 'review-6', name: 'Amit Trivedi', location: 'Ahmedabad', rating: 5, review_text: 'Been buying from One Way Ceramic for 2 years. Consistent handmade quality.' },
  { id: 'review-7', name: 'Sunita Rao', location: 'Pune', rating: 4, review_text: 'The bowls and plates are gorgeous. Earthy tones that suit our home perfectly.' },
  { id: 'review-8', name: 'Kavya Nair', location: 'Bangalore', rating: 5, review_text: 'Ordered for a wedding gift. Beautiful packaging and stunning pieces.' }
]

export const fallbackSettings: SiteSettings = FALLBACK_SETTINGS
