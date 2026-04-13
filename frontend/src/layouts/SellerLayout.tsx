import { Outlet } from 'react-router'
import { Sidebar } from '@components/navigation/Sidebar'
import { AuthGuard } from './AuthGuard'

const sellerLinks = [
  { label: 'Dashboard', path: '/seller' },
  { label: 'New Listing', path: '/seller/new-listing' },
  { label: 'Inventory', path: '/seller/inventory' },
]

export function SellerLayout() {
  return (
    <AuthGuard requiredRole="seller">
      <div className="min-h-screen bg-void">
        <Sidebar title="Seller Panel" links={sellerLinks} />
        <main className="ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  )
}
