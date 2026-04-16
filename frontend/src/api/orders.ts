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
  date: string
  items: OrderItem[]
  totalAmount: number
  status: 'Placed' | 'Shipped' | 'Delivered' | 'Cancelled'
  shippingAddress: string
  paymentMethod: string
}

export interface CheckoutPayload {
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  paymentMethod: 'CREDIT_CARD' | 'UPI' | 'CASH_ON_DELIVERY'
}

export const checkout = (payload: CheckoutPayload) =>
  client.post<{ success: boolean; data: { orderId: number; estimatedDelivery: string; totalAmount: number } }>('/orders', payload)

export const getOrders = () =>
  client.get<{ success: boolean; data: Order[] }>('/orders')

export const getOrderDetails = (orderId: number) =>
  client.get<{ success: boolean; data: Order }>(`/orders/${orderId}`)
