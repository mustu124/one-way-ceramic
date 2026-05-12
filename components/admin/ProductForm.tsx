'use client'

import { useMemo, useState } from 'react'
import type { CategoryTree, Product } from '@/types'
import { ImageUploader } from './ImageUploader'

type ProductPayload = {
  name: string
  subcategory_id: string
  description: string
  image_url: string
  badge: string
  tags: string
  price_inr: string
  original_price_inr: string
  stock_quantity: string
  sort_order: string
  is_active: boolean
}

function parseNumberInput(value: string, fallback = 0) {
  if (value.trim() === '') return fallback
  return Number(value)
}

export function ProductForm({
  categories,
  product,
  onSaved,
  onCancel
}: {
  categories: CategoryTree[]
  product?: Product | null
  onSaved: () => void
  onCancel: () => void
}) {
  const initialCategory = product?.subcategories?.categories?.slug || categories[0]?.slug || ''
  const [categorySlug, setCategorySlug] = useState(initialCategory)
  const activeCategory = categories.find((category) => category.slug === categorySlug) || categories[0]
  const [payload, setPayload] = useState<ProductPayload>({
    name: product?.name || '',
    subcategory_id: product?.subcategory_id || activeCategory?.subcategories[0]?.id || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    badge: product?.badge || '',
    tags: product?.tags?.join(', ') || '',
    price_inr: product ? String(product.price_inr ?? 0) : '',
    original_price_inr: product?.original_price_inr ? String(product.original_price_inr) : '',
    stock_quantity: product ? String(product.stock_quantity ?? 0) : '',
    sort_order: product ? String(product.sort_order ?? 0) : '',
    is_active: product?.is_active ?? true
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const priceError = useMemo(() => {
    if (payload.price_inr === '') return ''
    const price = Number(payload.price_inr)
    const original = payload.original_price_inr === '' ? null : Number(payload.original_price_inr)
    if (Number.isNaN(price) || price < 0) return 'Price must be 0 or higher'
    if (original !== null && (Number.isNaN(original) || original <= price)) return 'Original price must be higher than current price'
    return ''
  }, [payload.price_inr, payload.original_price_inr])

  async function save() {
    setError('')
    if (!payload.name || !payload.subcategory_id || !payload.price_inr || !payload.image_url) {
      setError('Name, subcategory, price and image are required.')
      return
    }
    if (priceError) {
      setError(priceError)
      return
    }
    setSaving(true)
    const body = {
      ...payload,
      tags: payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      badge: payload.badge || null,
      description: payload.description || null,
      price_inr: parseNumberInput(payload.price_inr),
      original_price_inr: payload.original_price_inr ? parseNumberInput(payload.original_price_inr) : null,
      stock_quantity: parseNumberInput(payload.stock_quantity),
      sort_order: parseNumberInput(payload.sort_order)
    }
    const res = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
      method: product ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(json.error || 'Could not save product')
      return
    }
    onSaved()
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-heading text-3xl font-semibold">{product ? 'Edit Product' : 'Add Product'}</h2>
        <button onClick={onCancel} className="min-h-11 rounded-full bg-beige px-4 text-sm font-semibold">Cancel</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">Product Name*<input className="admin-input" value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} /></label>
        <label className="grid gap-1 text-sm font-medium">Category*<select className="admin-input" value={categorySlug} onChange={(e) => {
          const next = categories.find((cat) => cat.slug === e.target.value)
          setCategorySlug(e.target.value)
          setPayload({ ...payload, subcategory_id: next?.subcategories[0]?.id || '' })
        }}>{categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Subcategory*<select className="admin-input" value={payload.subcategory_id} onChange={(e) => setPayload({ ...payload, subcategory_id: e.target.value })}>{activeCategory?.subcategories.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Badge<input className="admin-input" placeholder="Bestseller, New, Sale" value={payload.badge} onChange={(e) => setPayload({ ...payload, badge: e.target.value })} /></label>
        <label className="grid gap-1 text-sm font-medium">Price (₹)*<input className="admin-input" type="number" min={0} value={payload.price_inr} onChange={(e) => setPayload({ ...payload, price_inr: e.target.value })} /></label>
        <label className="grid gap-1 text-sm font-medium">Original Price (₹) — leave blank if no discount<input className="admin-input" type="number" min={0} value={payload.original_price_inr} onChange={(e) => setPayload({ ...payload, original_price_inr: e.target.value })} /></label>
        <label className="grid gap-1 text-sm font-medium">Stock Quantity<input className="admin-input" type="number" min={0} value={payload.stock_quantity} onChange={(e) => setPayload({ ...payload, stock_quantity: e.target.value })} /></label>
        <label className="grid gap-1 text-sm font-medium md:col-span-2">Description<textarea className="admin-input min-h-28" value={payload.description} onChange={(e) => setPayload({ ...payload, description: e.target.value })} /></label>
        <label className="grid gap-1 text-sm font-medium">Tags (comma-separated)<input className="admin-input" value={payload.tags} onChange={(e) => setPayload({ ...payload, tags: e.target.value })} /></label>
        <label className="grid gap-1 text-sm font-medium">Sort Order<input className="admin-input" type="number" value={payload.sort_order} onChange={(e) => setPayload({ ...payload, sort_order: e.target.value })} /></label>
        <label className="flex min-h-11 items-center gap-3 text-sm font-medium"><input type="checkbox" checked={payload.is_active} onChange={(e) => setPayload({ ...payload, is_active: e.target.checked })} /> Active</label>
        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium">Image Upload*</p>
          <ImageUploader currentUrl={payload.image_url} onUploaded={(url) => setPayload({ ...payload, image_url: url })} />
        </div>
      </div>
      {(error || priceError) && <p className="mt-4 text-sm font-medium text-red-700">{error || priceError}</p>}
      <button onClick={save} disabled={saving} className="mt-5 min-h-12 rounded-full bg-brown px-7 font-semibold text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save Product'}</button>
    </div>
  )
}
