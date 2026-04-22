import { useState, type FormEvent } from 'react'
import { Card } from '@components/ui/Card'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { createListing } from '@api/listings'

type Condition = 'NEW' | 'USED'

interface FormData {
  productId: number
  size: number
  condition: Condition
  price: number
  stockQuantity: number
}

export function NewListingPage() {
  const [formData, setFormData] = useState<FormData>({
    productId: 0,
    size: 0,
    condition: 'NEW',
    price: 0,
    stockQuantity: 0,
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleChange = (field: keyof FormData) => (e: { target: { value: string | number } }) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'condition' ? value : Number(value),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      await createListing({
        productId: formData.productId,
        size: String(formData.size),
        condition: formData.condition === 'NEW' ? 'New' : 'Used',
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        description: '',
      })
      setStatus({ type: 'success', message: 'Listing created successfully!' })
      setFormData({ productId: 0, size: 0, condition: 'NEW', price: 0, stockQuantity: 0 })
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to create listing. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="font-display text-5xl text-white mb-8">New Listing</h1>
      <Card>
        <Card.Body>
          <Card.Title className="mb-6">Create New Listing</Card.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Product ID"
              type="number"
              min={1}
              value={formData.productId || ''}
              onChange={handleChange('productId')}
              placeholder="Enter product ID"
              required
            />
            <Input
              label="Size"
              type="number"
              min={1}
              step={0.5}
              value={formData.size || ''}
              onChange={handleChange('size')}
              placeholder="Enter size"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="condition" className="font-heading text-sm uppercase tracking-wider text-dust">
                Condition
              </label>
              <select
                id="condition"
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
            {status && (
              <div className={`font-body ${status.type === 'success' ? 'text-success' : 'text-danger'}`}>
                {status.message}
              </div>
            )}
            <Button type="submit" loading={loading} className="mt-2">
              Create Listing
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}
