import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@components/ui/Card' // Only import Card!
import { Button } from '@components/ui/Button'
import { getSellerListings } from '@api/listings'
import type { Listing } from '@api/products'

const MOCK_LISTINGS: Listing[] = [
  {
    listingId: 1,
    product: {
      productId: 1,
      shoeName: 'Air Jordan 1 Retro High OG',
      brand: 'Jordan',
      model: 'Retro High',
      category: { categoryId: 1, categoryName: 'Basketball', description: '' },
      imageUrl: 'https://placehold.co/400x400/1a1a1a/e0e0e0?text=Jordan+1',
      description: '',
      active: true,
      createdAt: '',
    },
    seller: { userId: 1, username: 'sneakerhead', sellerRating: 4.8 },
    size: '10',
    condition: 'New',
    price: 250,
    stockQuantity: 2,
    status: 'ACTIVE',
    imageUrl: 'https://placehold.co/400x400/1a1a1a/e0e0e0?text=Jordan+1',
    createdAt: '',
  },
  {
    listingId: 2,
    product: {
      productId: 2,
      shoeName: 'Nike Dunk Low Panda',
      brand: 'Nike',
      model: 'Dunk Low',
      category: { categoryId: 2, categoryName: 'Lifestyle', description: '' },
      imageUrl: 'https://placehold.co/400x400/1a1a1a/e0e0e0?text=Dunk+Low',
      description: '',
      active: true,
      createdAt: '',
    },
    seller: { userId: 1, username: 'sneakerhead', sellerRating: 4.8 },
    size: '9.5',
    condition: 'New',
    price: 130,
    stockQuantity: 5,
    status: 'ACTIVE',
    imageUrl: 'https://placehold.co/400x400/1a1a1a/e0e0e0?text=Dunk+Low',
    createdAt: '',
  },
  {
    listingId: 3,
    product: {
      productId: 3,
      shoeName: 'Yeezy Boost 350 V2',
      brand: 'Adidas',
      model: 'Yeezy 350',
      category: { categoryId: 3, categoryName: 'Lifestyle', description: '' },
      imageUrl: 'https://placehold.co/400x400/1a1a1a/e0e0e0?text=Yeezy',
      description: '',
      active: true,
      createdAt: '',
    },
    seller: { userId: 1, username: 'sneakerhead', sellerRating: 4.8 },
    size: '11',
    condition: 'Used',
    price: 180,
    stockQuantity: 1,
    status: 'ACTIVE',
    imageUrl: 'https://placehold.co/400x400/1a1a1a/e0e0e0?text=Yeezy',
    createdAt: '',
  },
]

export function InventoryPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  
  // 1. Initialize the router navigation
  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getSellerListings()
        setListings(response.data)
      } catch {
        setListings(MOCK_LISTINGS)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  // 2. Updated Edit Function
  const handleEdit = (listingId: number) => {
    navigate(`/seller/edit/${listingId}`)
  }

  // 3. Updated Delete Function
  const handleDelete = async (listingId: number) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return

    try {
      // In production: await deleteListing(listingId)
      
      // Update React state to remove the card immediately
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.listingId !== listingId)
      )
    } catch (error) {
      alert('Failed to delete listing.')
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
      <h1 className="font-display text-5xl text-white mb-8">Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.listingId}>
            <Card.Image
              src={listing.imageUrl || listing.product.imageUrl}
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
                {formatPrice(listing.price)}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(listing.listingId)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(listing.listingId)}>
                  Delete
                </Button>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  )
}