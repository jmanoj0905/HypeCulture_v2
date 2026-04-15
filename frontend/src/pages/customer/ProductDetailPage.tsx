import { lazy, Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { SellerOfferCard } from '@components/cards/SellerOfferCard'
import { Badge } from '@components/ui/Badge'
import { Button } from '@components/ui/Button'
import { NeonDivider } from '@components/ui/NeonDivider'
import { PriceTag } from '@components/ui/PriceTag'
import { Spinner } from '@components/ui/Spinner'
import { useCart } from '@hooks/useCart'
import { getProduct, getListingsForProduct, type Product, type Listing } from '@api/products'

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

const ALL_SIZES = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = Number(productId)

  const [product, setProduct] = useState<Product | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
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

        if (lRes.data.success) setListings(lRes.data.data)
        else setListings(MOCK_LISTINGS.map((l) => ({ ...l, product: MOCK_PRODUCTS[id] ?? l.product })))
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
    } catch {
      // silently fail — backend not up yet
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
    <div className="min-h-screen bg-void pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left: 3D Viewer */}
          <div className="lg:w-[480px] flex-shrink-0">
            <div className="h-[480px] bg-asphalt border border-smoke">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              }>
                <ProductViewer productId={id} />
              </Suspense>
            </div>
            <p className="font-mono text-xs text-smoke mt-2 text-center">
              Drag to rotate &middot; 3D preview
            </p>
          </div>

          {/* Right: Product info */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <p className="font-mono text-xs text-dust uppercase tracking-wider mb-3">
              {product.brand} &middot; Model {product.model}
            </p>

            {/* Name */}
            <h1 className="font-display text-5xl lg:text-6xl text-white tracking-wider leading-none">
              {product.shoeName}
            </h1>

            {/* Price range */}
            <div className="flex items-center gap-4 mt-4">
              <div>
                <p className="font-mono text-xs text-dust uppercase tracking-wider">From</p>
                {product.lowestPrice !== undefined ? (
                  <PriceTag amount={product.lowestPrice} size="lg" />
                ) : (
                  <span className="font-mono text-dust">—</span>
                )}
              </div>
              {product.listingCount !== undefined && (
                <Badge variant="neutral">
                  {product.listingCount} {product.listingCount === 1 ? 'seller' : 'sellers'}
                </Badge>
              )}
            </div>

            <NeonDivider className="my-6" />

            {/* Description */}
            <p className="font-body text-dust text-sm leading-relaxed max-w-lg">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-heading text-xs uppercase tracking-widest text-dust">
                  Size (US)
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
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((size) => {
                  const available = availableSizes.includes(size)
                  const active = selectedSize === size
                  return (
                    <button
                      key={size}
                      disabled={!available}
                      onClick={() => setSelectedSize(active ? null : size)}
                      className={`w-12 h-10 font-mono text-xs border transition-all duration-200
                        ${active
                          ? 'bg-neon-green text-void border-neon-green'
                          : available
                            ? 'border-smoke text-chalk hover:border-neon-green hover:text-neon-green'
                            : 'border-smoke/30 text-smoke/30 cursor-not-allowed line-through'
                        }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            <NeonDivider color="pink" className="my-6" />

            {/* Seller offers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-xs uppercase tracking-widest text-dust">
                  {selectedSize ? `Offers for US ${selectedSize}` : 'All Offers'} ({sortedListings.length})
                </h3>
                <p className="font-mono text-xs text-smoke">Sorted by lowest price</p>
              </div>

              {sortedListings.length === 0 ? (
                <div className="py-8 text-center border border-smoke/30">
                  <p className="font-mono text-xs text-dust">
                    {selectedSize ? `No listings for size US ${selectedSize}` : 'No listings available'}
                  </p>
                </div>
              ) : (
                <div className="border border-smoke/50">
                  {/* Header */}
                  <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-asphalt border-b border-smoke/50">
                    <div className="w-0.5 flex-shrink-0" />
                    <span className="flex-1 font-mono text-xs text-smoke uppercase tracking-wider">Seller</span>
                    <span className="w-20 text-center font-mono text-xs text-smoke uppercase tracking-wider">Size</span>
                    <span className="w-16 text-center font-mono text-xs text-smoke uppercase tracking-wider hidden sm:block">Stock</span>
                    <span className="w-20 font-mono text-xs text-smoke uppercase tracking-wider">Price</span>
                    <span className="w-16" />
                  </div>
                  {sortedListings.map((listing) => (
                    <SellerOfferCard
                      key={listing.listingId}
                      listing={listing}
                      onAddToCart={handleAddToCart}
                      loading={addingId === listing.listingId}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick add — lowest price listing */}
            {sortedListings.length > 0 && (
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={addingId === sortedListings[0]!.listingId}
                  onClick={() => handleAddToCart(sortedListings[0]!.listingId)}
                >
                  Add Lowest Price to Cart
                </Button>
                <p className="font-mono text-xs text-dust text-center mt-2">
                  US {sortedListings[0]!.size} from {sortedListings[0]!.seller.username}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
