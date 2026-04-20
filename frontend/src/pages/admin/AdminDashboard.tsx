import { Link } from 'react-router'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'

export function AdminDashboard() {
  return (
    <div className="py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-4">Admin Dashboard</h1>
      <p className="text-dust font-body text-lg mb-8">
        Welcome back, Admin. System is running smoothly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body>
            <Card.Title>Manage Users</Card.Title>
            <p className="text-dust mt-2">
              View and deactivate user accounts.
            </p>
          </Card.Body>
          <Card.Footer>
            <Link to="/admin/users">
              <Button variant="secondary" size="sm">View Users</Button>
            </Link>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>Product Catalog</Card.Title>
            <p className="text-dust mt-2">
              Add and manage master products.
            </p>
          </Card.Body>
          <Card.Footer>
            <Link to="/admin/catalog">
              <Button variant="secondary" size="sm">View Catalog</Button>
            </Link>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>System Reports</Card.Title>
            <p className="text-dust mt-2">
              View revenue and sales reports.
            </p>
          </Card.Body>
          <Card.Footer>
            <Link to="/admin/reports">
              <Button variant="secondary" size="sm">View Reports</Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </div>
  )
}
