import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Spinner } from '@components/ui/Spinner'
import { getAdminProducts, deleteProduct } from '@api/catalog'
import type { Product } from '@api/products'

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    getAdminProducts()
      .then((res) => {
        if (res.data.success) setProducts(res.data.data)
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Deactivate this product? It will be hidden from buyers.')) return
    setDeletingId(productId)
    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p.productId !== productId))
    } catch {
      setError('Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-5xl text-white">Product Catalog</h1>
          <p className="text-dust font-mono text-sm mt-1">{products.length} products</p>
        </div>
        <Link to="/admin/products">
          <Button>Add New Product</Button>
        </Link>
      </div>

      {error && <p className="text-danger font-mono text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.productId}>
            {product.imageUrl && <Card.Image src={product.imageUrl} alt={product.shoeName} />}
            <Card.Body>
              <Card.Title>{product.shoeName}</Card.Title>
              <p className="text-dust font-body text-sm mt-1">{product.brand} / {product.model}</p>
              <p className="text-smoke font-mono text-xs mt-1">{product.category?.categoryName}</p>
              {!product.active && (
                <p className="text-danger font-mono text-xs mt-1">INACTIVE</p>
              )}
            </Card.Body>
            <Card.Footer>
              <Button
                variant="danger"
                size="sm"
                loading={deletingId === product.productId}
                onClick={() => handleDelete(product.productId)}
              >
                Deactivate
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  )
}
