import { useRef, useState } from 'react'
import gsap from 'gsap'
import { Badge } from '@components/ui/Badge'
import { PriceTag } from '@components/ui/PriceTag'
import { NeonDivider } from '@components/ui/NeonDivider'
import type { Order } from '@api/orders'

type BadgeVariant = 'cyan' | 'yellow' | 'green' | 'danger' | 'neutral'

const STATUS_BADGE: Record<Order['status'], BadgeVariant> = {
  Placed: 'cyan',
  Shipped: 'yellow',
  Delivered: 'green',
  Cancelled: 'danger',
}

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const [open, setOpen] = useState(false)
  const detailRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    if (!detailRef.current) return
    if (open) {
      gsap.to(detailRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => setOpen(false),
      })
    } else {
      setOpen(true)
      gsap.fromTo(
        detailRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
    }
  }

  const date = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="border border-smoke bg-asphalt">
      {/* Header row */}
      <button
        onClick={toggle}
        className="w-full flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4
                   hover:bg-concrete/40 transition-colors duration-200 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-dust uppercase tracking-wider">
            Order #{String(order.orderId).padStart(6, '0')}
          </p>
          <p className="font-heading text-sm text-chalk mt-0.5">{date}</p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <Badge variant={STATUS_BADGE[order.status]}>{order.status}</Badge>
          <PriceTag amount={order.totalAmount} size="sm" />
          <span
            className={`font-mono text-xs text-dust transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Expandable detail */}
      <div
        ref={detailRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        {open && (
          <div className="px-5 pb-5">
            <NeonDivider className="mb-4" />

            {/* Items */}
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.orderItemId} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-concrete flex-shrink-0 flex items-center justify-center">
                    <span className="font-display text-lg text-smoke/60">
                      {item.shoeName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm text-chalk leading-tight line-clamp-1">
                      {item.shoeName}
                    </p>
                    <p className="font-mono text-xs text-dust mt-0.5">
                      Size {item.size} &middot; Qty {item.quantity} &middot; via {item.sellerName}
                    </p>
                  </div>
                  <PriceTag amount={item.priceAtPurchase * item.quantity} size="sm" />
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div className="mt-4 pt-4 border-t border-smoke/40 flex flex-col sm:flex-row gap-4 text-xs font-mono text-dust">
              <div>
                <span className="text-smoke uppercase tracking-wider block mb-0.5">Ship to</span>
                {order.shippingAddress}
              </div>
              <div>
                <span className="text-smoke uppercase tracking-wider block mb-0.5">Payment</span>
                {order.paymentMethod}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
