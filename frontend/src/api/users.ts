import client from './client'
import type { User } from './auth'

export interface CreateUserPayload {
  username: string
  email: string
  phone: string
  password: string
  role: 'customer' | 'seller'
}

export const getUsers = (params?: { role?: string; search?: string; page?: number }) =>
  client.get<{ success: boolean; data: User[] }>('/admin/users', { params })

export const createUser = (payload: CreateUserPayload) =>
  client.post<{ success: boolean; data: User }>('/admin/users', payload)

export const deactivateUser = (userId: number) =>
  client.delete<{ success: boolean }>(`/admin/users/${userId}`)
