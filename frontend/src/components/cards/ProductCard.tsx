import angularMask from '@assets/masks/angular-cut.svg'
import { PriceTag } from '@components/ui/PriceTag'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { TiltCard } from '@components/interactive/TiltCard'
import { HoverAberration } from '@components/interactive/HoverAberration'
import type { Product } from '@api/products'
import { resolveImageUrl } from '@lib/imageUtils'

const ACCENTS = ['#39ff14', '#ff2d7b', '#00f0ff', '#f0ff00'] as const

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const accent = ACCENTS[product.productId % ACCENTS.length]

  return (
    <HoverAberration intensity={1.5}>
      <TiltCard max={6} scale={1.02} className={`product-card group block ${className}`}>
        <TransitionLink
          to={`/product/${product.productId}`}
          className="block"
          data-cursor="view"
        >
          {/* Image area — mask-clipped */}
          <div
            className="relative overflow-hidden bg-asphalt"
            style={{
              maskImage: `url(${angularMask})`,
              WebkitMaskImage: `url(${angularMask})`,
              maskSize: 'cover',
              WebkitMaskSize: 'cover',
            }}
          >
            <div
              className="h-72 bg-concrete flex items-center justify-center
                         transition-transform duration-700 ease-[var(--ease-out-expo)]
                         group-hover:scale-[1.03]"
            >
              {product.imageUrl ? (
                <img
                  src={resolveImageUrl(product.imageUrl)}
                  alt={product.shoeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-display text-8xl select-none leading-none"
                  style={{ color: accent, opacity: 0.25 }}
                >
                  {product.brand.charAt(0)}
                </span>
              )}
            </div>

            {/* Clip-path reveal overlay — ellipse expands up from bottom on hover */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3
                         bg-void/92 pointer-events-none
                         transition-[clip-path] duration-500 ease-[var(--ease-out-expo)]
                         [clip-path:ellipse(0%_0%_at_50%_100%)]
                         group-hover:[clip-path:ellipse(160%_160%_at_50%_100%)]"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-dust">
                {product.brand}
              </span>
              <span
                className="font-heading text-xs uppercase tracking-widest"
                style={{ color: accent }}
              >
                View Details &rarr;
              </span>
              {product.listingCount !== undefined && (
                <span className="font-mono text-xs text-smoke">
                  {product.listingCount} {product.listingCount === 1 ? 'seller' : 'sellers'}
                </span>
              )}
            </div>

            {/* Inset neon glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100
                         transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: `inset 0 0 50px ${accent}18` }}
            />
          </div>

          {/* Info row */}
          <div className="mt-3 px-1 flex items-end justify-between">
            <div className="min-w-0 flex-1 mr-3">
              <p className="font-mono text-xs text-dust uppercase tracking-wider truncate">
                {product.brand}
              </p>
              <h3 className="font-heading text-sm text-chalk mt-0.5 leading-tight line-clamp-1">
                {product.shoeName}
              </h3>
            </div>

            {/* Price tag — always visible */}
            <div className="flex-shrink-0">
              {product.lowestPrice !== undefined && (
                <PriceTag amount={product.lowestPrice} size="sm" />
              )}
            </div>
          </div>
        </TransitionLink>
      </TiltCard>
    </HoverAberration>
  )
}