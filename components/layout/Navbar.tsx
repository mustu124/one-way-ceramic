'use client'

import Link from 'next/link'
import { Menu, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CategoryTree } from '@/types'
import { MobileMenu } from './MobileMenu'
import { waGeneralLink } from '@/lib/waLink'
import CartIcon from '@/components/cart/CartIcon'

export function Navbar({ categories }: { categories: CategoryTree[] }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-[9998] border-b border-brown/10 transition-all ${scrolled ? 'bg-ivory/82 shadow-sm backdrop-blur-xl' : 'bg-ivory'} ${scrolled ? 'h-[52px]' : 'h-16'}`}>
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="leading-none" aria-label="One Way Ceramic Studio home">
            <span className="block font-heading text-2xl font-semibold md:text-3xl">One Way Ceramic</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-text-light">Studio · Ahmedabad</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-text-light md:flex">
            <Link href="/shop" className="hover:text-brown">Shop</Link>
            <Link href="/#gallery" className="hover:text-brown">Gallery</Link>
            <Link href="/#visit" className="hover:text-brown">Visit</Link>
            <Link href="/#faq" className="hover:text-brown">FAQ</Link>
          </nav>
          <div className="flex items-center gap-1">
            <CartIcon />
            <a href={waGeneralLink()} target="_blank" rel="noopener noreferrer" className="grid min-h-11 min-w-11 place-items-center rounded-full bg-brown text-white" aria-label="WhatsApp One Way Ceramic">
              <MessageCircle size={20} />
            </a>
            <button onClick={() => setOpen(true)} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-beige text-brown" aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} categories={categories} onClose={() => setOpen(false)} />
    </>
  )
}
