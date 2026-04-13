import client from './client'

export interface ReportParams {
  startDate?: string
  endDate?: string
  category?: number
}

export const getSalesSummary = (params?: ReportParams) =>
  client.get('/admin/reports/sales', { params })

export const getInventoryReport = (params?: ReportParams) =>
  client.get('/admin/reports/inventory', { params })

export const getUserActivity = (params?: ReportParams) =>
  client.get('/admin/reports/users', { params })

export const getSellerPerformance = (params?: ReportParams) =>
  client.get('/admin/reports/sellers', { params })

export const getAllOrders = (params?: ReportParams & { status?: string }) =>
  client.get('/admin/orders', { params })
