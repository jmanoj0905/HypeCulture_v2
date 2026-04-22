import { CartItemCard } from '@components/cards/CartItemCard'
import { NeonDivider } from '@components/ui/NeonDivider'
import { PriceTag } from '@components/ui/PriceTag'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { useCart } from '@hooks/useCart'

export function CartPage() {
  const { items, subtotal, loading, removeFromCart, updateQuantity } = useCart()

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-7xl text-white tracking-wider">
          YOUR CART<span className="text-neon-green">.</span>
        </h1>
        <NeonDivider className="mt-3 mb-8" />

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-display text-6xl text-smoke/30 tracking-wider">EMPTY</p>
            <p className="font-body text-dust mt-4 mb-8">Your cart has no items yet.</p>
            <TransitionLink
              to="/browse"
              className="inline-block font-heading text-sm uppercase tracking-widest px-8 py-3
                         bg-neon-green text-void border border-neon-green
                         hover:bg-transparent hover:text-neon-green
                         transition-all duration-300"
            >
              Browse Drops
            </TransitionLink>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Items list */}
            <div className="flex-1 min-w-0">
              {items.map((item) => (
                <CartItemCard
                  key={item.cartItemId}
                  item={item}
                  onRemove={removeFromCart}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </div>

            {/* Summary sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-asphalt border border-smoke p-6 sticky top-24">
                <h3 className="font-heading text-sm uppercase tracking-widest text-chalk mb-4">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-dust">
                      Items ({items.length})
                    </span>
                    <PriceTag amount={subtotal} size="sm" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-dust">Shipping</span>
                    <span className="font-mono text-sm text-neon-green">Free</span>
                  </div>
                </div>

                <NeonDivider className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-heading text-sm uppercase tracking-wider text-chalk">Total</span>
                  <PriceTag amount={subtotal} size="lg" />
                </div>

                <TransitionLink
                  to="/checkout"
                  className="block w-full text-center font-heading text-sm uppercase tracking-widest
                             px-6 py-3 bg-neon-green text-void border border-neon-green
                             hover:bg-transparent hover:text-neon-green transition-all duration-300"
                >
                  Checkout
                </TransitionLink>

                <TransitionLink
                  to="/browse"
                  className="block w-full text-center font-mono text-xs text-dust
                             hover:text-neon-green transition-colors duration-200 mt-4"
                >
                  Continue shopping
                </TransitionLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
