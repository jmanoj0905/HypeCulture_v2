import { useState } from 'react'
import { Link } from 'react-router'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'

interface Product {
  productId: number
  shoeName: string
  brand: string
  model: string
  imageUrl: string
}

const MOCK_PRODUCTS: Product[] = [
  {
    productId: 1,
    shoeName: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    model: 'Retro High OG',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
  },
  {
    productId: 2,
    shoeName: 'Nike Dunk Low',
    brand: 'Nike',
    model: 'Dunk Low',
    imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop'
  },
  {
    productId: 3,
    shoeName: 'Yeezy Boost 350 V2',
    brand: 'Adidas',
    model: 'Yeezy 350',
    imageUrl: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400&h=400&fit=crop'
  }
]

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)

  const handleDelete = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.productId !== productId))
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl text-white">Product Catalog</h1>
        <Link to="/admin/products">
          <Button>Add New Product</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.productId}>
            <Card.Image src={product.imageUrl} alt={product.shoeName} />
            <Card.Body>
              <Card.Title>{product.shoeName}</Card.Title>
              <p className="text-dust">{product.brand} / {product.model}</p>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(product.productId)}
              >
                Delete
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  )
}
