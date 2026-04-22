import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@components/ui/Card'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { createListing } from '@api/listings'
import { getProducts, type Product } from '@api/products'

type Condition = 'NEW' | 'USED'

interface FormData {
  productId: number
  size: number
  condition: Condition
  price: number
  stockQuantity: number
}

export function NewListingPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    productId: 0,
    size: 0,
    condition: 'NEW',
    price: 0,
    stockQuantity: 0,
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProducts({})
      .then((res) => {
        if (res.data.success) setProducts(res.data.data)
      })
      .catch(() => {})
  }, [])

  const handleChange = (field: keyof FormData) => (e: { target: { value: string } }) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'condition' ? value : Number(value),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createListing({
        productId: formData.productId,
        size: formData.size,
        condition: formData.condition,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        description: '',
      })
      navigate('/seller/inventory')
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-8">New Listing</h1>
      <Card>
        <Card.Body>
          <Card.Title className="mb-6">Create New Listing</Card.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-sm uppercase tracking-wider text-dust">
                Product
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData((prev) => ({ ...prev, productId: Number(e.target.value) }))}
                className="bg-transparent border-b-2 border-smoke px-0 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green"
                required
              >
                <option value={0} className="bg-void">Select product</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.productId} className="bg-void">
                    {p.shoeName} — {p.brand}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Size"
              type="number"
              min={1}
              step={0.5}
              value={formData.size || ''}
              onChange={handleChange('size')}
              placeholder="e.g., 10.5"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-sm uppercase tracking-wider text-dust">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData((prev) => ({ ...prev, condition: e.target.value as Condition }))}
                className="bg-transparent border-b-2 border-smoke px-0 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green"
              >
                <option value="NEW" className="bg-void">New</option>
                <option value="USED" className="bg-void">Used</option>
              </select>
            </div>
            <Input
              label="Price"
              type="number"
              min={1}
              step={0.01}
              value={formData.price || ''}
              onChange={handleChange('price')}
              placeholder="Enter price"
              required
            />
            <Input
              label="Stock Quantity"
              type="number"
              min={1}
              value={formData.stockQuantity || ''}
              onChange={handleChange('stockQuantity')}
              placeholder="Enter stock quantity"
              required
            />
            {error && <p className="text-danger font-mono text-sm">{error}</p>}
            <Button type="submit" loading={loading} className="mt-2">
              Create Listing
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}
