import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { Card } from '@components/ui/Card' // Fixed alias and strict import
import { Input } from '@components/ui/Input' // Fixed alias
import { Button } from '@components/ui/Button' // Fixed alias

interface FormData {
  price: number
  stockQuantity: number
}

const MOCK_LISTING: FormData = {
  price: 250,
  stockQuantity: 2,
}

export function SellerEditListing() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>(MOCK_LISTING)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      console.log('Fetching listing:', id)
    }
  }, [id])

  const handleChange = (field: keyof FormData) => (e: { target: { value: string } }) => {
    const value = Number(e.target.value)
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulating API call since backend is offline
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        navigate('/seller/inventory')
      }, 1500)
    }, 1000)
  }

  const handleCancel = () => {
    navigate('/seller/inventory')
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/seller/inventory" className="text-dust hover:text-chalk transition-colors">
          &larr; Back
        </Link>
        <h1 className="font-display text-4xl text-white">Edit Listing</h1>
      </div>

      <Card>
        <Card.Body> {/* Fixed to use dot-notation */}
          <Card.Title className="mb-6">Update Price & Stock</Card.Title> {/* Fixed to use dot-notation */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              min={0}
              value={formData.stockQuantity || ''}
              onChange={handleChange('stockQuantity')}
              placeholder="Enter stock quantity"
              required
            />

            {success && (
              <div className="text-success font-body">Listing updated successfully!</div>
            )}

            <div className="flex gap-4 mt-2">
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}