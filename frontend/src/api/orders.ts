import client from './client'

export interface OrderItem {
  orderItemId: number
  shoeName: string
  sellerName: string
  size: string
  quantity: number
  priceAtPurchase: number
}

export interface Order {
  orderId: number
  customerId: number
  createdAt: string
  items: OrderItem[]
  totalAmount: number
  status: 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  paymentMethod: 'CREDIT_CARD' | 'UPI' | 'CASH_ON_DELIVERY'
}

export interface CheckoutPayload {
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  paymentMethod: 'CREDIT_CARD' | 'UPI' | 'CASH_ON_DELIVERY'
}

export const checkout = (payload: CheckoutPayload) =>
  client.post<{ success: boolean; data: Order }>('/orders', payload)

export const getOrders = () =>
  client.get<{ success: boolean; data: Order[] }>('/orders')

export const getOrderDetails = (orderId: number) =>
  client.get<{ success: boolean; data: Order }>(`/orders/${orderId}`)

export const cancelOrder = (orderId: number) =>
  client.put<{ success: boolean }>(`/orders/${orderId}/cancel`)
