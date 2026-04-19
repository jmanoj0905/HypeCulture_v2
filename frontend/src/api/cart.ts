import client from './client'
import type { Listing } from './products'

export interface CartItem {
  cartItemId: number
  listing: Listing
  quantity: number
}

export interface CartData {
  cart: {
    cartId: number
    customerId: number
    createdAt: string
    items: CartItem[]
  }
  itemCount: number
}

export const getCart = () =>
  client.get<{ success: boolean; data: CartData }>('/cart')

export const addToCart = (listingId: number, quantity: number) =>
  client.post<{ success: boolean; data: CartData }>('/cart/items', { listingId, quantity })

export const removeCartItem = (cartItemId: number) =>
  client.delete<{ success: boolean; data: CartData }>(`/cart/items/${cartItemId}`)

export const getCartCount = () =>
  client.get<{ success: boolean; data: { count: number } }>('/cart/count')
