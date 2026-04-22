import { Navigate, Outlet } from 'react-router'
import { Sidebar } from '@components/Sidebar'
import { useAuth } from '@hooks/useAuth' // <-- Change this line!

function Layout() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export const AdminLayout = Layout
export const SellerLayout = Layout