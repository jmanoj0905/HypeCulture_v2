import { Outlet } from 'react-router'
import { Sidebar } from '@components/navigation/Sidebar'
import { AuthGuard } from './AuthGuard'

const adminLinks = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Catalog', path: '/admin/catalog' },
  { label: 'Reports', path: '/admin/reports' },
]

export function AdminLayout() {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-void">
        <Sidebar title="Admin Panel" links={adminLinks} />
        <main className="ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  )
}
