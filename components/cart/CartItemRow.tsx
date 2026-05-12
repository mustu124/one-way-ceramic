'use client'

import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import QtySelector from '@/components/products/QtySelector'
import type { CartItem } from '@/lib/cart'

export default function CartItemRow({ item }: { item: CartItem }) {
  const { update, remove } = useCart()
  const lineTotal = (item.price_inr * item.quantity).toLocaleString('en-IN')

  return (
    <div className="flex gap-3 border-b border-beige2 py-3 last:border-0">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-beige">
        <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" unoptimized />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="line-clamp-2 font-heading text-base font-semibold leading-tight text-text">{item.name}</p>
        <p className="text-xs text-text-light">{item.subcategoryName || 'Ceramics'}</p>
        <div className="mt-auto flex items-center gap-3">
          <div className="w-28 shrink-0">
            <QtySelector value={item.quantity} onChange={(n) => update(item.productId, n)} size="sm" />
          </div>
          <span className="ml-auto text-sm font-bold text-gold-dark">₹{lineTotal}</span>
          <button
            type="button"
            onClick={() => remove(item.productId)}
            className="grid min-h-11 min-w-11 place-items-center text-text-light transition-colors hover:text-red-600"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
