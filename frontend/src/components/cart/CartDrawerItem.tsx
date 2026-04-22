import { lazy, Suspense, useRef } from 'react'
import gsap from 'gsap'
import { useCart } from '@hooks/useCart'
import type { CartItem } from '@api/cart'
import { PriceTag } from '@components/ui/PriceTag'

const MiniSneaker = lazy(() => import('./MiniSneaker').then((m) => ({ default: m.MiniSneaker })))

interface Props {
  item: CartItem
}

export function CartDrawerItem({ item }: Props) {
  const { removeFromCart, updateQuantity } = useCart()
  const rowRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ startX: 0, x: 0, swiping: false })
  const p = item.listing.product

  const onRemove = () => {
    if (!rowRef.current) return
    gsap.to(rowRef.current, {
      x: 300,
      opacity: 0,
      height: 0,
      padding: 0,
      margin: 0,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => { removeFromCart(item.cartItemId) },
    })
  }

  const onTouchStart = (e: React.TouchEvent) => {
    stateRef.current.startX = e.touches[0].clientX
    stateRef.current.swiping = true
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const s = stateRef.current
    if (!s.swiping) return
    const dx = e.touches[0].clientX - s.startX
    if (dx < 0) return
    s.x = dx
    if (rowRef.current) gsap.set(rowRef.current, { x: dx, opacity: 1 - dx / 300 })
  }
  const onTouchEnd = () => {
    const s = stateRef.current
    s.swiping = false
    if (s.x > 100) {
      onRemove()
    } else if (rowRef.current) {
      gsap.to(rowRef.current, { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out' })
    }
    s.x = 0
  }

  return (
    <div
      ref={rowRef}
      className="drawer-item flex gap-4 p-3 bg-void/50 border border-smoke/40 overflow-hidden"
      style={{ willChange: 'transform' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Mini 3D viewer */}
      <div className="w-20 h-20 shrink-0 bg-concrete border border-smoke/30 overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-2xl text-smoke/40">{p.brand?.charAt(0) ?? 'S'}</span>
            </div>
          }
        >
          <MiniSneaker />
        </Suspense>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="font-mono text-[9px] text-dust uppercase tracking-[0.25em]">{p.brand}</p>
          <h3 className="font-heading text-sm text-white uppercase tracking-[0.1em] truncate">{p.shoeName}</h3>
          <p className="font-mono text-[9px] text-dust mt-0.5">
            Size: {item.listing.size} · {item.listing.condition === 'NEW' ? 'New' : 'Used'}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (item.quantity <= 1) onRemove()
                else updateQuantity(item.cartItemId, item.quantity - 1)
              }}
              data-cursor="link"
              className="w-6 h-6 flex items-center justify-center border border-smoke/60 text-dust hover:border-neon-green hover:text-neon-green transition-colors font-mono text-xs"
            >
              −
            </button>
            <span className="font-mono text-xs text-white tabular-nums w-4 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              data-cursor="link"
              className="w-6 h-6 flex items-center justify-center border border-smoke/60 text-dust hover:border-neon-green hover:text-neon-green transition-colors font-mono text-xs"
            >
              +
            </button>
          </div>
          <PriceTag amount={item.listing.price * item.quantity} size="sm" />
        </div>
      </div>

      {/* Remove (desktop) */}
      <button
        onClick={onRemove}
        data-cursor="link"
        className="self-start shrink-0 font-mono text-[10px] text-dust hover:text-danger transition-colors mt-1"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  )
}
