import Image from 'next/image'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { getAdminProductStats, getCategories, getSiteSettings } from '@/lib/data'
import { formatInr } from '@/lib/format'

export const metadata = { title: 'Dashboard | One Way Ceramic Studio' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [categories, productStats, settings] = await Promise.all([
    getCategories({ admin: true }),
    getAdminProductStats(10),
    getSiteSettings()
  ])
  const latest = productStats.latest

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Total Products" value={productStats.total} />
        <Stat label="Active Products" value={productStats.active} />
        <Stat label="Total Categories" value={categories.length} />
      </div>
      <div className="rounded-lg bg-white p-5 shadow-soft">
        <h1 className="font-heading text-3xl font-semibold">Last Added Products</h1>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-beige text-xs uppercase tracking-[0.12em] text-text-light">
              <tr><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Collection</th><th className="p-3">Price</th><th className="p-3">Active</th></tr>
            </thead>
            <tbody>
              {latest.map((product) => (
                <tr key={product.id} className="border-b border-brown/10">
                  <td className="p-3"><span className="relative block h-12 w-12 overflow-hidden rounded bg-beige"><Image src={product.image_url} alt="" fill className="object-cover" unoptimized /></span></td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-text-light">{product.subcategories?.categories?.name}</td>
                  <td className="p-3">{formatInr(product.price_inr)}</td>
                  <td className="p-3">{product.is_active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-text-light">{label}</p>
      <p className="mt-2 font-heading text-5xl font-semibold text-brown">{value}</p>
    </div>
  )
}
