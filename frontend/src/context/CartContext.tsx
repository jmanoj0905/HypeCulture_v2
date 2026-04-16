import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { getCart, addToCart as apiAdd, removeCartItem as apiRemove, updateCartItem as apiUpdate, type Cart, type CartItem } from '@api/cart'
import { useAuth } from '@hooks/useAuth'

export interface CartAddEvent {
  imageUrl: string
  name: string
}

interface CartState {
  items: CartItem[]
  subtotal: number
  count: number
  loading: boolean
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addToCart: (listingId: number, quantity: number, meta?: CartAddEvent) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>
  refresh: () => Promise<void>
  onCartAdd: (cb: (evt: CartAddEvent) => void) => () => void
}

export const CartContext = createContext<CartState>({
  items: [],
  subtotal: 0,
  count: 0,
  loading: false,
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  refresh: async () => {},
  onCartAdd: () => () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const listenersRef = useRef<Set<(evt: CartAddEvent) => void>>(new Set())

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

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const onCartAdd = useCallback((cb: (evt: CartAddEvent) => void) => {
    listenersRef.current.add(cb)
    return () => { listenersRef.current.delete(cb) }
  }, [])

  const addToCart = useCallback(async (listingId: number, quantity: number, meta?: CartAddEvent) => {
    const res = await apiAdd(listingId, quantity)
    if (res.data.success) {
      syncCart(res.data.data)
      if (meta) {
        for (const cb of listenersRef.current) cb(meta)
      }
    }
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
    <CartContext.Provider value={{
      items, subtotal, count, loading, drawerOpen,
      openDrawer, closeDrawer, addToCart, removeFromCart, updateQuantity, refresh, onCartAdd,
    }}>
      {children}
    </CartContext.Provider>
  )
}
