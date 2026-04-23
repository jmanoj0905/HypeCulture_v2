import { useRef, useState } from 'react'
import gsap from 'gsap'
import { PriceTag } from '@components/ui/PriceTag'
import type { CartItem } from '@api/cart'
import { resolveImageUrl } from '@lib/imageUtils'

interface CartItemCardProps {
  item: CartItem
  onRemove: (cartItemId: number) => Promise<void>
  onQuantityChange: (cartItemId: number, quantity: number) => Promise<void>
}

export function CartItemCard({ item, onRemove, onQuantityChange }: CartItemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [updating, setUpdating] = useState(false)

  const product = item.listing.product
  const qty = item.quantity
  const lineTotal = item.listing.price * qty

  const handleRemove = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      x: 80,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => onRemove(item.cartItemId),
    })
  }

  const handleQty = async (delta: number) => {
    const next = qty + delta
    if (next < 1) return
    setUpdating(true)
    try {
      await onQuantityChange(item.cartItemId, next)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div ref={cardRef} className="flex gap-4 py-5 border-b border-smoke/50">
      {/* Image */}
      <div className="w-20 h-20 bg-concrete flex-shrink-0 flex items-center justify-center">
        {product.imageUrl ? (
          <img src={resolveImageUrl(product.imageUrl)} alt={product.shoeName} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-2xl text-smoke/60">{product.brand.charAt(0)}</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs text-dust uppercase">{product.brand}</p>
        <h4 className="font-heading text-sm text-chalk leading-tight mt-0.5 line-clamp-1">
          {product.shoeName}
        </h4>
        <div className="flex gap-3 mt-1">
          <span className="font-mono text-xs text-dust">Size US {item.listing.size}</span>
          <span className="font-mono text-xs text-dust">{item.listing.condition === 'NEW' ? 'New' : 'Used'}</span>
        </div>

        {/* Quantity stepper */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => handleQty(-1)}
            disabled={qty <= 1 || updating}
            className="w-6 h-6 border border-smoke text-chalk font-mono text-sm
                       hover:border-neon-green hover:text-neon-green
                       disabled:opacity-30 transition-colors duration-200"
          >
            −
          </button>
          <span className="font-mono text-sm text-chalk w-4 text-center">{qty}</span>
          <button
            onClick={() => handleQty(1)}
            disabled={updating}
            className="w-6 h-6 border border-smoke text-chalk font-mono text-sm
                       hover:border-neon-green hover:text-neon-green
                       disabled:opacity-30 transition-colors duration-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Right: price + remove */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <PriceTag amount={lineTotal} size="md" />
        <button
          onClick={handleRemove}
          className="font-mono text-xs text-dust hover:text-danger transition-colors duration-200 mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
