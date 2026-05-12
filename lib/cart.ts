export interface CartItem {
  productId: string
  name: string
  price_inr: number
  original_price_inr: number | null
  image_url: string
  subcategoryName: string
  quantity: number
}

const CART_KEY = 'owc_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(item: Omit<CartItem, 'quantity'>, qty: number): CartItem[] {
  const cart = getCart()
  const quantity = Math.max(1, Math.min(qty, 99))
  const existing = cart.find((cartItem) => cartItem.productId === item.productId)

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 99)
  } else {
    cart.push({ ...item, quantity })
  }

  saveCart(cart)
  return cart
}

export function updateQty(productId: string, quantity: number): CartItem[] {
  const cart = getCart().map((item) =>
    item.productId === productId
      ? { ...item, quantity: Math.max(1, Math.min(quantity, 99)) }
      : item
  )
  saveCart(cart)
  return cart
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((item) => item.productId !== productId)
  saveCart(cart)
  return cart
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_KEY)
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price_inr * item.quantity, 0)
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
