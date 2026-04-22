import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@components/ui/Card'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { addProduct } from '@api/catalog'
import { getCategories, type Category } from '@api/products'

interface FormData {
  shoeName: string
  brand: string
  model: string
  categoryId: number
  description: string
  imageUrl: string
}

const INITIAL_FORM: FormData = {
  shoeName: '',
  brand: '',
  model: '',
  categoryId: 0,
  description: '',
  imageUrl: '',
}

export function ProductsPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data.success) setCategories(res.data.data)
      })
      .catch(() => {})
  }, [])

  const handleChange = (field: keyof FormData) => (e: { target: { value: string } }) => {
    const value = field === 'categoryId' ? Number(e.target.value) : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await addProduct({
        shoeName: formData.shoeName,
        brand: formData.brand,
        model: formData.model,
        categoryId: formData.categoryId,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
      })
      navigate('/admin/catalog')
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-xl mx-auto">
      <h1 className="font-display text-5xl text-white mb-8">Add Product</h1>

      <Card>
        <Card.Body>
          <Card.Title className="mb-6">Add to Master Catalog</Card.Title>
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
            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-sm uppercase tracking-wider text-dust">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: Number(e.target.value) }))}
                className="bg-transparent border-b-2 border-smoke px-0 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green"
                required
              >
                <option value={0} className="bg-void">Select category</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId} className="bg-void">
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Description"
              type="text"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Brief product description"
            />
            <Input
              label="Image URL"
              type="text"
              value={formData.imageUrl}
              onChange={handleChange('imageUrl')}
              placeholder="https://example.com/image.jpg"
            />

            {error && <p className="text-danger font-mono text-sm">{error}</p>}

            <Button type="submit" loading={loading} className="mt-2">
              Add Product
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}
