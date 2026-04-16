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
import { getProduct, getListingsForProduct, type Product, type Listing } from '@api/products'

gsap.registerPlugin(ScrollTrigger)

const ProductViewer = lazy(() =>
  import('@three/ProductViewer').then((m) => ({ default: m.ProductViewer }))
)

// Mock product data (replace with API when backend is ready)
const MOCK_PRODUCTS: Record<number, Product> = {
  1: { productId: 1, shoeName: 'Air Jordan 1 Retro High OG', brand: 'Nike', model: 'AJ1 High', categoryId: 1, imageUrl: '/images/products/1-air-jordan-1.jpg', description: 'The Air Jordan 1 Retro High OG is a legendary silhouette that defined sneaker culture. Originally released in 1985, this colorway remains one of the most coveted in the game.', lowestPrice: 189, listingCount: 12 },
  2: { productId: 2, shoeName: 'Yeezy Boost 350 V2', brand: 'Adidas', model: 'Yeezy 350', categoryId: 1, imageUrl: '/images/products/2-yeezy-350.jpg', description: 'The Yeezy Boost 350 V2 features a Primeknit upper with Boost cushioning for all-day comfort. A staple silhouette in the hype culture.', lowestPrice: 230, listingCount: 8 },
  3: { productId: 3, shoeName: 'Dunk Low Panda', brand: 'Nike', model: 'Dunk Low', categoryId: 1, imageUrl: '/images/products/3-dunk-low-panda.jpg', description: 'The iconic black and white colorway that broke the internet. Clean, classic, timeless.', lowestPrice: 120, listingCount: 15 },
  4: { productId: 4, shoeName: 'New Balance 550', brand: 'New Balance', model: '550', categoryId: 4, imageUrl: '/images/products/4-nb-550.jpg', description: 'A retro basketball silhouette revived for the modern era. Low-profile with a premium leather upper.', lowestPrice: 110, listingCount: 6 },
  5: { productId: 5, shoeName: 'Air Force 1 Low', brand: 'Nike', model: 'AF1', categoryId: 1, imageUrl: '/images/products/5-air-force-1.jpg', description: "The shoe that launched a thousand colourways. Nike's AF1 Low in all-white — the standard by which all-white sneakers are measured.", lowestPrice: 100, listingCount: 20 },
  6: { productId: 6, shoeName: 'Chuck Taylor All Star', brand: 'Converse', model: 'Chuck Taylor', categoryId: 4, imageUrl: '/images/products/6-chuck-taylor.jpg', description: 'The original sneaker. Canvas upper, vulcanized rubber sole, and a legacy that spans generations.', lowestPrice: 65, listingCount: 11 },
  7: { productId: 7, shoeName: '6-Inch Premium Boot', brand: 'Timberland', model: '6-Inch', categoryId: 2, imageUrl: '/images/products/7-timberland-6inch.jpg', description: 'Iconic wheat nubuck boot built for durability. Waterproof construction, padded collar, and lug sole.', lowestPrice: 198, listingCount: 4 },
  8: { productId: 8, shoeName: 'Ultra Boost 22', brand: 'Adidas', model: 'Ultra Boost', categoryId: 3, imageUrl: '/images/products/8-ultra-boost.jpg', description: 'Responsive Boost midsole meets a sock-like Primeknit upper. The gold standard for performance running with streetwear appeal.', lowestPrice: 155, listingCount: 7 },
  9: { productId: 9, shoeName: 'Old Skool', brand: 'Vans', model: 'Old Skool', categoryId: 4, imageUrl: '/images/products/9-vans-old-skool.jpg', description: "Vans' first style to feature the iconic side stripe. Durable suede and canvas upper with waffle outsole.", lowestPrice: 75, listingCount: 14 },
  10: { productId: 10, shoeName: 'Air Max 90', brand: 'Nike', model: 'Air Max 90', categoryId: 1, imageUrl: '/images/products/10-air-max-90.jpg', description: 'The Air Max 90 remains one of the most beloved silhouettes in Nike history. Bold Max Air unit, overlaid upper, and timeless style.', lowestPrice: 145, listingCount: 9 },
  11: { productId: 11, shoeName: '1460 Pascal', brand: 'Dr. Martens', model: '1460 Pascal', categoryId: 2, imageUrl: '/images/products/11-dr-martens-1460.jpg', description: 'The 1460 Pascal features Virginia leather with a subtle wax finish. 8-eye lace-up with air-cushioned sole for all-day wear.', lowestPrice: 170, listingCount: 3 },
  12: { productId: 12, shoeName: 'Gel-Kayano 29', brand: 'ASICS', model: 'Gel-Kayano', categoryId: 3, imageUrl: '/images/products/12-asics-gel-kayano.jpg', description: 'ASICS flagship stability runner. GEL technology cushioning, FF BLAST+ midsole, and engineered mesh upper for controlled comfort.', lowestPrice: 135, listingCount: 5 },
}

const MOCK_LISTINGS: Listing[] = [
  { listingId: 1, product: MOCK_PRODUCTS[1]!, seller: { userId: 10, username: 'KicksVault', sellerRating: 4.8 }, size: '9', condition: 'New', price: 189, stockQuantity: 3, status: 'Active' },
  { listingId: 2, product: MOCK_PRODUCTS[1]!, seller: { userId: 11, username: 'SoleMate', sellerRating: 4.5 }, size: '9.5', condition: 'New', price: 195, stockQuantity: 1, status: 'Active' },
  { listingId: 3, product: MOCK_PRODUCTS[1]!, seller: { userId: 12, username: 'HypeDrop', sellerRating: 4.2 }, size: '10', condition: 'Used', price: 160, stockQuantity: 1, status: 'Active' },
  { listingId: 4, product: MOCK_PRODUCTS[1]!, seller: { userId: 13, username: 'UrbanKicks', sellerRating: 4.9 }, size: '11', condition: 'New', price: 210, stockQuantity: 2, status: 'Active' },
]

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
              {char === ' ' ? '\u00A0' : char}
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
    <MagneticButton as="div" strength={0.5} radius={100} onClick={onClick}>
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

  const handleClick = (e: React.MouseEvent) => {
    console.log('FlyToCartButton clicked, loading:', loading)
    if (!btnRef.current) {
      console.log('btnRef not ready')
      onClick()
      return
    }
    if (loading) {
      console.log('loading true, skipping animation')
      onClick()
      return
    }
    
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
  MOCK_PRODUCTS[2]!,
  MOCK_PRODUCTS[3]!,
  MOCK_PRODUCTS[5]!,
  MOCK_PRODUCTS[10]!,
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
        if (pRes.data.success) setProduct(pRes.data.data)
        else setProduct(MOCK_PRODUCTS[id] ?? null)

        if (lRes.data.success) {
          const rawListings = lRes.data.data
          const transformed = rawListings.map((listing: any) => ({
            listingId: listing.listingId,
            product: listing.product,
            seller: listing.seller,
            size: String(listing.size),
            condition: listing.condition === 'NEW' ? 'New' : 'Used',
            price: Number(listing.price),
            stockQuantity: listing.stockQuantity,
            status: listing.status,
          }))
          setListings(transformed)
        } else {
          setListings(MOCK_LISTINGS.map((l) => ({ ...l, product: MOCK_PRODUCTS[id] ?? l.product })))
        }
      })
      .catch(() => {
        setProduct(MOCK_PRODUCTS[id] ?? null)
        setListings(MOCK_LISTINGS.map((l) => ({ ...l, product: MOCK_PRODUCTS[id] ?? l.product })))
      })
      .finally(() => setLoading(false))
  }, [id])

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

  const availableSizes = [...new Set(listings.map((l) => String(l.size)))]
  const filteredListings = selectedSize
    ? listings.filter((l) => String(l.size) === String(selectedSize))
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
                    const available = availableSizes.includes(String(size))
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
      <section className="py-16 border-t border-smoke/30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-4xl text-white">Related</h2>
            <div className="h-px flex-1 bg-smoke/30" />
          </div>
          
          <DragGallery>
            {RELATED_PRODUCTS.map((p) => (
              <div key={p.productId} className="w-72 flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </DragGallery>
        </div>
      </section>
    </div>
  )
}
