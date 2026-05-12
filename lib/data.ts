import type { Category, CategoryTree, Product, Review, SiteSettings, Subcategory } from '@/types'
import { unstable_noStore as noStore } from 'next/cache'
import { ensureCatalogBasicsOnce } from './catalog'
import { fallbackCategories, fallbackCategoryTree, fallbackProducts, fallbackReviews, fallbackSettings, fallbackSubcategories } from './fallback-data'
import { supabaseAnonServer, supabaseServer } from './supabase-server'

export interface AdminProductStats {
  total: number
  active: number
  latest: Product[]
}

export async function getCategories(options?: { admin?: boolean }): Promise<CategoryTree[]> {
  noStore()
  const source = options?.admin ? supabaseServer : supabaseAnonServer
  if (!source) return options?.admin ? [] : fallbackCategoryTree
  if (supabaseServer) {
    try {
      await ensureCatalogBasicsOnce(supabaseServer)
    } catch {
      if (options?.admin) return []
    }
  }
  const { data, error } = await source
    .from('categories')
    .select('*, subcategories(*)')
    .order('sort_order', { ascending: true })
    .order('sort_order', { referencedTable: 'subcategories', ascending: true })
  if (error || !data?.length) return options?.admin ? [] : fallbackCategoryTree
  return data as CategoryTree[]
}

export async function getFlatCategories(): Promise<Category[]> {
  const tree = await getCategories()
  return tree.map(({ subcategories, ...cat }) => cat)
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const tree = await getCategories()
  return tree.flatMap((cat) => cat.subcategories)
}

export async function getProducts(options?: {
  category?: string
  subcategory?: string
  limit?: number
  offset?: number
  admin?: boolean
}): Promise<Product[]> {
  noStore()
  const source = options?.admin ? supabaseServer : supabaseAnonServer
  if (!source) return options?.admin ? [] : filterFallbackProducts(options)
  const hasRelationshipFilter = Boolean(options?.category || options?.subcategory)
  let query = source
    .from('products')
    .select(hasRelationshipFilter ? '*, subcategories!inner(*, categories!inner(*))' : '*, subcategories(*, categories(*))')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (!options?.admin) query = query.eq('is_active', true)
  if (options?.subcategory) query = query.eq('subcategories.slug', options.subcategory)
  if (options?.category) query = query.eq('subcategories.categories.slug', options.category)
  if (typeof options?.limit === 'number') {
    const offset = options.offset || 0
    query = query.range(offset, offset + options.limit - 1)
  }

  const { data, error } = await query
  if (error) return options?.admin ? [] : filterFallbackProducts(options)
  if (!data?.length) return []
  return data as Product[]
}

export async function getAdminProductStats(limit = 10): Promise<AdminProductStats> {
  noStore()
  if (!supabaseServer) return { total: 0, active: 0, latest: [] }

  const [totalResult, activeResult, latestResult] = await Promise.all([
    supabaseServer
      .from('products')
      .select('id', { count: 'exact', head: true }),
    supabaseServer
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabaseServer
      .from('products')
      .select('*, subcategories(*, categories(*))')
      .order('created_at', { ascending: false })
      .limit(limit)
  ])

  if (latestResult.error) return { total: totalResult.count || 0, active: activeResult.count || 0, latest: [] }

  return {
    total: totalResult.count || 0,
    active: activeResult.count || 0,
    latest: (latestResult.data || []) as Product[]
  }
}

export async function getReviews(): Promise<Review[]> {
  noStore()
  if (!supabaseAnonServer) return fallbackReviews
  const { data, error } = await supabaseAnonServer.from('reviews').select('*').eq('is_active', true).order('created_at', { ascending: false })
  if (error || !data?.length) return fallbackReviews
  return data as Review[]
}

export async function getSiteSettings(): Promise<SiteSettings> {
  noStore()
  if (!supabaseAnonServer) return fallbackSettings
  const { data, error } = await supabaseAnonServer.from('site_settings').select('*')
  if (error || !data?.length) return fallbackSettings
  return data.reduce((settings, row: { key: string; value: string | null }) => ({ ...settings, [row.key]: row.value || '' }), fallbackSettings)
}

function filterFallbackProducts(options?: { category?: string; subcategory?: string; limit?: number; offset?: number }) {
  let products = fallbackProducts
  if (options?.subcategory) products = products.filter((product) => product.subcategories?.slug === options.subcategory)
  if (options?.category) products = products.filter((product) => product.subcategories?.categories?.slug === options.category)
  if (typeof options?.limit === 'number') {
    const offset = options.offset || 0
    products = products.slice(offset, offset + options.limit)
  }
  return products
}

export const localFallback = {
  categories: fallbackCategories,
  subcategories: fallbackSubcategories,
  products: fallbackProducts,
  reviews: fallbackReviews,
  settings: fallbackSettings
}
