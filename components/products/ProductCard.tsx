'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'
import { discountPercent, formatInr, priceLabel } from '@/lib/format'
import { isOutOfStock } from '@/lib/stock'
import { waEnquiryLink } from '@/lib/waLink'
import { useCart } from '@/context/CartContext'

export function ProductCard({
  product,
  onOpen,
  subcategoryName
}: {
  product: Product
  onOpen?: (product: Product) => void
  subcategoryName?: string
}) {
  const { add, openCart } = useCart()
  const [added, setAdded] = useState(false)
  const discount = discountPercent(product.price_inr, product.original_price_inr)
  const productSubcategory = subcategoryName || product.subcategories?.name || ''
  const outOfStock = isOutOfStock(product)

  function handleAddToCart() {
    if (outOfStock) return
    add(
      {
        productId: product.id,
        name: product.name,
        price_inr: product.price_inr,
        original_price_inr: product.original_price_inr ?? null,
        image_url: product.image_url,
        subcategoryName: productSubcategory
      },
      1
    )
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <article className="overflow-hidden rounded-lg border border-brown/10 bg-white shadow-[0_10px_30px_rgba(58,46,34,0.06)]">
      <button onClick={() => onOpen?.(product)} className="block w-full text-left" aria-label={`View ${product.name}`}>
        <div className="relative aspect-square bg-beige">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(min-width: 768px) 260px, 50vw" unoptimized />
          <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1.5">
            {outOfStock && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">Out of Stock</span>}
            {product.badge && <span className="rounded-full bg-brown/90 px-2.5 py-1 text-[11px] font-semibold text-white">{product.badge}</span>}
            {discount && <span className="rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-white">{discount}% OFF</span>}
          </div>
        </div>
      </button>
      <div className="p-3">
        <button onClick={() => onOpen?.(product)} className="min-h-11 w-full text-left">
          <h3 className="line-clamp-2 font-heading text-xl font-semibold leading-6">{product.name}</h3>
        </button>
        <div className="mt-1 flex min-h-8 flex-wrap items-baseline gap-2">
          <span className={`text-xl font-bold ${product.price_inr === 0 ? 'text-text-light' : 'text-gold-dark'}`}>{priceLabel(product.price_inr)}</span>
          {product.original_price_inr && <span className="text-sm text-text-light line-through">{formatInr(product.original_price_inr)}</span>}
        </div>
        {product.price_inr > 0 ? (
          <>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`mt-3 flex min-h-11 w-full items-center justify-center rounded-full px-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-text-light ${added ? 'bg-gold-dark' : 'bg-brown active:bg-ink'}`}
            >
              {outOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <a
              href={waEnquiryLink(product.name, product.price_inr, product.image_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block min-h-8 text-center text-[11px] text-text-light underline underline-offset-2"
            >
              Enquire for this item only
            </a>
          </>
        ) : (
          <div className="mt-3 grid gap-2">
            {outOfStock && <p className="text-center text-sm font-semibold text-ink">Out of Stock</p>}
            <a
              href={waEnquiryLink(product.name, 0, product.image_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center rounded-full bg-brown px-3 text-sm font-semibold text-white active:bg-ink"
            >
              Enquire on WhatsApp
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

export default ProductCard
