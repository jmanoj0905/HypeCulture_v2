import { Link, useLocation } from 'react-router'
import { useAuth } from '@hooks/useAuth'

const SELLER_LINKS = [
  { name: 'Dashboard', path: '/seller' },
  { name: 'New Listing', path: '/seller/new-listing' },
  { name: 'Inventory', path: '/seller/inventory' },
]

const ADMIN_LINKS = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Catalog', path: '/admin/catalog' },
  { name: 'Reports', path: '/admin/reports' },
]

export function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const links = user?.role === 'admin' ? ADMIN_LINKS : SELLER_LINKS
  const panelTitle = user?.role === 'admin' ? 'ADMIN PANEL' : 'SELLER PANEL'

  return (
    <aside className="w-64 h-screen bg-[#111] border-r border-smoke flex flex-col">
      <div className="px-6 py-5 border-b border-smoke">
        <h1 className="text-neon-green font-display text-2xl">HC</h1>
        <p className="text-dust text-xs uppercase mt-1">{panelTitle}</p>
      </div>

      <nav className="flex-1 py-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path ||
            (link.path !== '/seller' && link.path !== '/admin' && location.pathname.startsWith(link.path))
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-6 py-3 transition-colors ${
                isActive ? 'text-neon-green' : 'text-dust hover:text-chalk'
              }`}
            >
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-smoke">
        <p className="text-dust text-sm truncate">{user?.email}</p>
        <button
          onClick={() => logout()}
          className="text-dust hover:text-danger transition-colors mt-2"
        >
          LOGOUT
        </button>
      </div>
    </aside>
  )
}