import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { getCart, addToCart as apiAdd, removeCartItem as apiRemove, updateCartItem as apiUpdate, type Cart, type CartItem } from '@api/cart'
import { useAuth } from '@hooks/useAuth'

interface CartState {
  items: CartItem[]
  subtotal: number
  count: number
  loading: boolean
  addToCart: (listingId: number, quantity: number) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>
  refresh: () => Promise<void>
}

export const CartContext = createContext<CartState>({
  items: [],
  subtotal: 0,
  count: 0,
  loading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  refresh: async () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const syncCart = useCallback((cart: Cart) => {
    setItems(cart.items)
    setSubtotal(cart.subtotal)
  }, [])

  const refresh = useCallback(async () => {
    if (!user || user.role !== 'customer') return
    setLoading(true)
    try {
      const res = await getCart()
      if (res.data.success) syncCart(res.data.data)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [user, syncCart])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addToCart = useCallback(async (listingId: number, quantity: number) => {
    const res = await apiAdd(listingId, quantity)
    if (res.data.success) syncCart(res.data.data)
  }, [syncCart])

  const removeFromCart = useCallback(async (cartItemId: number) => {
    const res = await apiRemove(cartItemId)
    if (res.data.success) syncCart(res.data.data)
  }, [syncCart])

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    const res = await apiUpdate(cartItemId, quantity)
    if (res.data.success) syncCart(res.data.data)
  }, [syncCart])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, subtotal, count, loading, addToCart, removeFromCart, updateQuantity, refresh }}>
      {children}
    </CartContext.Provider>
  )
}
