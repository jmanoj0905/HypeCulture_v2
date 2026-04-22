import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'

const TOP_PRODUCTS = [
  { rank: 1, name: 'Jordan 1', sold: 45 },
  { rank: 2, name: 'Dunk Low', sold: 32 },
  { rank: 3, name: 'Yeezy', sold: 28 },
]

export function ReportsPage() {
  const handleDownloadCSV = () => {
    alert('CSV download triggered')
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-8">System Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Card.Body>
            <h2 className="font-heading text-xl text-chalk uppercase tracking-wider mb-4">
              Revenue Overview
            </h2>
            {/* Swapped the hardcoded hex color for text-neon-green */}
            <p className="text-neon-green font-display text-6xl md:text-8xl">
              $124,500.00
            </p>
          </Card.Body>
          <Card.Footer>
            <Button variant="secondary" onClick={handleDownloadCSV}>
              Download CSV
            </Button>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>Top Selling Products</Card.Title>
            <div className="mt-4 space-y-3">
              {TOP_PRODUCTS.map((product) => (
                <div
                  key={product.rank}
                  className="flex justify-between items-center py-2 border-b border-smoke last:border-0"
                >
                  <span className="text-chalk font-body">
                    {product.rank}. {product.name}
                  </span>
                  <span className="text-dust font-body">{product.sold} sold</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}