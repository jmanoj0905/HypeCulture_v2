import { Badge } from '@components/ui/Badge'
import { Button } from '@components/ui/Button'
import { PriceTag } from '@components/ui/PriceTag'
import type { Listing } from '@api/products'

interface SellerOfferCardProps {
  listing: Listing
  onAddToCart: (listingId: number) => void
  loading?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="font-mono text-xs text-dust">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      {' '}{rating.toFixed(1)}
    </span>
  )
}

export function SellerOfferCard({ listing, onAddToCart, loading = false }: SellerOfferCardProps) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 border-b border-smoke/50
                 hover:bg-asphalt/60 transition-colors duration-200
                 group"
    >
      {/* Left accent bar on hover */}
      <div className="w-0.5 h-10 bg-neon-green/0 group-hover:bg-neon-green/60 transition-colors duration-300 flex-shrink-0" />

      {/* Seller info */}
      <div className="flex-1 min-w-0">
        <p className="font-heading text-sm text-chalk truncate">{listing.seller.username}</p>
        <StarRating rating={listing.seller.sellerRating} />
      </div>

      {/* Size + condition */}
      <div className="text-center flex-shrink-0">
        <p className="font-mono text-sm text-white">US {listing.size}</p>
        <Badge variant={listing.condition === 'NEW' ? 'green' : 'neutral'} className="mt-0.5">
          {listing.condition === 'NEW' ? 'New' : 'Used'}
        </Badge>
      </div>

      {/* Stock */}
      <div className="text-center flex-shrink-0 hidden sm:block">
        <p className="font-mono text-xs text-dust">Stock</p>
        <p className="font-mono text-sm text-chalk">{listing.stockQuantity}</p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0">
        <PriceTag amount={listing.price} size="md" />
      </div>

      {/* Add to cart */}
      <Button
        variant="secondary"
        size="sm"
        loading={loading}
        onClick={() => onAddToCart(listing.listingId)}
        className="flex-shrink-0"
      >
        Add
      </Button>
    </div>
  )
}
