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
  client.post<{ success: boolean; data: Product }>('/admin/products', payload)

export const getAdminProducts = () =>
  client.get<{ success: boolean; data: Product[] }>('/admin/products')

export const deleteProduct = (productId: number) =>
  client.delete<{ success: boolean }>(`/admin/products/${productId}`)
