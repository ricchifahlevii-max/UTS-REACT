export function formatPrice(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function calculateDiscount(subtotal, promoCode) {
  if (promoCode === 'DISKON10') return Math.round(subtotal * 0.1)
  if (promoCode === 'HEMAT50') return Math.min(subtotal, 50000)
  return 0
}

export function calculateServiceFee(subtotal) {
  return Math.round(subtotal * 0.1)
}

export function calculateTotal(subtotal, discount, serviceFee) {
  return Math.max(0, subtotal - discount + serviceFee)
}

export function isValidPromo(promoCode) {
  return promoCode === 'DISKON10' || promoCode === 'HEMAT50'
}
