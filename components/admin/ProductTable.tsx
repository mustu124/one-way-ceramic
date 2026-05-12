'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import type { CategoryTree, Product } from '@/types'
import { formatInr } from '@/lib/format'
import { ProductForm } from './ProductForm'

export function ProductTable({ categories, initialProducts }: { categories: CategoryTree[]; initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [editing, setEditing] = useState<Product | null | undefined>(undefined)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(0)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState('')

  async function refresh(message = '') {
    const res = await fetch('/api/products?admin=1&limit=500')
    const json = await res.json()
    setProducts(json.products || products)
    setEditing(undefined)
    setError(message)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function remove(product: Product) {
    if (!confirm(`Delete ${product.name}?`)) return
    setError('')
    setDeletingId(product.id)
    const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
    const json = await res.json()
    setDeletingId('')
    if (!res.ok) {
      if (json.error?.includes('preview product')) {
        await refresh('Product list refreshed with live Supabase products. Try deleting again.')
        return
      }
      setError(json.error || 'Could not delete product')
      return
    }
    setProducts((current) => current.filter((item) => item.id !== product.id))
  }

  const filtered = useMemo(() => products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || product.subcategories?.categories?.slug === category
    return matchesQuery && matchesCategory
  }), [products, query, category])

  const pageItems = filtered.slice(page * 20, page * 20 + 20)

  if (editing !== undefined) {
    return <ProductForm categories={categories} product={editing} onSaved={refresh} onCancel={() => setEditing(undefined)} />
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-soft">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="font-heading text-3xl font-semibold">Products</h2>
        <button onClick={() => setEditing(null)} className="min-h-11 rounded-full bg-brown px-5 font-semibold text-white">Add Product</button>
      </div>
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
        <input className="admin-input" placeholder="Search by name" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }} />
        <select className="admin-input" value={category} onChange={(e) => { setCategory(e.target.value); setPage(0) }}>
          <option value="all">All categories</option>
          {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
        </select>
      </div>
      {error && <p className="mb-4 text-sm font-medium text-red-700">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-beige text-xs uppercase tracking-[0.12em] text-text-light">
            <tr>
              {['Thumbnail', 'Name', 'Category/Sub', 'Price', 'Was Price', 'Stock', 'Badge', 'Active', 'Edit', 'Delete'].map((head) => <th key={head} className="p-3">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((product) => (
              <tr key={product.id} className="border-b border-brown/10">
                <td className="p-3"><span className="relative block h-14 w-14 overflow-hidden rounded bg-beige"><Image src={product.image_url} alt="" fill className="object-cover" unoptimized /></span></td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3 text-text-light">{product.subcategories?.categories?.name} / {product.subcategories?.name}</td>
                <td className="p-3">{formatInr(product.price_inr)}</td>
                <td className="p-3">{product.original_price_inr ? formatInr(product.original_price_inr) : '-'}</td>
                <td className="p-3">{product.stock_quantity ?? 0}</td>
                <td className="p-3">{product.badge || '-'}</td>
                <td className="p-3">{product.is_active ? 'Yes' : 'No'}</td>
                <td className="p-3"><button onClick={() => setEditing(product)} className="min-h-10 rounded-full bg-beige px-4 font-semibold">Edit</button></td>
                <td className="p-3"><button onClick={() => void remove(product)} disabled={deletingId === product.id} className="min-h-10 rounded-full bg-red-100 px-4 font-semibold text-red-700 disabled:opacity-60">{deletingId === product.id ? 'Deleting...' : 'Delete'}</button></td>
              </tr>
            ))}
            {!pageItems.length && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-text-light">No products available at the time.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-text-light">{filtered.length} products</p>
        <div className="flex gap-2">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="min-h-10 rounded-full bg-beige px-4 disabled:opacity-40">Prev</button>
          <button disabled={(page + 1) * 20 >= filtered.length} onClick={() => setPage(page + 1)} className="min-h-10 rounded-full bg-beige px-4 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  )
}
