import { Link } from 'react-router'
import { Card } from '@components/ui/Card' // Only import Card!
import { Button } from '@components/ui/Button'

const STATS = {
  activeListings: 12,
  inventoryValue: 4250.0,
  rating: 4.8,
}

export function SellerDashboard() {
  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-8">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <Card.Body>
            <span className="text-dust font-body text-sm uppercase tracking-wider">Active Listings</span>
            <span className="text-neon-green font-mono text-4xl block mt-2">
              {STATS.activeListings}
            </span>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <span className="text-dust font-body text-sm uppercase tracking-wider">Total Inventory Value</span>
            <span className="text-neon-green font-mono text-4xl block mt-2">
              {formatCurrency(STATS.inventoryValue)}
            </span>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <span className="text-dust font-body text-sm uppercase tracking-wider">Seller Rating</span>
            <span className="text-neon-green font-mono text-4xl block mt-2">
              {STATS.rating} <span className="text-lg">/ 5.0</span>
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