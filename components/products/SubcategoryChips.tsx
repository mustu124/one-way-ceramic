'use client'

import type { Subcategory } from '@/types'

export function SubcategoryChips({
  subcategories,
  active,
  onChange
}: {
  subcategories: Subcategory[]
  active: string
  onChange: (slug: string) => void
}) {
  if (!subcategories.length) return null
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
      <button onClick={() => onChange('all')} className={`min-h-10 shrink-0 rounded-full px-4 text-sm ${active === 'all' ? 'bg-gold text-white' : 'bg-beige text-text-light'}`}>
        All pieces
      </button>
      {subcategories.map((sub) => (
        <button key={sub.id} onClick={() => onChange(sub.slug)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm ${active === sub.slug ? 'bg-gold text-white' : 'bg-beige text-text-light'}`}>
          {sub.name}
        </button>
      ))}
    </div>
  )
}
