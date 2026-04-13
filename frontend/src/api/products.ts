import client from './client'

export interface Category {
  categoryId: number
  categoryName: string
  description: string
}

export interface Product {
  productId: number
  shoeName: string
  brand: string
  model: string
  categoryId: number
  imageUrl: string
  description: string
  lowestPrice?: number
  listingCount?: number
}

export interface Listing {
  listingId: number
  product: Product
  seller: { userId: number; username: string; sellerRating: number }
  size: string
  condition: 'New' | 'Used'
  price: number
  stockQuantity: number
  status: string
}

export const getCategories = () =>
  client.get<{ success: boolean; data: Category[] }>('/categories')

export const getProducts = (params: { category?: number; sort?: string; page?: number }) =>
  client.get<{ success: boolean; data: { products: Product[]; totalPages: number; currentPage: number } }>('/products', { params })

export const getProduct = (id: number) =>
  client.get<{ success: boolean; data: Product }>(`/products/${id}`)

export const getListingsForProduct = (productId: number) =>
  client.get<{ success: boolean; data: Listing[] }>(`/products/${productId}/sellers`)

export const searchProducts = (query: string) =>
  client.get<{ success: boolean; data: Product[] }>('/products/search', { params: { q: query } })
