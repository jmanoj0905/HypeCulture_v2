import client from './client'

export interface RevenueData {
  from: string
  to: string
  revenue: number
}

export const getRevenue = (from: string, to: string) =>
  client.get<{ success: boolean; data: RevenueData }>('/admin/reports/revenue', { params: { from, to } })

export const getTopProducts = (from: string, to: string, limit = 10) =>
  client.get<{ success: boolean; data: any[] }>('/admin/reports/top-products', { params: { from, to, limit } })

export const getAllOrders = (params?: { status?: string }) =>
  client.get('/admin/orders', { params })
