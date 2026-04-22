import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { getCart, addToCart as apiAdd, removeCartItem as apiRemove, type CartData, type CartItem } from '@api/cart'
import { cartSubject } from '@observer/Subject'

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
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const listenersRef = useRef<Set<(evt: CartAddEvent) => void>>(new Set())

  const syncCart = useCallback((cartData: CartData) => {
    const cart = cartData.cart
    setItems(cart?.items ?? [])
    const sub = cart?.items?.reduce((sum, item) => sum + (item.listing.price * item.quantity), 0) ?? 0
    setSubtotal(sub)
  }, [])

  const notifyCartChange = useCallback((newItems: CartItem[], newSubtotal: number) => {
    const count = newItems.reduce((sum, item) => sum + item.quantity, 0)
    cartSubject.notify({ itemCount: count, subtotal: newSubtotal })
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res: any = await getCart()
      if (res.success) {
        syncCart(res.data)
        const cart = res.data?.cart
        const sub = cart?.items?.reduce((sum: number, item: any) => sum + (item.listing.price * item.quantity), 0) ?? 0
        notifyCartChange(cart?.items ?? [], sub)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [syncCart, notifyCartChange])

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
    console.log('addToCart called:', listingId, quantity)
    try {
      const res: any = await apiAdd(listingId, quantity)
      console.log('addToCart response:', res)
      if (res.success) {
        await refresh()
        if (meta) {
          for (const cb of listenersRef.current) cb(meta)
        }
      }
    } catch (error) {
      console.error('Add to cart failed:', error)
    }
  }, [refresh, notifyCartChange])

  const removeFromCart = useCallback(async (cartItemId: number) => {
    const res: any = await apiRemove(cartItemId)
    if (res.success) {
      await refresh()
    }
  }, [refresh])

  const updateQuantity = useCallback(async (_cartItemId: number, _quantity: number) => {
    // Backend may not support this yet - silently skip
  }, [])

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
