import { CakeSlice, Coffee, Cookie, CupSoda, Sandwich } from 'lucide-react'

const icons = {
  Kopi: Coffee,
  'Non-Kopi': CupSoda,
  Makanan: Sandwich,
  Snack: Cookie,
  Dessert: CakeSlice,
}

export default function MenuIcon({ category, size = 28, className = '' }) {
  const Icon = icons[category] ?? Coffee
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={1.6} />
}
