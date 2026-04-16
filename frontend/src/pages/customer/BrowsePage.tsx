import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getCategories, getProducts, type Product, type Category } from '@api/products'
import { Spinner } from '@components/ui/Spinner'

export function BrowsePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getProducts(),
      getCategories()
    ]).then(([pRes, cRes]) => {
      if (pRes.data.success) setProducts(pRes.data.data)
      if (cRes.data.success) setCategories(cRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.categoryId === selectedCategory)
    : products

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void p-8">
      <h1 className="text-4xl text-neon-green mb-8">BROWSE</h1>
      
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 border text-sm font-mono transition-colors ${
            selectedCategory === null
              ? 'bg-neon-green text-void border-neon-green'
              : 'border-smoke text-chalk hover:border-neon-green'
          }`}
        >
          ALL
        </button>
        {categories.map(cat => (
          <button
            key={cat.categoryId}
            onClick={() => setSelectedCategory(cat.categoryId)}
            className={`px-4 py-2 border text-sm font-mono transition-colors ${
              selectedCategory === cat.categoryId
                ? 'bg-neon-green text-void border-neon-green'
                : 'border-smoke text-chalk hover:border-neon-green'
            }`}
          >
            {cat.categoryName.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="text-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(p => (
          <div
            key={p.productId}
            onClick={() => navigate(`/product/${p.productId}`)}
            className="bg-asphalt p-4 border border-smoke cursor-pointer hover:border-neon-green transition-colors"
          >
            <h2 className="text-lg">{p.shoeName}</h2>
            <p className="text-dust text-sm">{p.brand}</p>
          </div>
        ))}
      </div>
    </div>
  )
}