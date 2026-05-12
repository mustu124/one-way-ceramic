'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  type CartItem,
  addToCart,
  cartCount,
  cartTotal,
  clearCart,
  getCart,
  removeFromCart,
  updateQty
} from '@/lib/cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  add: (item: Omit<CartItem, 'quantity'>, qty: number) => void
  update: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setItems(getCart())
  }, [])

  const add = useCallback((item: Omit<CartItem, 'quantity'>, qty: number) => {
    setItems(addToCart(item, qty))
  }, [])

  const update = useCallback((productId: string, quantity: number) => {
    setItems(updateQty(productId, quantity))
  }, [])

  const remove = useCallback((productId: string) => {
    setItems(removeFromCart(productId))
  }, [])

  const clear = useCallback(() => {
    clearCart()
    setItems([])
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        count: cartCount(items),
        total: cartTotal(items),
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        add,
        update,
        remove,
        clear
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
