import client from './client'
import type { User } from './auth'

export const getUsers = (params?: { role?: string; search?: string }) =>
  client.get<{ success: boolean; data: User[] }>('/admin/users', { params })

export const deactivateUser = (userId: number) =>
  client.put<{ success: boolean }>(`/admin/users/${userId}/deactivate`)

export const activateUser = (userId: number) =>
  client.put<{ success: boolean }>(`/admin/users/${userId}/activate`)
