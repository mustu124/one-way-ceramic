'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { Product } from '@/types'
import { discountPercent, formatInr, priceLabel } from '@/lib/format'
import { isOutOfStock } from '@/lib/stock'
import { waEnquiryLink } from '@/lib/waLink'
import { useCart } from '@/context/CartContext'

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add, openCart } = useCart()
  const [added, setAdded] = useState(false)

  if (!product) return null
  const discount = discountPercent(product.price_inr, product.original_price_inr)
  const subcategoryName = product.subcategories?.name || ''
  const outOfStock = isOutOfStock(product)

  function handleAddToCart() {
    if (!product || outOfStock) return
    add(
      {
        productId: product.id,
        name: product.name,
        price_inr: product.price_inr,
        original_price_inr: product.original_price_inr ?? null,
        image_url: product.image_url,
        subcategoryName
      },
      1
    )
    setAdded(true)
    onClose()
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[10001] flex items-end justify-center md:items-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/45" onClick={onClose} aria-label="Close product details" />
      <article className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-ivory shadow-soft md:max-w-2xl md:rounded-2xl">
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid min-h-11 min-w-11 place-items-center rounded-full bg-white/90 text-brown" aria-label="Close">
          <X size={20} />
        </button>
        <div className="relative aspect-square w-full bg-beige md:aspect-[16/10]">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(min-width: 768px) 680px, 100vw" unoptimized />
        </div>
        <div className="p-5 md:p-7">
          <div className="flex flex-wrap gap-2">
            {outOfStock && <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">Out of Stock</span>}
            {product.badge && <span className="rounded-full bg-brown px-3 py-1 text-xs font-semibold text-white">{product.badge}</span>}
            {discount && <span className="rounded-full bg-clay px-3 py-1 text-xs font-semibold text-white">{discount}% OFF</span>}
          </div>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight">{product.name}</h2>
          <div className="mt-3 flex items-end gap-3">
            <span className={`text-3xl font-bold ${product.price_inr === 0 ? 'text-text-light' : 'text-gold-dark'}`}>{priceLabel(product.price_inr)}</span>
            {product.original_price_inr && <span className="pb-1 text-lg text-text-light line-through">{formatInr(product.original_price_inr)}</span>}
          </div>
          {product.description && <p className="mt-4 leading-7 text-text-light">{product.description}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            {product.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-beige px-3 py-1 text-xs text-text-light">#{tag}</span>
            ))}
          </div>
          <div className="mt-6 border-t border-beige2 pt-4">
            {product.price_inr > 0 ? (
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`min-h-12 w-full rounded-2xl px-6 text-base font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-text-light ${added ? 'bg-gold-dark' : 'bg-brown active:bg-ink'}`}
                >
                  {outOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <a
                  href={waEnquiryLink(product.name, product.price_inr, product.image_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-9 text-center text-xs text-text-light underline underline-offset-2"
                >
                  Enquire for this item only
                </a>
              </div>
            ) : (
              <div className="grid gap-3">
                <p className="text-center text-sm text-text-light">{outOfStock ? 'Out of Stock' : 'Price available on request'}</p>
                <a
                  href={waEnquiryLink(product.name, 0, product.image_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-brown px-6 text-base font-semibold text-white active:bg-ink"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
