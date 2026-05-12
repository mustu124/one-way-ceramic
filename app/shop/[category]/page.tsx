import { notFound } from 'next/navigation'
import { ProductBrowser } from '@/components/products/ProductBrowser'
import { getCategories, getProducts } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { category: string } }) {
  const categories = await getCategories()
  const category = categories.find((item) => item.slug === params.category)
  return { title: `${category?.name || 'Collection'} | One Way Ceramic Studio` }
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { category: string }
  searchParams: { subcategory?: string }
}) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: params.category, limit: 120 })
  ])
  const category = categories.find((item) => item.slug === params.category)
  if (!category) notFound()

  return (
    <div className="pt-4">
      <ProductBrowser
        categories={categories}
        products={products}
        initialCategory={category.slug}
        initialSubcategory={searchParams.subcategory || 'all'}
        title={`${category.name} Collection`}
      />
    </div>
  )
}
