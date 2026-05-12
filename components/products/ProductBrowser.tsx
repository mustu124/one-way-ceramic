'use client'

import { useMemo, useState } from 'react'
import type { CategoryTree, Product } from '@/types'
import { CategoryTabs } from './CategoryTabs'
import { ProductCard } from './ProductCard'
import { ProductModal } from './ProductModal'
import { SubcategoryChips } from './SubcategoryChips'

export function ProductBrowser({
  categories,
  products,
  initialCategory = 'all',
  initialSubcategory = 'all',
  showTabs = true,
  title = 'Handpicked Pieces'
}: {
  categories: CategoryTree[]
  products: Product[]
  initialCategory?: string
  initialSubcategory?: string
  showTabs?: boolean
  title?: string
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeSubcategory, setActiveSubcategory] = useState(initialSubcategory)
  const [selected, setSelected] = useState<Product | null>(null)

  const activeCategoryObj = categories.find((category) => category.slug === activeCategory)
  const subcategories = activeCategory === 'all' ? categories.flatMap((cat) => cat.subcategories) : activeCategoryObj?.subcategories || []

  const visible = useMemo(
    () =>
      products.filter((product) => {
        const categorySlug = product.subcategories?.categories?.slug
        const subSlug = product.subcategories?.slug
        const categoryMatch = activeCategory === 'all' || categorySlug === activeCategory
        const subMatch = activeSubcategory === 'all' || subSlug === activeSubcategory
        return categoryMatch && subMatch
      }),
    [products, activeCategory, activeSubcategory]
  )

  return (
    <section id="products" className="section-pad bg-ivory">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Shop</p>
            <h2 className="font-heading text-4xl font-semibold md:text-5xl">{title}</h2>
          </div>
          <p className="hidden max-w-md text-sm leading-6 text-text-light md:block">Retail, bulk and custom enquiries are handled directly over WhatsApp.</p>
        </div>
        {showTabs && (
          <div className="mb-4 grid gap-3">
            <CategoryTabs
              categories={categories}
              active={activeCategory}
              onChange={(slug) => {
                setActiveCategory(slug)
                setActiveSubcategory('all')
              }}
            />
            <SubcategoryChips subcategories={subcategories} active={activeSubcategory} onChange={setActiveSubcategory} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={setSelected} subcategoryName={product.subcategories?.name} />
          ))}
        </div>
        {!visible.length && <p className="rounded-lg bg-beige p-6 text-center text-text-light">No products available at the time.</p>}
      </div>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
