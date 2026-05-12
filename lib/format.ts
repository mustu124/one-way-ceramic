export function formatInr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

export function discountPercent(current: number, original: number | null | undefined): number | null {
  if (!original || original <= current || current < 0) return null
  return Math.round(((original - current) / original) * 100)
}

export function priceLabel(value: number): string {
  return value === 0 ? 'Price on Request' : formatInr(value)
}
