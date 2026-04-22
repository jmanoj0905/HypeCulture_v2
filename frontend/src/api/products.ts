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
  category: Category
  imageUrl: string
  description: string
  active: boolean
  createdAt: string
  lowestPrice?: number
  listingCount?: number
}

export interface Seller {
  userId: number
  username: string
  sellerRating: number
}

export interface Listing {
  listingId: number
  product: Product
  seller: Seller
  size: number
  condition: 'NEW' | 'USED'
  price: number
  stockQuantity: number
  status: 'ACTIVE'
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt?: string
}

export const getCategories = () =>
  client.get<{ success: boolean; data: Category[] }>('/categories')

export const getProducts = (params: { categoryId?: number; sort?: string; page?: number }) =>
  client.get<{ success: boolean; data: Product[] }>('/products', { params })

export const getProduct = (id: number) =>
  client.get<{ success: boolean; data: Product }>(`/products/${id}`)

export const getListingsForProduct = (productId: number) =>
  client.get<{ success: boolean; data: Listing[] }>('/listings', { params: { productId } })

export const searchProducts = (query: string) =>
  client.get<{ success: boolean; data: Product[] }>('/products', { params: { search: query } })
