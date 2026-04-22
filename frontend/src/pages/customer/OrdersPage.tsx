import { useEffect, useState } from 'react'
import { OrderCard } from '@components/cards/OrderCard'
import { NeonDivider } from '@components/ui/NeonDivider'
import { Spinner } from '@components/ui/Spinner'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { getOrders, type Order } from '@api/orders'

// Mock orders shown when backend is unavailable
const MOCK_ORDERS: Order[] = [
  {
    orderId: 1001,
    date: '2024-12-01T10:30:00Z',
    status: 'Delivered',
    totalAmount: 309,
    shippingAddress: '123 Street Rd, Brooklyn, NY 11201',
    paymentMethod: 'Credit Card',
    items: [
      { orderItemId: 1, shoeName: 'Air Jordan 1 Retro High OG', sellerName: 'KicksVault', size: '10', quantity: 1, priceAtPurchase: 189 },
      { orderItemId: 2, shoeName: 'Dunk Low Panda', sellerName: 'SoleMate', size: '10', quantity: 1, priceAtPurchase: 120 },
    ],
  },
  {
    orderId: 1002,
    date: '2025-01-15T14:00:00Z',
    status: 'Shipped',
    totalAmount: 230,
    shippingAddress: '456 Neon Ave, Brooklyn, NY 11201',
    paymentMethod: 'UPI',
    items: [
      { orderItemId: 3, shoeName: 'Yeezy Boost 350 V2', sellerName: 'HypeDrop', size: '10.5', quantity: 1, priceAtPurchase: 230 },
    ],
  },
  {
    orderId: 1003,
    date: '2025-02-20T09:00:00Z',
    status: 'Placed',
    totalAmount: 110,
    shippingAddress: '789 Asphalt Blvd, Brooklyn, NY 11201',
    paymentMethod: 'Cash on Delivery',
    items: [
      { orderItemId: 4, shoeName: 'New Balance 550', sellerName: 'UrbanKicks', size: '9', quantity: 1, priceAtPurchase: 110 },
    ],
  },
]

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then((res) => {
        if (res.data.success) setOrders(res.data.data)
        else setOrders(MOCK_ORDERS)
      })
      .catch(() => setOrders(MOCK_ORDERS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-void pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-display text-7xl text-white tracking-wider">
          ORDERS<span className="text-neon-green">.</span>
        </h1>
        <NeonDivider className="mt-3 mb-8" />

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-6xl text-smoke/30 tracking-wider">NO ORDERS</p>
            <p className="font-body text-dust mt-4 mb-8">You haven&apos;t placed any orders yet.</p>
            <TransitionLink
              to="/browse"
              className="inline-block font-heading text-sm uppercase tracking-widest px-8 py-3
                         bg-neon-green text-void border border-neon-green
                         hover:bg-transparent hover:text-neon-green transition-all duration-300"
            >
              Start Shopping
            </TransitionLink>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
