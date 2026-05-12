'use client'

import { useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { waCartOrderLink } from '@/lib/waLink'
import CartItemRow from './CartItemRow'

export default function CartDrawer() {
  const { items, count, total, isOpen, closeCart, clear } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <button className="fixed inset-0 z-[10001] bg-black/40 backdrop-blur-sm" onClick={closeCart} aria-label="Close cart" />
      <aside className="cart-drawer fixed right-0 top-0 z-[10002] flex h-full w-full max-w-sm flex-col bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-beige2 px-4 py-4">
          <h2 className="font-heading text-2xl font-semibold text-text">
            Your Cart
            {count > 0 && <span className="ml-2 text-sm font-normal text-text-light">({count} items)</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="grid min-h-11 min-w-11 place-items-center text-text-light"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="font-heading text-2xl text-text">Your cart is empty</p>
              <p className="max-w-xs text-sm leading-6 text-text-light">Browse the collections and add pieces to your WhatsApp order.</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 min-h-11 rounded-lg bg-gold px-5 text-sm font-semibold text-white"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => <CartItemRow key={item.productId} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="safe-bottom border-t border-beige2 bg-ivory px-4 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-text-light">Order Total</span>
              <span className="font-heading text-3xl font-bold text-gold-dark">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <p className="mt-2 text-center text-[11px] leading-5 text-text-light">Final price confirmed by our team on WhatsApp. Bulk discounts available.</p>
            <a
              href={waCartOrderLink(items)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brown px-5 text-base font-semibold text-white"
            >
              <MessageCircle className="h-5 w-5" />
              Send Order on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                clear()
                closeCart()
              }}
              className="mt-3 min-h-10 w-full text-center text-xs text-text-light underline underline-offset-2"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
