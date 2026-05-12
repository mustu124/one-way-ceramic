'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X } from 'lucide-react'
import type { Product } from '@/types'

export function GalleryGrid({ products }: { products: Product[] }) {
  const images = products.slice(0, 12)
  const [active, setActive] = useState<Product | null>(null)

  return (
    <section id="gallery" className="section-pad bg-ivory">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Our Craft · @onewayceramic</p>
          <h2 className="font-heading text-4xl font-semibold md:text-5xl">Photo Gallery</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {images.map((product) => (
            <button key={product.id} onClick={() => setActive(product)} className="relative aspect-square overflow-hidden rounded-lg bg-beige" aria-label={`Open ${product.name} image`}>
              <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="33vw" unoptimized />
            </button>
          ))}
        </div>
      </div>
      {active && (
        <div className="fixed inset-0 z-[10001] grid place-items-center bg-black/80 p-4">
          <button onClick={() => setActive(null)} className="absolute right-4 top-4 grid min-h-11 min-w-11 place-items-center rounded-full bg-white text-brown" aria-label="Close image">
            <X size={20} />
          </button>
          <div className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-lg bg-beige">
            <Image src={active.image_url} alt={active.name} fill className="object-cover" sizes="90vw" unoptimized />
          </div>
        </div>
      )}
    </section>
  )
}
