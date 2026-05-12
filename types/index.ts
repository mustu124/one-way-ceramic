export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  sort_order: number
  created_at?: string
}

export interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  sort_order: number
}

export interface Product {
  id: string
  subcategory_id: string
  name: string
  description: string | null
  image_url: string
  badge: string | null
  tags: string[]
  price_inr: number
  original_price_inr: number | null
  stock_quantity: number
  is_active: boolean
  sort_order: number
  created_at: string
  subcategories?: Subcategory & { categories?: Category }
}

export interface Review {
  id: string
  name: string
  location: string | null
  rating: number
  review_text: string
}

export interface CategoryTree extends Category {
  subcategories: Subcategory[]
}

export interface SiteSettings {
  announcement_text: string
  offer_text: string
}
