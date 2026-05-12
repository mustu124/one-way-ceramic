'use client'

import Link from 'next/link'
import { GalleryHorizontal, Home, MapPin, ShoppingBag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import CartIcon from '@/components/cart/CartIcon'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/#gallery', label: 'Gallery', icon: GalleryHorizontal },
  { href: '/#visit', label: 'Contact', icon: MapPin }
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-[9997] border-t border-brown/10 bg-ivory/95 px-2 pt-2 shadow-[0_-12px_30px_rgba(58,46,34,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.slice(0, 2).map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link key={item.label} href={item.href} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium ${active ? 'text-gold-dark' : 'text-text-light'}`}>
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
        <div className="flex min-h-12 flex-col items-center justify-center rounded-lg">
          <CartIcon showLabel />
        </div>
        {items.slice(2).map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link key={item.label} href={item.href} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium ${active ? 'text-gold-dark' : 'text-text-light'}`}>
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
