import client from './client'
import type { Listing } from './products'

export interface CreateListingPayload {
  productId: number
  size: number
  condition: 'NEW' | 'USED'
  price: number
  stockQuantity: number
  description: string
}

export const createListing = (payload: CreateListingPayload) =>
  client.post<{ success: boolean; data: Listing }>('/listings', payload)

export const getSellerListings = (sellerId: number) =>
  client.get<{ success: boolean; data: Listing[] }>('/listings', { params: { sellerId } })

export const getListing = (listingId: number) =>
  client.get<{ success: boolean; data: Listing }>(`/listings/${listingId}`)

export const updateListing = (listingId: number, payload: { price: number; stockQuantity: number }) =>
  client.put<{ success: boolean }>(`/listings/${listingId}`, payload)

export const deleteListing = (listingId: number) =>
  client.delete<{ success: boolean }>(`/listings/${listingId}`)
