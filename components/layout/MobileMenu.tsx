'use client'

import Link from 'next/link'
import { ChevronDown, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import type { CategoryTree } from '@/types'
import { waCategoryLink, waGeneralLink } from '@/lib/waLink'

export function MobileMenu({
  open,
  categories,
  onClose
}: {
  open: boolean
  categories: CategoryTree[]
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState<string>(categories[0]?.slug || '')

  return (
    <div className={`fixed inset-0 z-[10000] transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button className={`absolute inset-0 bg-black/35 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} aria-label="Close menu" />
      <aside className={`absolute right-0 top-0 flex h-full w-[88vw] max-w-sm flex-col bg-ivory shadow-soft transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex min-h-16 items-center justify-between border-b border-brown/10 px-5">
          <div>
            <p className="font-heading text-2xl font-semibold">One Way Ceramic</p>
            <p className="text-xs uppercase tracking-[0.18em] text-text-light">Studio · Ahmedabad</p>
          </div>
          <button onClick={onClose} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-beige" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <Link onClick={onClose} href="/shop" className="mb-3 flex min-h-12 items-center justify-between rounded-lg bg-brown px-4 font-medium text-white">
            Shop All Collections
            <span aria-hidden>→</span>
          </Link>
          {categories.map((category) => (
            <div key={category.id} className="border-b border-brown/10 py-2">
              <button
                className="flex min-h-12 w-full items-center justify-between text-left font-medium"
                onClick={() => setExpanded(expanded === category.slug ? '' : category.slug)}
                aria-expanded={expanded === category.slug}
              >
                {category.name}
                <ChevronDown className={`transition ${expanded === category.slug ? 'rotate-180' : ''}`} size={18} />
              </button>
              {expanded === category.slug && (
                <div className="grid gap-1 pb-3 pl-3">
                  <Link onClick={onClose} href={`/shop/${category.slug}`} className="min-h-10 py-2 text-sm font-medium text-gold-dark">
                    View all {category.name}
                  </Link>
                  {category.subcategories.map((sub) => (
                    <Link key={sub.id} onClick={onClose} href={`/shop/${category.slug}?subcategory=${sub.slug}`} className="min-h-10 py-2 text-sm text-text-light">
                      {sub.name}
                    </Link>
                  ))}
                  <a href={waCategoryLink(category.name)} className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-brown px-4 text-sm font-semibold text-white">
                    Enquire {category.name}
                  </a>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="safe-bottom border-t border-brown/10 p-5">
          <a href={waGeneralLink()} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brown px-5 font-semibold text-white">
            <MessageCircle size={19} />
            WhatsApp Enquiry
          </a>
        </div>
      </aside>
    </div>
  )
}
