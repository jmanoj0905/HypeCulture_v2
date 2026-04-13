import client from './client'

export interface User {
  userId: number
  username: string
  email: string
  role: 'customer' | 'seller' | 'admin'
  status: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const login = (payload: LoginPayload) =>
  client.post<{ success: boolean; data: User; error?: string }>('/auth/login', payload)

export const logout = () =>
  client.post('/auth/logout')

export const getSession = () =>
  client.get<{ success: boolean; data: User }>('/auth/me')
