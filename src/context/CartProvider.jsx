import { useCallback, useMemo } from 'react'
import CartContext from './CartContext.jsx'
import menuItems from '../data/menu.jsx'
import { useLocalStorage, useLocalStorageReducer } from '../hooks/useLocalStorage.jsx'

const initialInventory = Object.fromEntries(
  menuItems.map(({ id, stock }) => [id, stock]),
)

function isValidInventory(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.values(value).every((stock) => Number.isInteger(stock) && stock >= 0)
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product } = action
      const maxQuantity = action.maxQuantity ?? product.stock
      const quantity = Math.min(Math.max(1, action.quantity ?? 1), maxQuantity)
      if (quantity <= 0) return state
      const existing = state.find((item) => item.id === product.id)
      if (existing) {
        if (existing.quantity >= maxQuantity) return state
        return state.map((item) => item.id === product.id
          ? {
              ...item,
              stock: maxQuantity,
              quantity: Math.min(maxQuantity, item.quantity + quantity),
            }
          : item)
      }
      return [...state, { ...product, stock: maxQuantity, quantity }]
    }
    case 'change-quantity':
      return state
        .map((item) => item.id === action.productId
          ? {
              ...item,
              quantity: Math.min(action.maxQuantity ?? item.stock, item.quantity + action.amount),
            }
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
  const [inventory, setInventory] = useLocalStorage(
    'kopi-senja:inventory',
    initialInventory,
    isValidInventory,
  )

  const availableStocks = useMemo(() => Object.fromEntries(
    menuItems.map((product) => {
      const cartQuantity = items.find((item) => item.id === product.id)?.quantity ?? 0
      return [
        product.id,
        Math.max(0, (inventory[product.id] ?? product.stock) - cartQuantity),
      ]
    }),
  ), [inventory, items])

  const addToCart = useCallback((product, quantity) => {
    const availableStock = availableStocks[product.id] ?? 0
    if (quantity > availableStock || quantity <= 0) return false
    dispatch({
      type: 'add',
      product,
      quantity,
      maxQuantity: inventory[product.id] ?? product.stock,
    })
    return true
  }, [availableStocks, dispatch, inventory])

  const changeQuantity = useCallback((productId, amount) => {
    dispatch({
      type: 'change-quantity',
      productId,
      amount,
      maxQuantity: inventory[productId] ?? items.find((item) => item.id === productId)?.stock,
    })
  }, [dispatch, inventory, items])

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: 'remove', productId })
  }, [dispatch])
  const completePurchase = useCallback(() => {
    setInventory((currentInventory) => {
      const purchasedQuantities = items.reduce((quantities, item) => ({
        ...quantities,
        [item.id]: (quantities[item.id] ?? 0) + item.quantity,
      }), {})

      return Object.fromEntries(menuItems.map((product) => [
        product.id,
        Math.max(
          0,
          (currentInventory[product.id] ?? product.stock)
            - (purchasedQuantities[product.id] ?? 0),
        ),
      ]))
    })
    dispatch({ type: 'clear' })
  }, [dispatch, items, setInventory])
  const value = useMemo(() => ({
    items,
    availableStocks,
    addToCart,
    changeQuantity,
    removeFromCart,
    completePurchase,
  }), [items, availableStocks, addToCart, changeQuantity, removeFromCart, completePurchase])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
