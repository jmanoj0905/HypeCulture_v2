import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { Card } from '@components/ui/Card'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { Spinner } from '@components/ui/Spinner'
import { getListing, updateListing } from '@api/listings'

export function SellerEditListing() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getListing(Number(id))
      .then((res) => {
        if (res.data.success) {
          const listing = res.data.data
          setPrice(String(listing.price))
          setStockQuantity(String(listing.stockQuantity))
          setProductName(listing.product.shoeName)
        } else {
          setError('Listing not found')
        }
      })
      .catch(() => setError('Failed to load listing'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateListing(Number(id), {
        price: Number(price),
        stockQuantity: Number(stockQuantity),
      })
      navigate('/seller/inventory')
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to update listing')
    } finally {
      setSaving(false)
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
    <div className="py-12 px-4 md:px-8 max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/seller/inventory" className="text-dust hover:text-chalk transition-colors">
          &larr; Back
        </Link>
        <h1 className="font-display text-4xl text-white">Edit Listing</h1>
      </div>

      {productName && (
        <p className="font-heading text-sm text-dust uppercase tracking-wider mb-6">{productName}</p>
      )}

      <Card>
        <Card.Body>
          <Card.Title className="mb-6">Update Price & Stock</Card.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Price"
              type="number"
              min={1}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
            />
            <Input
              label="Stock Quantity"
              type="number"
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="Enter stock quantity"
              required
            />

            {error && <p className="text-danger font-mono text-sm">{error}</p>}

            <div className="flex gap-4 mt-2">
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/seller/inventory')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}
