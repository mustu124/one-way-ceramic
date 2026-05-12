import Link from 'next/link'
import { Instagram, Mail, MapPin, Phone } from 'lucide-react'
import type { CategoryTree } from '@/types'
import { BUSINESS } from '@/lib/constants'
import { waGeneralLink } from '@/lib/waLink'

export function Footer({ categories }: { categories: CategoryTree[] }) {
  return (
    <footer className="bg-brown px-4 pb-28 pt-12 text-white md:px-8 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-9 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-heading text-3xl font-semibold">One Way Ceramic</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/72">Handcrafted ceramic collections for homes, restaurants, gifting and wholesale buyers across India.</p>
          <div className="mt-5 flex gap-3">
            <a href={waGeneralLink()} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-brown" aria-label="WhatsApp"><Phone size={18} /></a>
            <a href="mailto:hello@onewayceramic.com" className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white/10" aria-label="Email"><Mail size={18} /></a>
            <a href="https://www.instagram.com/" className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white/10" aria-label="Instagram"><Instagram size={18} /></a>
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold">Collections</p>
          <div className="grid gap-2 text-sm text-white/70">
            {categories.map((category) => (
              <Link key={category.id} href={`/shop/${category.slug}`} className="min-h-8 hover:text-white">{category.name}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold">Quick Links</p>
          <div className="grid gap-2 text-sm text-white/70">
            <Link href="/shop" className="min-h-8 hover:text-white">Shop All</Link>
            <Link href="/#gallery" className="min-h-8 hover:text-white">Gallery</Link>
            <Link href="/#visit" className="min-h-8 hover:text-white">Visit Us</Link>
            <Link href="/#faq" className="min-h-8 hover:text-white">FAQ</Link>
            <Link href="/admin/login" className="min-h-8 text-white/35 hover:text-white">Admin</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold">Visit</p>
          <p className="flex gap-2 text-sm leading-6 text-white/70"><MapPin className="mt-1 shrink-0" size={16} /> {BUSINESS.address}</p>
          <a href={`tel:${BUSINESS.phoneTel}`} className="mt-3 flex min-h-10 items-center gap-2 text-sm text-white/80"><Phone size={16} /> {BUSINESS.phoneDisplay}</a>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/12 pt-5 text-xs text-white/45">
        © {new Date().getFullYear()} One Way Ceramic Studio. Crafted in Ahmedabad.
      </div>
    </footer>
  )
}
