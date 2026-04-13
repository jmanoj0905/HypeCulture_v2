import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProductCard } from '@components/cards/ProductCard'
import { NeonDivider } from '@components/ui/NeonDivider'
import { Spinner } from '@components/ui/Spinner'
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

type SortKey = 'price_asc' | 'price_desc' | 'newest'

const SORT_LABELS: Record<SortKey, string> = {
  price_asc: 'Price: Low → High',
  price_desc: 'Price: High → Low',
  newest: 'Newest',
}

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products]
  if (sort === 'price_asc') return copy.sort((a, b) => (a.lowestPrice ?? 0) - (b.lowestPrice ?? 0))
  if (sort === 'price_desc') return copy.sort((a, b) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0))
  return copy.sort((a, b) => b.productId - a.productId)
}

const PAGE_SIZE = 8

export function BrowsePage() {
  const { categoryId } = useParams<{ categoryId?: string }>()
  const initialCat = categoryId ? Number(categoryId) : 0

  const [selectedCat, setSelectedCat] = useState(initialCat)
  const [sort, setSort] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)
  const [loading] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Stagger cards on scroll
  useGSAP(() => {
    if (!gridRef.current) return
    gsap.from(gridRef.current.querySelectorAll('.product-card'), {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 85%',
        once: true,
      },
    })
  }, { scope: gridRef, dependencies: [selectedCat, sort, page] })

  // Re-trigger stagger when filters change
  useEffect(() => {
    if (!gridRef.current) return
    gsap.from(gridRef.current.querySelectorAll('.product-card'), {
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.06,
    })
  }, [selectedCat, sort, page])

  const filtered = selectedCat === 0
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.categoryId === selectedCat)

  const sorted = sortProducts(filtered, sort)
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleCatChange = (id: number) => {
    setSelectedCat(id)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-void pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <h1 className="font-display text-7xl text-white tracking-wider">
          BROWSE<span className="text-neon-green">.</span>
        </h1>
        <NeonDivider className="mt-3 mb-8" />

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleCatChange(0)}
            className={`font-heading text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-200
              ${selectedCat === 0
                ? 'bg-neon-green text-void border-neon-green'
                : 'bg-transparent text-dust border-smoke hover:border-neon-green hover:text-neon-green'
              }`}
          >
            All
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => handleCatChange(cat.categoryId)}
              className={`font-heading text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-200
                ${selectedCat === cat.categoryId
                  ? 'bg-neon-green text-void border-neon-green'
                  : 'bg-transparent text-dust border-smoke hover:border-neon-green hover:text-neon-green'
                }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-xs text-smoke uppercase tracking-wider">Sort:</span>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`font-mono text-xs uppercase tracking-wider transition-colors duration-200
                ${sort === key ? 'text-neon-green' : 'text-dust hover:text-chalk'}`}
            >
              {SORT_LABELS[key]}
            </button>
          ))}

          <span className="ml-auto font-mono text-xs text-smoke">
            {filtered.length} results
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : paged.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-5xl text-smoke/40">NO DROPS</p>
            <p className="font-body text-dust mt-3">Nothing here yet. Check back soon.</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paged.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="font-mono text-sm text-dust hover:text-neon-green disabled:opacity-30 transition-colors px-2"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`font-mono text-sm w-8 h-8 border transition-all duration-200
                  ${p === page
                    ? 'border-neon-green text-neon-green'
                    : 'border-smoke text-dust hover:border-neon-green hover:text-neon-green'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="font-mono text-sm text-dust hover:text-neon-green disabled:opacity-30 transition-colors px-2"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
