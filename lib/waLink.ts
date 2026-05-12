import { BUSINESS } from './constants'
import type { CartItem } from './cart'

const WA = process.env.NEXT_PUBLIC_WA_NUMBER || BUSINESS.whatsapp

export function waEnquiryLink(productName: string, priceInr: number): string {
  const price = priceInr > 0 ? ` (${priceInr.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })})` : ''
  const msg = encodeURIComponent(
    `Hi! I'm interested in *${productName}*${price} from One Way Ceramic Studio. Can you share more details?`
  )
  return `https://wa.me/${WA}?text=${msg}`
}

export function waCategoryLink(categoryName: string): string {
  const msg = encodeURIComponent(
    `Hi! I'm browsing your *${categoryName}* collection. Can you share more details and pricing?`
  )
  return `https://wa.me/${WA}?text=${msg}`
}

export function waGeneralLink(): string {
  const msg = encodeURIComponent(`Hi! I'd like to enquire about your ceramic products.`)
  return `https://wa.me/${WA}?text=${msg}`
}

export function waCartOrderLink(items: CartItem[]): string {
  const lines = items
    .map((item) => {
      const lineTotal = (item.price_inr * item.quantity).toLocaleString('en-IN')
      return `- ${item.name} ×${item.quantity} — ₹${lineTotal}`
    })
    .join('\n')

  const total = items.reduce((sum, item) => sum + item.price_inr * item.quantity, 0).toLocaleString('en-IN')

  const msg = encodeURIComponent(
    `Hi! I'd like to place an order from One Way Ceramic Studio:\n\n${lines}\n\n*Total: ₹${total}*\n\nPlease confirm availability and delivery details.`
  )

  return `https://wa.me/${WA}?text=${msg}`
}
