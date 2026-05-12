'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartIcon({ showLabel = false }: { showLabel?: boolean }) {
  const { count, openCart } = useCart()

  return (
    <button
      type="button"
      onClick={openCart}
      className={`relative flex min-h-11 min-w-11 items-center justify-center rounded-lg text-brown ${showLabel ? 'flex-col gap-1' : 'gap-1.5'}`}
      aria-label={`Cart - ${count} items`}
    >
      <span className="relative">
        <ShoppingCart className="h-6 w-6" />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold leading-none text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
      {showLabel && <span className="text-[11px] font-medium text-text-light">Cart</span>}
    </button>
  )
}
