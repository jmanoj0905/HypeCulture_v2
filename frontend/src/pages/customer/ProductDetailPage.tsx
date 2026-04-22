import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HoverAberration } from '@components/interactive/HoverAberration'
import { MagneticButton } from '@components/interactive/MagneticButton'
import { Spinner } from '@components/ui/Spinner'
import { Badge } from '@components/ui/Badge'
import { PriceTag } from '@components/ui/PriceTag'
import { NeonDivider } from '@components/ui/NeonDivider'
import { useCart } from '@hooks/useCart'
import { getProduct, getListingsForProduct, type Product, type Listing } from '@api/products'

gsap.registerPlugin(ScrollTrigger)

const ALL_SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]

function KineticTitle({ children }: { children: string }) {
  const words = children.split(' ')
  const containerRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const chars = containerRef.current.querySelectorAll('.char')
    gsap.from(chars, {
      y: 120,
      opacity: 0,
      rotateX: -90,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.02,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
      },
    })
  }, { scope: containerRef })

  return (
    <h1 ref={containerRef} className="font-display text-5xl lg:text-7xl text-white leading-none">
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-4">
          {word.split('').map((char, ci) => (
            <span key={ci} className="char inline-block" style={{ transform: 'rotateX(-90deg)' }}>
              {char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

function SizePill({ size, active, available, onClick }: { size: number; active: boolean; available: boolean; onClick: () => void }) {
  return (
    <MagneticButton as="div" strength={0.3} radius={40}>
      <button
        onClick={onClick}
        disabled={!available}
        className={`relative w-16 h-16 font-mono text-sm transition-all duration-200 border
          ${active
            ? 'bg-neon-green text-void border-neon-green'
            : available
              ? 'bg-transparent text-dust border-smoke hover:border-neon-green hover:text-neon-green'
              : 'bg-smoke/20 text-smoke/40 border-smoke/30 cursor-not-allowed'
          }`}
      >
        {size}
        {!available && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-10 h-px bg-smoke/50 rotate-45 absolute" />
          </span>
        )}
      </button>
    </MagneticButton>
  )
}

function FlyToCartButton({ onClick, loading, children }: { onClick: () => void; loading: boolean; children: React.ReactNode }) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const handleClick = () => {
    console.log('FlyToCartButton clicked, loading:', loading)
    if (!btnRef.current) {
      console.log('btnRef not ready')
      onClick()
      return
    }

    console.log('playing fly animation')
    const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement
    if (!cartIcon) {
      console.log('no cart icon, calling onClick')
      onClick()
      return
    }

    console.log('playing fly animation')
    const btnRect = btnRef.current.getBoundingClientRect()
    const cartRect = cartIcon.getBoundingClientRect()
    const midX = btnRect.left + btnRect.width / 2
    const midY = btnRect.top + btnRect.height / 2

    const clone = document.createElement('div')
    clone.className = 'fixed w-12 h-12 bg-neon-green rounded-full z-[9999] pointer-events-none'
    clone.style.left = `${midX - 24}px`
    clone.style.top = `${midY - 24}px`
    document.body.appendChild(clone)

    gsap.to(clone, {
      x: cartRect.left + cartRect.width / 2 - midX,
      y: cartRect.top + cartRect.height / 2 - midY,
      scale: 0.2,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.in',
      onComplete: () => { clone.remove() },
    })

    if (textRef.current) {
      gsap.to(textRef.current, { opacity: 0, duration: 0.1, onComplete: () => {
        onClick()
        gsap.to(textRef.current, { opacity: 1, duration: 0.2, delay: 0.5 })
      }})
    }
  }

  return (
    <HoverAberration intensity={2}>
      <MagneticButton as="div" strength={0.4}>
        <button
          ref={btnRef}
          onClick={handleClick}
          disabled={loading}
          className="relative overflow-hidden px-8 py-4 bg-neon-green text-void font-heading text-sm uppercase tracking-widest transition-all duration-300 hover:bg-chalk"
        >
          <span ref={textRef} className="relative z-10">
            {loading ? 'Adding...' : children}
          </span>
        </button>
      </MagneticButton>
    </HoverAberration>
  )
}

const RELATED_PRODUCTS: Product[] = [
]

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = Number(productId)

  const [product, setProduct] = useState<Product | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<number | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!id) return
    setLoading(true)

    Promise.all([getProduct(id), getListingsForProduct(id)])
      .then(([pRes, lRes]) => {
        if (pRes.success) setProduct(pRes.data)
        else setProduct(null)

        if (lRes.success) {
          const rawListings: any[] = lRes.data ?? []
          const transformed = rawListings.map((listing: any) => ({
            listingId: listing.listingId,
            product: listing.product,
            seller: listing.seller,
            size: String(listing.size),
            condition: listing.condition === 'NEW' ? 'New' : 'Used',
            price: Number(listing.price),
            stockQuantity: listing.stockQuantity,
            status: listing.status,
            imageUrl: listing.imageUrl,
            description: listing.description,
            createdAt: listing.createdAt,
            updatedAt: listing.updatedAt,
          }))
          setListings(transformed as any)
        } else {
          setListings([])
        }
      })
      .catch(() => {
        setProduct(null)
        setListings([])
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async (listingId: number) => {
    setAddingId(listingId)
    try {
      await addToCart(listingId, 1)
    } catch (e) {
      console.error('addToCart failed:', e)
    } finally {
      setAddingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-5xl text-smoke">NOT FOUND</h1>
          <p className="mt-4 text-dust">Product not found</p>
        </div>
      </div>
    )
  }

  const sizeMap = new Map(listings.map(l => [l.size, l]))

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Image */}
          <div className="relative aspect-square bg-concrete">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.shoeName}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Right: Details */}
          <div>
            <KineticTitle>{product.shoeName}</KineticTitle>

            {/* Price block */}
            <div className="mt-6 flex items-baseline gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-dust uppercase">From</span>
                <PriceTag amount={listings.length > 0 ? Math.min(...listings.map(l => l.price)) : 0} size="lg" />
              </div>
              <Badge variant="green">
                {listings.length} listings
              </Badge>
            </div>

            {/* Description */}
            <p className="mt-6 font-body text-dust leading-relaxed max-w-md">
              {product.description}
            </p>

            <NeonDivider className="my-8" />

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="font-heading text-xs uppercase tracking-widest text-dust">
                  Select Size
                </p>
                {selectedSize && (
                  <button
                    onClick={() => setSelectedSize(null)}
                    className="font-mono text-xs text-neon-green hover:text-chalk transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {ALL_SIZES.map(size => {
                  const listing = sizeMap.get(String(size))
                  const available = !!(listing && listing.stockQuantity > 0)
                  const active = selectedSize === size

                  return (
                    <SizePill
                      key={size}
                      size={size}
                      active={active}
                      available={available}
                      onClick={() => {
                        if (available) {
                          const newSize = active ? null : size
                          setSelectedSize(newSize)
                        }
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Add to Cart */}
            {selectedSize && (
              <div className="mt-8">
                {(() => {
                  const listing = sizeMap.get(String(selectedSize))
                  if (!listing) return null

                  return (
                    <FlyToCartButton
                      onClick={() => handleAddToCart(listing.listingId)}
                      loading={addingId === listing.listingId}
                    >
                      Add to Cart — ${listing.price}
                    </FlyToCartButton>
                  )
                })()}
              </div>
            )}

            {/* Seller info */}
            <div className="mt-8 pt-8 border-t border-smoke/30">
              <p className="font-heading text-xs uppercase tracking-widest text-dust mb-4">
                Available Sellers
              </p>
              <div className="space-y-3">
                {listings.slice(0, 5).map(listing => (
                  <div key={listing.listingId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-body text-chalk">{listing.seller.username}</span>
                      <span className="font-mono text-xs text-smoke">
                        ★ {listing.seller.sellerRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-dust">Size {listing.size}</span>
                      <PriceTag amount={listing.price} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {RELATED_PRODUCTS.length > 0 && (
          <section className="mt-20">
            <NeonDivider />
            <h2 className="mt-8 font-display text-4xl text-white">
              You May Also Like
            </h2>
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {RELATED_PRODUCTS.map(p => (
                <div key={p.productId} className="aspect-square bg-concrete">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.shoeName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}