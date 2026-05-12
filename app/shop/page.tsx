import { ProductBrowser } from '@/components/products/ProductBrowser'
import { getCategories, getProducts } from '@/lib/data'

export const metadata = {
  title: 'Shop All Ceramics | One Way Ceramic Studio'
}
export const dynamic = 'force-dynamic'

export default async function ShopPage({ searchParams }: { searchParams: { subcategory?: string } }) {
  const [categories, products] = await Promise.all([getCategories(), getProducts({ limit: 220 })])

  return (
    <div className="pt-4">
      <ProductBrowser
        categories={categories}
        products={products}
        initialSubcategory={searchParams.subcategory || 'all'}
        title="Shop All Ceramics"
      />
    </div>
  )
}
