'use client'

import type { CategoryTree } from '@/types'

export function CategoryTabs({
  categories,
  active,
  onChange,
  includeAll = true
}: {
  categories: CategoryTree[]
  active: string
  onChange: (slug: string) => void
  includeAll?: boolean
}) {
  const tabs = includeAll ? [{ slug: 'all', name: 'All' }, ...categories] : categories
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-2">
      {tabs.map((category) => (
        <button
          key={category.slug}
          onClick={() => onChange(category.slug)}
          className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition ${active === category.slug ? 'border-brown bg-brown text-white' : 'border-brown/12 bg-white text-text-light'}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
