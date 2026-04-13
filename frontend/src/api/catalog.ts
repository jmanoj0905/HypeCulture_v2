import client from './client'
import type { Product } from './products'

export interface AddProductPayload {
  shoeName: string
  brand: string
  model: string
  categoryId: number
  description: string
  imageUrl?: string
}

export const addProduct = (payload: AddProductPayload) =>
  client.post<{ success: boolean; data: Product }>('/admin/catalog', payload)

export const getAdminProducts = (params?: { category?: number; brand?: string }) =>
  client.get<{ success: boolean; data: Product[] }>('/admin/products', { params })
