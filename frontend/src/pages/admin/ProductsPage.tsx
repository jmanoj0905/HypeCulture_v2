import { useState, type FormEvent } from 'react'
import { Card } from '@components/ui/Card' // Fixed alias and strict import
import { Input } from '@components/ui/Input' // Fixed alias
import { Button } from '@components/ui/Button' // Fixed alias

interface FormData {
  shoeName: string
  brand: string
  model: string
  categoryId: number
  imageUrl: string
}

const INITIAL_FORM: FormData = {
  shoeName: '',
  brand: '',
  model: '',
  categoryId: 0,
  imageUrl: '',
}

export function ProductsPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field: keyof FormData) => (e: { target: { value: string } }) => {
    const value = field === 'categoryId' ? Number(e.target.value) : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setFormData(INITIAL_FORM)
    }, 1000)
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-xl mx-auto">
      <h1 className="font-display text-5xl text-white mb-8">Add Product</h1>

      <Card>
        <Card.Body> {/* Fixed to use dot-notation */}
          <Card.Title className="mb-6">Add to Master Catalog</Card.Title> {/* Fixed to use dot-notation */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Shoe Name"
              type="text"
              value={formData.shoeName}
              onChange={handleChange('shoeName')}
              placeholder="e.g., Air Jordan 1 Retro High OG"
              required
            />
            <Input
              label="Brand"
              type="text"
              value={formData.brand}
              onChange={handleChange('brand')}
              placeholder="e.g., Jordan"
              required
            />
            <Input
              label="Model"
              type="text"
              value={formData.model}
              onChange={handleChange('model')}
              placeholder="e.g., Retro High"
              required
            />
            <Input
              label="Category ID"
              type="number"
              min={1}
              value={formData.categoryId || ''}
              onChange={handleChange('categoryId')}
              placeholder="e.g., 1"
              required
            />
            <Input
              label="Image URL"
              type="text"
              value={formData.imageUrl}
              onChange={handleChange('imageUrl')}
              placeholder="https://example.com/image.jpg"
            />

            {success && (
              <div className="text-success font-body">
                Product added to master catalog successfully!
              </div>
            )}

            <Button type="submit" loading={loading} className="mt-2">
              Add Product
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}