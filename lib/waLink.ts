import { BUSINESS } from './constants'
import type { CartItem } from './cart'

const WA = process.env.NEXT_PUBLIC_WA_NUMBER || BUSINESS.whatsapp

function publicImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) return ''
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')

  if (!siteUrl) return imageUrl
  return `${siteUrl.replace(/\/$/, '')}/${imageUrl.replace(/^\//, '')}`
}

export function waEnquiryLink(productName: string, priceInr: number, imageUrl?: string | null): string {
  const price = priceInr > 0 ? ` (${priceInr.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })})` : ''
  const image = publicImageUrl(imageUrl)
  const imageLine = image ? `\nProduct image: ${image}` : ''
  const msg = encodeURIComponent(
    `Hi! I'm interested in *${productName}*${price} from One Way Ceramic Studio.${imageLine}\nCan you share more details?`
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
      const image = publicImageUrl(item.image_url)
      return `- ${item.name} x${item.quantity} - INR ${lineTotal}${image ? `\n  Image: ${image}` : ''}`
    })
    .join('\n')

  const total = items.reduce((sum, item) => sum + item.price_inr * item.quantity, 0).toLocaleString('en-IN')

  const msg = encodeURIComponent(
    `Hi! I'd like to place an order from One Way Ceramic Studio:\n\n${lines}\n\n*Total: INR ${total}*\n\nPlease confirm availability and delivery details.`
  )

  return `https://wa.me/${WA}?text=${msg}`
}
