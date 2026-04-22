import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Spinner } from '@components/ui/Spinner'
import { getSellerListings } from '@api/listings'
import { useAuth } from '@hooks/useAuth'
import type { Listing } from '@api/products'

export function SellerDashboard() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getSellerListings(user.userId)
      .then((res) => {
        if (res.data.success) setListings(res.data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const activeListings = listings.filter((l) => l.status === 'ACTIVE')
  const inventoryValue = listings.reduce((sum, l) => sum + l.price * l.stockQuantity, 0)

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-2">Seller Dashboard</h1>
      <p className="text-dust font-body text-sm mb-8">Welcome, {user?.username}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <Card.Body>
            <span className="text-dust font-body text-sm uppercase tracking-wider">Active Listings</span>
            <span className="text-neon-green font-mono text-4xl block mt-2">
              {activeListings.length}
            </span>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <span className="text-dust font-body text-sm uppercase tracking-wider">Total Inventory Value</span>
            <span className="text-neon-green font-mono text-4xl block mt-2">
              {formatCurrency(inventoryValue)}
            </span>
          </Card.Body>
        </Card>
      </div>

      <section>
        <h2 className="font-heading text-xl text-chalk uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/seller/new-listing">
            <Button variant="secondary">Add New Listing</Button>
          </Link>
          <Link to="/seller/inventory">
            <Button variant="secondary">Manage Inventory</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
