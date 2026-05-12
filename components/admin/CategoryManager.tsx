'use client'

import { useState } from 'react'
import type { CategoryTree } from '@/types'

export function CategoryManager({ initialCategories }: { initialCategories: CategoryTree[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [message, setMessage] = useState('')

  async function saveCategory(category: CategoryTree) {
    const res = await fetch(`/api/categories/${category.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    })
    setMessage(res.ok ? 'Category saved.' : 'Category API requires Supabase configuration.')
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-soft">
      <h1 className="font-heading text-3xl font-semibold">Categories & Subcategories</h1>
      <p className="mt-2 text-sm text-text-light">Edit names, slugs, image URLs and sort order. Add/delete can be done from Supabase SQL or extended here when the live project is connected.</p>
      <div className="mt-5 grid gap-4">
        {categories.map((category, index) => (
          <article key={category.id} className="rounded-lg border border-brown/10 p-4">
            <div className="grid gap-3 md:grid-cols-4">
              <input className="admin-input" value={category.name} onChange={(e) => {
                const next = [...categories]
                next[index] = { ...category, name: e.target.value }
                setCategories(next)
              }} />
              <input className="admin-input" value={category.slug} onChange={(e) => {
                const next = [...categories]
                next[index] = { ...category, slug: e.target.value }
                setCategories(next)
              }} />
              <input className="admin-input" placeholder="Image URL" value={category.image_url || ''} onChange={(e) => {
                const next = [...categories]
                next[index] = { ...category, image_url: e.target.value }
                setCategories(next)
              }} />
              <button onClick={() => void saveCategory(category)} className="min-h-11 rounded-full bg-brown px-4 font-semibold text-white">Save</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.subcategories.map((sub) => <span key={sub.id} className="rounded-full bg-beige px-3 py-1 text-sm text-text-light">{sub.name}</span>)}
            </div>
          </article>
        ))}
      </div>
      {message && <p className="mt-4 text-sm text-text-light">{message}</p>}
    </div>
  )
}
