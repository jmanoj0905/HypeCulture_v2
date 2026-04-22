import { Link, useLocation } from 'react-router'
import { useAuth } from '@hooks/useAuth'

const SELLER_LINKS = [
  { label: 'Dashboard', path: '/seller' },
  { label: 'New Listing', path: '/seller/new-listing' },
  { label: 'Inventory', path: '/seller/inventory' },
]

const ADMIN_LINKS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Catalog', path: '/admin/catalog' },
  { label: 'Reports', path: '/admin/reports' },
]

export function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const links = user?.role === 'admin' ? ADMIN_LINKS : SELLER_LINKS
  const panelTitle = user?.role === 'admin' ? 'ADMIN PANEL' : 'SELLER PANEL'

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-asphalt border-r border-smoke z-30 flex flex-col">
      <div className="px-6 py-5 border-b border-smoke">
        <h1 className="font-display text-2xl tracking-wider">
          <span className="text-neon-green">HC</span>
        </h1>
        <p className="font-heading text-xs uppercase tracking-widest text-dust mt-1">{panelTitle}</p>
      </div>

      <nav className="flex-1 py-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path ||
            (link.path !== '/seller' && link.path !== '/admin' && location.pathname.startsWith(link.path))
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`
                flex items-center px-6 py-3 font-heading text-sm uppercase tracking-widest
                transition-all duration-300 border-l-3
                ${isActive
                  ? 'border-l-neon-green text-neon-green bg-neon-green/5'
                  : 'border-l-transparent text-dust hover:text-chalk hover:bg-white/3'
                }
              `}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-smoke">
        <p className="font-mono text-xs text-dust truncate">{user?.email}</p>
        <button
          onClick={() => logout()}
          className="font-heading text-xs uppercase tracking-widest text-dust hover:text-danger transition-colors mt-2"
        >
          LOGOUT
        </button>
      </div>
    </aside>
  )
}
