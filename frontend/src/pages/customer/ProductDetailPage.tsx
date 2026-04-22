import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SellerOfferCard } from '@components/cards/SellerOfferCard'
import { Badge } from '@components/ui/Badge'
import { NeonDivider } from '@components/ui/NeonDivider'
import { PriceTag } from '@components/ui/PriceTag'
import { Spinner } from '@components/ui/Spinner'
import { MagneticButton } from '@components/interactive/MagneticButton'
import { HoverAberration } from '@components/interactive/HoverAberration'
import { DragGallery } from '@components/interactive/DragGallery'
import { ProductCard } from '@components/cards/ProductCard'
import { useCart } from '@hooks/useCart'
import { getProduct, getListingsForProduct, getProducts, type Product, type Listing } from '@api/products'

gsap.registerPlugin(ScrollTrigger)

const ProductViewer = lazy(() =>
  import('@three/ProductViewer').then((m) => ({ default: m.ProductViewer }))
)

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
        start: 'top 80%',
      },
    })
  }, { scope: containerRef })

  return (
    <h1 ref={containerRef} className="font-display text-6xl lg:text-8xl text-white tracking-tighter leading-[0.9] [perspective:1000px]">
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-4">
          {word.split('').map((char, ci) => (
            <span
              key={ci}
              className="char inline-block [transform-style:preserve-3d]"
              style={{ willChange: 'transform, opacity' }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

function SizePill({ size, active, available, onClick }: { size: number; active: boolean; available: boolean; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    if (!ref.current || active || !available) return
    gsap.to(ref.current, {
      scale: 1.05,
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    return () => { gsap.killTweensOf(ref.current) }
  }, [available])

return (
    <MagneticButton as="div" strength={0.25} radius={60} onClick={onClick}>
      <button
        ref={ref}
        disabled={!available}
        className={`w-14 h-14 font-mono text-sm border transition-all duration-200
          ${active
            ? 'bg-neon-green text-void border-neon-green'
            : available
              ? 'border-smoke text-chalk hover:border-neon-green hover:text-neon-green'
              : 'border-smoke/30 text-smoke/30 cursor-not-allowed line-through'
          }`}
      >
        {size}
      </button>
    </MagneticButton>
  )
}

function FlyToCartButton({ onClick, loading, children }: { onClick: () => void; loading: boolean; children: React.ReactNode }) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const handleClick = () => {
    if (loading) return
    if (!btnRef.current) { onClick(); return }

    const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement
    if (!cartIcon) { onClick(); return }

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
      <MagneticButton as="div">
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

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = Number(productId)

  const [product, setProduct] = useState<Product | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<number | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!id) return
    setLoading(true)

    Promise.all([getProduct(id), getListingsForProduct(id)])
      .then(([pRes, lRes]) => {
        if (pRes.data.success) setProduct(pRes.data.data)
        if (lRes.data.success) setListings(lRes.data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!product) return
    getProducts({ categoryId: product.category?.categoryId })
      .then((res) => {
        if (res.data.success) {
          setRelatedProducts(res.data.data.filter((p) => p.productId !== id).slice(0, 4))
        }
      })
      .catch(() => {})
  }, [product, id])

  const handleAddToCart = async (listingId: number) => {
    setAddingId(listingId)
    try {
      await addToCart(listingId, 1)
    } catch (err) {
      console.error('Add to cart failed:', err)
    } finally {
      setAddingId(null)
    }
  }

  const availableSizes = [...new Set(listings.map((l) => l.size))]
  const filteredListings = selectedSize
    ? listings.filter((l) => l.size === selectedSize)
    : listings
  const sortedListings = [...filteredListings].sort((a, b) => a.price - b.price)

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
          <p className="font-display text-5xl text-smoke/40">NOT FOUND</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void">
      {/* Hero: 3D Viewer + Kinetic Title */}
      <section className="relative pt-8 pb-16">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            {/* Left: 3D Viewer - editorial size */}
            <div className="relative">
              <div className="relative aspect-square lg:aspect-[4/5] bg-concrete overflow-hidden">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-asphalt">
                    <Spinner size="lg" />
                  </div>
                }>
                  <ProductViewer productId={id} />
                </Suspense>

                {/* Corner labels */}
                <div className="absolute top-4 left-4 font-mono text-xs text-dust uppercase tracking-widest">
                  3D View
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-xs text-smoke uppercase tracking-widest">
                  Drag to rotate
                </div>
              </div>

              {/* Brand + model breadcrumb */}
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-8 bg-neon-green" />
                <p className="font-mono text-xs text-dust uppercase tracking-widest">
                  {product.brand} — {product.model}
                </p>
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="lg:sticky lg:top-8">
              {/* Kinetic Title */}
              <KineticTitle>{product.shoeName}</KineticTitle>

              {/* Price block */}
              <div className="mt-6 flex items-baseline gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-dust uppercase">From</span>
                  <PriceTag amount={listings.length > 0 ? Math.min(...listings.map(l => l.price)) : 0} size="xl" />
                </div>
                <Badge variant="outline" className="border-neon-green text-neon-green">
                  {listings.length} listings
                </Badge>
              </div>

              {/* Description */}
              <p className="mt-6 font-body text-dust leading-relaxed max-w-md">
                {product.description}
              </p>

              <NeonDivider className="my-8" />

              {/* Size Selector - Magnetic Pills */}
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
                      Clear selection
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {ALL_SIZES.map((size) => {
                    const available = availableSizes.includes(size)
                    const active = selectedSize === size
                    return (
                      <SizePill
                        key={size}
                        size={size}
                        active={active}
                        available={available}
                        onClick={() => setSelectedSize(active ? null : size)}
                      />
                    )
                  })}
                </div>
              </div>

              <NeonDivider color="pink" className="my-8" />

              {/* Add to Cart - Fly animation */}
              {sortedListings.length > 0 && (
                <div className="space-y-3">
                  <FlyToCartButton
                    loading={addingId === sortedListings[0]!.listingId}
                    onClick={() => handleAddToCart(sortedListings[0]!.listingId)}
                  >
                    Add to Cart — ${sortedListings[0]!.price}
                  </FlyToCartButton>
                  <p className="font-mono text-xs text-dust text-center">
                    US {sortedListings[0]!.size} · {sortedListings[0]!.seller.username} · {sortedListings[0]!.condition}
                  </p>
                </div>
              )}

              {sortedListings.length === 0 && (
                <p className="font-mono text-sm text-smoke">No listings available for this product.</p>
              )}

              {/* All listings toggle */}
              {sortedListings.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-xs text-smoke">
                    {sortedListings.length} seller{sortedListings.length > 1 ? 's' : ''} offering this size
                  </p>
                  <div className="mt-4 border border-smoke/50 bg-asphalt/30">
                    {sortedListings.map((listing) => (
                      <SellerOfferCard
                        key={listing.listingId}
                        listing={listing}
                        onAddToCart={handleAddToCart}
                        loading={addingId === listing.listingId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Offers */}
              {sortedListings.length > 0 && (
                <div className="mt-8">
                  <NeonDivider className="mb-6" />
                  <p className="font-heading text-sm uppercase tracking-widest text-dust mb-4">
                    Seller Offers
                  </p>
                  <div className="border border-smoke/30 divide-y divide-smoke/30">
                    {sortedListings.map((listing) => (
                      <SellerOfferCard
                        key={listing.listingId}
                        listing={listing}
                        onAddToCart={handleAddToCart}
                        loading={addingId === listing.listingId}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products - Drag Gallery */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-smoke/30">
          <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-display text-4xl text-white">Related</h2>
              <div className="h-px flex-1 bg-smoke/30" />
            </div>

            <DragGallery>
              {relatedProducts.map((p) => (
                <div key={p.productId} className="w-72 flex-shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </DragGallery>
          </div>
        </section>
      )}
    </div>
  )
}
