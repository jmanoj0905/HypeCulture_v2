import client from './client'
import type { Listing } from './products'

export interface CreateListingPayload {
  productId: number
  size: string
  condition: 'New' | 'Used'
  price: number
  stockQuantity: number
  description: string
}

export const createListing = (payload: CreateListingPayload) =>
  client.post<{ success: boolean; data: Listing }>('/listings', payload)

export const getSellerListings = () =>
  client.get<{ success: boolean; data: Listing[] }>('/seller/listings')

export const updateListing = (listingId: number, payload: { price?: number; stockQuantity?: number }) =>
  client.put<{ success: boolean; data: Listing }>(`/seller/listings/${listingId}`, payload)

export const deleteListing = (listingId: number) =>
  client.delete<{ success: boolean }>(`/seller/listings/${listingId}`)
