import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { waGeneralLink } from '@/lib/waLink'

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-ivory px-4 pb-12 pt-10 md:px-8 md:pb-20 md:pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-gold-dark">Ahmedabad Ceramic Studio</p>
          <h1 className="font-heading text-[42px] font-semibold italic leading-[0.98] text-text md:text-7xl">Where Clay Becomes Art</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-text-light">Handcrafted ceramic collections for your home, kitchen & table. Made with love in Ahmedabad.</p>
          <div className="mt-7 grid gap-3 sm:flex">
            <a href="#categories" className="flex min-h-12 items-center justify-center rounded-full bg-brown px-6 font-semibold text-white">Explore Collections</a>
            <a href={waGeneralLink()} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-brown/15 bg-white px-6 font-semibold text-brown">
              <MessageCircle size={18} />
              WhatsApp Enquiry
            </a>
          </div>
          <div className="mt-9 grid grid-cols-3 divide-x divide-brown/12 rounded-lg bg-beige p-3 text-center">
            {['500+ Products', '4.7 ★ Rated', 'Bulk Orders'].map((item) => (
              <div key={item} className="px-2 text-sm font-semibold text-brown">{item}</div>
            ))}
          </div>
        </div>
        <div className="image-panel relative min-h-[360px] overflow-hidden bg-beige shadow-soft md:min-h-[560px]">
          <Image src="/web-images/shopall.webp" alt="Handmade ceramic collection" fill priority className="object-cover" sizes="(min-width: 768px) 45vw, 100vw" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-brown/25 to-transparent" />
        </div>
      </div>
    </section>
  )
}
