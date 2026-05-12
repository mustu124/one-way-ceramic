import { ProductTable } from '@/components/admin/ProductTable'
import { getCategories, getProducts } from '@/lib/data'

export const metadata = { title: 'Products | One Way Ceramic Studio' }
export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories({ admin: true }),
    getProducts({ admin: true, limit: 500 })
  ])

  return <ProductTable categories={categories} initialProducts={products} />
}
