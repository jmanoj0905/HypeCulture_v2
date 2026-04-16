import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProductCard } from '@components/cards/ProductCard'
import { NeonDivider } from '@components/ui/NeonDivider'
import { Spinner } from '@components/ui/Spinner'
import { MagneticButton } from '@components/interactive/MagneticButton'
import type { Category, Product } from '@api/products'

gsap.registerPlugin(ScrollTrigger)

// --- Mock data (replace with API when backend is ready) ---
const MOCK_CATEGORIES: Category[] = [
  { categoryId: 1, categoryName: 'Sneakers', description: 'Jordan, Dunk, Air Max' },
  { categoryId: 2, categoryName: 'Boots', description: 'Timberland, Dr. Martens' },
  { categoryId: 3, categoryName: 'Running', description: 'Ultra Boost, Gel-Kayano' },
  { categoryId: 4, categoryName: 'Casual', description: 'Vans, Converse, NB 550' },
]

const MOCK_PRODUCTS: Product[] = [
  { productId: 1, shoeName: 'Air Jordan 1 Retro High OG', brand: 'Nike', model: 'AJ1', categoryId: 1, imageUrl: '/images/products/1-air-jordan-1.jpg', description: '', lowestPrice: 189, listingCount: 12 },
  { productId: 2, shoeName: 'Yeezy Boost 350 V2', brand: 'Adidas', model: 'Yeezy 350', categoryId: 1, imageUrl: '/images/products/2-yeezy-350.jpg', description: '', lowestPrice: 230, listingCount: 8 },
  { productId: 3, shoeName: 'Dunk Low Panda', brand: 'Nike', model: 'Dunk Low', categoryId: 1, imageUrl: '/images/products/3-dunk-low-panda.jpg', description: '', lowestPrice: 120, listingCount: 15 },
  { productId: 4, shoeName: 'New Balance 550', brand: 'New Balance', model: '550', categoryId: 4, imageUrl: '/images/products/4-nb-550.jpg', description: '', lowestPrice: 110, listingCount: 6 },
  { productId: 5, shoeName: 'Air Force 1 Low', brand: 'Nike', model: 'AF1', categoryId: 1, imageUrl: '/images/products/5-air-force-1.jpg', description: '', lowestPrice: 100, listingCount: 20 },
  { productId: 6, shoeName: 'Chuck Taylor All Star', brand: 'Converse', model: 'Chuck Taylor', categoryId: 4, imageUrl: '/images/products/6-chuck-taylor.jpg', description: '', lowestPrice: 65, listingCount: 11 },
  { productId: 7, shoeName: '6-Inch Premium Boot', brand: 'Timberland', model: '6-Inch', categoryId: 2, imageUrl: '/images/products/7-timberland-6inch.jpg', description: '', lowestPrice: 198, listingCount: 4 },
  { productId: 8, shoeName: 'Ultra Boost 22', brand: 'Adidas', model: 'Ultra Boost', categoryId: 3, imageUrl: '/images/products/8-ultra-boost.jpg', description: '', lowestPrice: 155, listingCount: 7 },
  { productId: 9, shoeName: 'Old Skool', brand: 'Vans', model: 'Old Skool', categoryId: 4, imageUrl: '/images/products/9-vans-old-skool.jpg', description: '', lowestPrice: 75, listingCount: 14 },
  { productId: 10, shoeName: 'Air Max 90', brand: 'Nike', model: 'Air Max 90', categoryId: 1, imageUrl: '/images/products/10-air-max-90.jpg', description: '', lowestPrice: 145, listingCount: 9 },
  { productId: 11, shoeName: '1460 Pascal', brand: 'Dr. Martens', model: '1460 Pascal', categoryId: 2, imageUrl: '/images/products/11-dr-martens-1460.jpg', description: '', lowestPrice: 170, listingCount: 3 },
  { productId: 12, shoeName: 'Gel-Kayano 29', brand: 'ASICS', model: 'Gel-Kayano', categoryId: 3, imageUrl: '/images/products/12-asics-gel-kayano.jpg', description: '', lowestPrice: 135, listingCount: 5 },
]

function CategoryPill({ category, active, onClick }: { category: { categoryId: number; categoryName: string }; active: boolean; onClick: () => void }) {
  return (
    <MagneticButton as="div" strength={0.3} radius={80}>
      <button
        onClick={onClick}
        className={`font-heading text-xs uppercase tracking-widest px-5 py-2.5 border transition-all duration-200
          ${active
            ? 'bg-neon-green text-void border-neon-green'
            : 'bg-transparent text-dust border-smoke hover:border-neon-green hover:text-neon-green'
          }`}
      >
        {category.categoryName}
      </button>
    </MagneticButton>
  )
}

function SortOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <MagneticButton as="div" strength={0.2} radius={60}>
      <button
        onClick={onClick}
        className={`font-mono text-xs uppercase tracking-wider transition-colors duration-200
          ${active ? 'text-neon-green' : 'text-dust hover:text-chalk'}`}
      >
        {label}
      </button>
    </MagneticButton>
  )
}

function MasonryGrid({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.querySelectorAll('.masonry-item')
    
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      },
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {products.map((product, i) => (
        <div
          key={product.productId}
          className="masonry-item break-inside-avoid"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

type SortKey = 'price_asc' | 'price_desc' | 'newest'

const SORT_LABELS: Record<SortKey, string> = {
  price_asc: 'Price ↑',
  price_desc: 'Price ↓',
  newest: 'Newest',
}

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products]
  if (sort === 'price_asc') return copy.sort((a, b) => (a.lowestPrice ?? 0) - (b.lowestPrice ?? 0))
  if (sort === 'price_desc') return copy.sort((a, b) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0))
  return copy.sort((a, b) => b.productId - a.productId)
}

const PAGE_SIZE = 12

export function BrowsePage() {
  const { categoryId } = useParams<{ categoryId?: string }>()
  const initialCat = categoryId ? Number(categoryId) : 0

  const [selectedCat, setSelectedCat] = useState(initialCat)
  const [sort, setSort] = useState<SortKey>('newest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = selectedCat === 0
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.categoryId === selectedCat)

  const sorted = sortProducts(filtered, sort)
  const hasMore = visibleCount < sorted.length

  const handleCatChange = (id: number) => {
    setSelectedCat(id)
    setVisibleCount(PAGE_SIZE)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const loadMore = () => {
    setLoading(true)
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, sorted.length))
      setLoading(false)
    }, 400)
  }

  const paged = sorted.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-void">
      {/* Hero header */}
      <section className="pt-8 pb-6">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
          <h1 className="font-display text-6xl lg:text-8xl text-white tracking-tighter">
            BROWSE
            <span className="text-neon-green">.</span>
          </h1>
          
          {/* Filter bar */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <MagneticButton as="div" strength={0.3} radius={80}>
                <button
                  onClick={() => handleCatChange(0)}
                  className={`font-heading text-xs uppercase tracking-widest px-5 py-2.5 border transition-all duration-200
                    ${selectedCat === 0
                      ? 'bg-neon-green text-void border-neon-green'
                      : 'bg-transparent text-dust border-smoke hover:border-neon-green hover:text-neon-green'
                    }`}
                >
                  All
                </button>
              </MagneticButton>
              {MOCK_CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat.categoryId}
                  category={cat}
                  active={selectedCat === cat.categoryId}
                  onClick={() => handleCatChange(cat.categoryId)}
                />
              ))}
            </div>

            {/* Sort + count */}
            <div className="flex items-center gap-4 lg:ml-auto">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-smoke uppercase tracking-wider">Sort</span>
                {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                  <SortOption
                    key={key}
                    label={SORT_LABELS[key]}
                    active={sort === key}
                    onClick={() => setSort(key)}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-smoke">
                {filtered.length} items
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="pb-24">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
          {paged.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-5xl text-smoke/40">NO DROPS</p>
              <p className="font-body text-dust mt-3">Nothing here yet. Check back soon.</p>
            </div>
          ) : (
            <>
              <MasonryGrid products={paged} />
              
              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <MagneticButton as="div" strength={0.4}>
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-8 py-3 border border-smoke text-dust font-heading text-xs uppercase tracking-widest hover:border-neon-green hover:text-neon-green transition-all duration-200"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </MagneticButton>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
