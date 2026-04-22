import { useEffect, useState } from 'react'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Spinner } from '@components/ui/Spinner'
import { getRevenue, getTopProducts } from '@api/reports'

function toDateString(date: Date) {
  return date.toISOString().split('T')[0]
}

export function ReportsPage() {
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const [from, setFrom] = useState(toDateString(thirtyDaysAgo))
  const [to, setTo] = useState(toDateString(today))
  const [revenue, setRevenue] = useState<number | null>(null)
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = () => {
    setLoading(true)
    setError(null)
    Promise.all([getRevenue(from, to), getTopProducts(from, to, 10)])
      .then(([revRes, topRes]) => {
        if (revRes.data.success) setRevenue(Number(revRes.data.data.revenue))
        if (topRes.data.success) setTopProducts(topRes.data.data)
      })
      .catch(() => setError('Failed to load reports'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  return (
    <div className="py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-8">System Reports</h1>

      {/* Date range */}
      <div className="flex flex-wrap items-end gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <label className="font-heading text-xs uppercase tracking-wider text-dust">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-asphalt border border-smoke text-chalk font-mono text-sm px-3 py-2 outline-none focus:border-neon-green"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-heading text-xs uppercase tracking-wider text-dust">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-asphalt border border-smoke text-chalk font-mono text-sm px-3 py-2 outline-none focus:border-neon-green"
          />
        </div>
        <Button variant="secondary" onClick={loadData} loading={loading}>
          Apply
        </Button>
      </div>

      {error && <p className="text-danger font-mono text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <Card.Body>
              <h2 className="font-heading text-xl text-chalk uppercase tracking-wider mb-4">
                Revenue
              </h2>
              <p className="text-neon-green font-display text-6xl md:text-7xl">
                ${revenue !== null ? revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
              </p>
              <p className="text-dust font-mono text-xs mt-2">{from} → {to}</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Top Selling Products</Card.Title>
              {topProducts.length === 0 ? (
                <p className="text-dust font-body text-sm mt-4">No sales data for this period.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {topProducts.map((row: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-smoke last:border-0"
                    >
                      <span className="text-chalk font-body text-sm">
                        {i + 1}. {row[0]}
                      </span>
                      <span className="text-dust font-mono text-xs">{row[2]} sold</span>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  )
}
