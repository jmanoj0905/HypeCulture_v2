import { Outlet } from 'react-router'
import { Navbar } from '@components/navigation/Navbar'
import { AuthGuard } from './AuthGuard'

export function CustomerLayout() {
  return (
    <AuthGuard requiredRole="customer">
      <div className="min-h-screen bg-void">
        <Navbar />
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  )
}
