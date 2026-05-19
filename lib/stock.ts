import type { Product } from '@/types'

export function isOutOfStock(product: Pick<Product, 'stock_quantity'>): boolean {
  return Number(product.stock_quantity) <= 0
}
