import { Outlet } from 'react-router'
import { Navbar } from '@components/navigation/Navbar'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
