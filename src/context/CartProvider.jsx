import { useCallback, useMemo } from 'react'
import CartContext from './CartContext.jsx'
import menuItems from '../data/menu.jsx'
import { useLocalStorageReducer } from '../hooks/useLocalStorage.jsx'

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product } = action
      const existing = state.find((item) => item.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return state
        return state.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...state, { ...product, quantity: 1 }]
    }
    case 'change-quantity':
      return state
        .map((item) => item.id === action.productId
          ? { ...item, quantity: Math.min(menuItems.find((product) => product.id === action.productId)?.stock ?? item.quantity, item.quantity + action.amount) }
          : item)
        .filter((item) => item.quantity > 0)
    case 'remove':
      return state.filter((item) => item.id !== action.productId)
    case 'clear':
      return []
    default:
      throw new Error(`Aksi keranjang tidak dikenal: ${action.type}`)
  }
}

export default function CartProvider({ children }) {
  const [items, dispatch] = useLocalStorageReducer('kopi-senja:cart', cartReducer, [], Array.isArray)

  const addToCart = useCallback((product) => {
    dispatch({ type: 'add', product })
  }, [dispatch])

  const changeQuantity = useCallback((productId, amount) => {
    dispatch({ type: 'change-quantity', productId, amount })
  }, [dispatch])

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: 'remove', productId })
  }, [dispatch])
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [dispatch])
  const value = useMemo(() => ({ items, addToCart, changeQuantity, removeFromCart, clearCart }), [items, addToCart, changeQuantity, removeFromCart, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
