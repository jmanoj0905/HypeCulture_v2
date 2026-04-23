import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Spinner } from '@components/ui/Spinner'
import { getSellerListings, deleteListing } from '@api/listings'
import { useAuth } from '@hooks/useAuth'
import type { Listing } from '@api/products'
import { resolveImageUrl } from '@lib/imageUtils'

export function InventoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getSellerListings(user.userId)
      .then((res) => {
        if (res.data.success) setListings(res.data.data)
      })
      .catch(() => setError('Failed to load listings'))
      .finally(() => setLoading(false))
  }, [user])

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  const handleEdit = (listingId: number) => {
    navigate(`/seller/edit/${listingId}`)
  }

  const handleDelete = async (listingId: number) => {
    if (!window.confirm('Delete this listing?')) return
    setDeletingId(listingId)
    try {
      await deleteListing(listingId)
      setListings((prev) => prev.filter((l) => l.listingId !== listingId))
    } catch {
      setError('Failed to delete listing')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="w-8 h-8 border-2 border-smoke border-t-neon-green rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-2">Inventory</h1>
      <p className="text-dust font-mono text-sm mb-8">{listings.length} listings</p>
      {error && <p className="text-danger font-mono text-sm mb-4">{error}</p>}
      {listings.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-4xl text-smoke/30">NO LISTINGS</p>
          <p className="text-dust font-body mt-3">You haven&apos;t listed anything yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.listingId}>
              <Card.Image
                src={resolveImageUrl(listing.imageUrl || listing.product.imageUrl)}
                alt={listing.product.shoeName}
              />
              <Card.Body>
                <Card.Title>{listing.product.shoeName}</Card.Title>
                <div className="flex gap-4 mt-2 text-dust font-body text-sm">
                  <span>Size: {listing.size}</span>
                  <span>{listing.condition}</span>
                  <span>Stock: {listing.stockQuantity}</span>
                </div>
              </Card.Body>
              <Card.Footer>
                <span className="font-heading text-xl text-price">
                  {formatPrice(Number(listing.price))}
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(listing.listingId)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deletingId === listing.listingId}
                    onClick={() => handleDelete(listing.listingId)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
