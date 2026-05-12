import type { CategoryTree, Product } from '@/types'
import { ProductBrowser } from '@/components/products/ProductBrowser'

export function ProductsSection({ categories, products }: { categories: CategoryTree[]; products: Product[] }) {
  return <ProductBrowser categories={categories} products={products.slice(0, 48)} title="New Arrivals & Bestsellers" />
}
