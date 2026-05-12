import { CategoryManager } from '@/components/admin/CategoryManager'
import { getCategories } from '@/lib/data'

export const metadata = { title: 'Categories | One Way Ceramic Studio' }
export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getCategories({ admin: true })
  return <CategoryManager initialCategories={categories} />
}
