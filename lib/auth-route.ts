import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function getRouteUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set() {},
      remove() {}
    }
  })
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function validatePrice(price_inr: unknown, original_price_inr: unknown) {
  const price = Number(price_inr)
  const original = original_price_inr === null || original_price_inr === undefined || original_price_inr === '' ? null : Number(original_price_inr)
  if (Number.isNaN(price) || price < 0) return 'price_inr must be greater than or equal to 0'
  if (original !== null && (Number.isNaN(original) || original <= price)) return 'Original price must be higher than current price'
  return null
}

export function validateStockQuantity(stock_quantity: unknown) {
  const quantity = Number(stock_quantity ?? 0)
  if (!Number.isInteger(quantity) || quantity < 0) return 'Stock quantity must be a whole number greater than or equal to 0'
  return null
}
