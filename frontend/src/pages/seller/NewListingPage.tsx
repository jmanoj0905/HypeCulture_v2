import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Spinner } from '@components/ui/Spinner'
import { createProduct, searchProducts, type Product, type Category } from '@api/products'
import { createListing, type CreateListingPayload } from '@api/listings'
import apiFacade from '@api/client'

type Condition = 'NEW' | 'USED'

interface SizeEntry {
  id: string
  size: number
  condition: Condition
  price: number
  stockQuantity: number
  description: string
}

interface ImageEntry {
  id: string
  file: File
  preview: string
}

const DEFAULT_CATEGORIES: Category[] = [
  { categoryId: 1, categoryName: 'Sneakers', description: 'Jordan, Dunk, Air Force 1' },
  { categoryId: 2, categoryName: 'Running', description: 'Ultra Boost, Pegasus, Gel-Kayano' },
  { categoryId: 3, categoryName: 'Basketball', description: 'Jordan, LeBron, Harden' },
  { categoryId: 4, categoryName: 'Boots', description: 'Timberland, Dr. Martens' },
  { categoryId: 5, categoryName: 'Casual', description: 'Vans, Converse, Crocs' },
]

function generateId() {
  return crypto.randomUUID()
}

export function NewListingPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [creatingNew, setCreatingNew] = useState(false)

  const [formData, setFormData] = useState({
    shoeName: '',
    brand: '',
    model: '',
    categoryId: 1,
    description: '',
  })

  const [sizes, setSizes] = useState<SizeEntry[]>([
    { id: generateId(), size: 0, condition: 'NEW', price: 0, stockQuantity: 1, description: '' },
  ])

  const [images, setImages] = useState<ImageEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.length >= 2) {
        setSearching(true)
        searchProducts(searchQuery)
          .then((res) => {
            if (res.data.success) setSearchResults(res.data.data)
          })
          .catch(() => {})
          .finally(() => setSearching(false))
      } else {
        setSearchResults([])
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleChange = (field: string) => (e: { target: { value: string } }) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSizeChange = (id: string, field: keyof SizeEntry) => (e: { target: { value: string } }) => {
    setSizes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: field === 'size' || field === 'price' || field === 'stockQuantity' ? Number(e.target.value) : e.target.value } : s))
    )
  }

  const addSize = () => {
    setSizes((prev) => [
      ...prev,
      { id: generateId(), size: 0, condition: 'NEW', price: 0, stockQuantity: 1, description: '' },
    ])
  }

  const removeSize = (id: string) => {
    if (sizes.length === 1) return
    setSizes((prev) => prev.filter((s) => s.id !== id))
  }

  const handleImageSelect = (e: { target: { files: FileList | null } }) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newImages])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img) URL.revokeObjectURL(img.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let productId = selectedProduct?.productId ?? 0

      let productImageUrl = ''
      if (images.length > 0) {
        const uploadRes = await apiFacade.uploadImage(images[0].file)
        if (uploadRes.data.success) {
          productImageUrl = uploadRes.data.data.imageUrl
        }
      }

      if (!productId) {
        if (!formData.shoeName || !formData.brand) {
          setError('Shoe name and brand are required for new products')
          return
        }

        const prodRes = await createProduct({
          shoeName: formData.shoeName,
          brand: formData.brand,
          model: formData.model,
          categoryId: formData.categoryId,
          description: formData.description,
          imageUrl: productImageUrl,
        })

        if (!prodRes.data.success) {
          setError(prodRes.data.error ?? 'Failed to create product')
          return
        }
        productId = prodRes.data.data.productId
      }

      for (const sizeEntry of sizes) {
        if (sizeEntry.size <= 0 || sizeEntry.price <= 0) continue

        const payload: CreateListingPayload = {
          productId,
          size: sizeEntry.size,
          condition: sizeEntry.condition,
          price: sizeEntry.price,
          stockQuantity: sizeEntry.stockQuantity,
          description: sizeEntry.description,
          imageUrl: productImageUrl || selectedProduct?.imageUrl || '',
        }

        await createListing(payload)
      }

      navigate('/seller/inventory')
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to create listing(s)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-8">New Listing</h1>
      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {!creatingNew ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-sm uppercase tracking-wider text-dust">
                    Search Product
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, brand..."
                    className="bg-transparent border-b-2 border-smoke px-0 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green"
                  />
                  {searching && <Spinner size="sm" />}
                  {searchResults.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
                      {searchResults.map((p) => (
                        <button
                          key={p.productId}
                          type="button"
                          onClick={() => {
                            setSelectedProduct(p)
                            setSearchQuery('')
                            setSearchResults([])
                          }}
                          className="text-left px-3 py-2 bg-void border border-smoke/30 hover:border-neon-green transition-colors text-chalk text-sm"
                        >
                          <span className="font-display">{p.shoeName}</span>{' '}
                          <span className="text-dust">— {p.brand}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setCreatingNew(true)}
                    className="mt-2 text-left text-sm text-neon-green hover:text-chalk transition-colors"
                  >
                    + Create new product instead
                  </button>
                </div>

                {selectedProduct && (
                  <div className="p-4 border border-neon-green/40">
                    <p className="font-display text-xl">{selectedProduct.shoeName}</p>
                    <p className="text-dust text-sm">{selectedProduct.brand}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="mt-2 text-sm text-danger hover:text-chalk"
                    >
                      Change product
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-sm uppercase tracking-wider text-dust">
                    Shoe Name *
                  </label>
                  <input
                    type="text"
                    value={formData.shoeName}
                    onChange={handleChange('shoeName')}
                    placeholder="e.g., Air Jordan 1 Retro High OG"
                    className="bg-transparent border-b-2 border-smoke px-0 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-sm uppercase tracking-wider text-dust">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={handleChange('brand')}
                      placeholder="e.g., Nike"
                      className="bg-transparent border-b-2 border-smoke px-0 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-heading text-sm uppercase tracking-wider text-dust">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={handleChange('model')}
                      placeholder="e.g., Air Jordan 1"
                      className="bg-transparent border-b-2 border-smoke px-0 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-sm uppercase tracking-wider text-dust">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData((p) => ({ ...p, categoryId: Number(e.target.value) }))}
                    className="bg-transparent border-b-2 border-smoke px-0 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green"
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c.categoryId} value={c.categoryId} className="bg-void">
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-heading text-sm uppercase tracking-wider text-dust">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={handleChange('description')}
                    placeholder="Describe the shoe..."
                    rows={3}
                    className="bg-transparent border-2 border-smoke px-3 py-2.5 text-chalk font-body text-base outline-none transition-colors duration-300 focus:border-neon-green resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCreatingNew(false)
                    setSelectedProduct(null)
                  }}
                  className="text-left text-sm text-dust hover:text-neon-green transition-colors"
                >
                  Search existing product instead
                </button>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="font-heading text-sm uppercase tracking-wider text-dust">
                  Sizes & Pricing
                </label>
                <button
                  type="button"
                  onClick={addSize}
                  className="text-sm text-neon-green hover:text-chalk transition-colors"
                >
                  + Add size
                </button>
              </div>

              {sizes.map((entry) => (
                <div key={entry.id} className="grid grid-cols-5 gap-3 items-end">
                  <div className="flex flex-col gap-1">
                    <label className="font-heading text-xs uppercase tracking-wider text-dust/60">
                      Size
                    </label>
                    <input
                      type="number"
                      min={1}
                      step={0.5}
                      value={entry.size || ''}
                      onChange={handleSizeChange(entry.id, 'size')}
                      placeholder="10"
                      className="bg-transparent border-b-2 border-smoke px-0 py-2 text-chalk text-sm outline-none focus:border-neon-green transition-colors"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-heading text-xs uppercase tracking-wider text-dust/60">
                      Condition
                    </label>
                    <select
                      value={entry.condition}
                      onChange={handleSizeChange(entry.id, 'condition')}
                      className="bg-transparent border-b-2 border-smoke px-0 py-2 text-chalk text-sm outline-none focus:border-neon-green transition-colors"
                    >
                      <option value="NEW" className="bg-void">New</option>
                      <option value="USED" className="bg-void">Used</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-heading text-xs uppercase tracking-wider text-dust/60">
                      Price
                    </label>
                    <input
                      type="number"
                      min={1}
                      step={0.01}
                      value={entry.price || ''}
                      onChange={handleSizeChange(entry.id, 'price')}
                      placeholder="0.00"
                      className="bg-transparent border-b-2 border-smoke px-0 py-2 text-chalk text-sm outline-none focus:border-neon-green transition-colors"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-heading text-xs uppercase tracking-wider text-dust/60">
                      Stock
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={entry.stockQuantity || ''}
                      onChange={handleSizeChange(entry.id, 'stockQuantity')}
                      placeholder="1"
                      className="bg-transparent border-b-2 border-smoke px-0 py-2 text-chalk text-sm outline-none focus:border-neon-green transition-colors"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => removeSize(entry.id)}
                      className="text-danger hover:text-chalk transition-colors text-sm pb-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-heading text-sm uppercase tracking-wider text-dust">
                Images
              </label>
              <div className="flex flex-wrap gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative w-20 h-20">
                    <img
                      src={img.preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-void text-xs flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-smoke/40 hover:border-neon-green transition-colors cursor-pointer flex items-center justify-center text-dust text-xl">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  +
                </label>
              </div>
              <p className="text-xs text-dust/60">
                Images saved locally and linked to the listing
              </p>
            </div>

            {error && <p className="text-danger font-mono text-sm">{error}</p>}
            <Button type="submit" loading={loading} className="mt-2">
              Create Listing{sizes.length > 1 ? 's' : ''}
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}