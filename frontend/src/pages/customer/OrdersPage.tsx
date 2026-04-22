import { useEffect, useState } from 'react'
import { OrderCard } from '@components/cards/OrderCard'
import { NeonDivider } from '@components/ui/NeonDivider'
import { Spinner } from '@components/ui/Spinner'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { getOrders, type Order } from '@api/orders'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getOrders()
      .then((res) => {
        if (res.data.success) setOrders(res.data.data)
      })
      .catch(() => setError('Failed to load orders'))
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
        ) : error ? (
          <div className="text-center py-32">
            <p className="font-body text-danger">{error}</p>
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
