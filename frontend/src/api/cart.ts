import client from './client'
import type { Listing } from './products'

export interface CartItem {
  cartItemId: number
  listing: Listing
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
}

export const getCart = () =>
  client.get<{ success: boolean; data: Cart }>('/cart')

export const addToCart = (listingId: number, quantity: number) =>
  client.post<{ success: boolean; data: Cart }>('/cart', { listingId, quantity })

export const updateCartItem = (cartItemId: number, quantity: number) =>
  client.put<{ success: boolean; data: Cart }>(`/cart/${cartItemId}`, { quantity })

export const removeCartItem = (cartItemId: number) =>
  client.delete<{ success: boolean; data: Cart }>(`/cart/${cartItemId}`)
