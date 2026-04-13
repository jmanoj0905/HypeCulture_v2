import { Link, useLocation } from 'react-router'
import { useAuth } from '@hooks/useAuth'

interface SidebarLink {
  label: string
  path: string
}

interface SidebarProps {
  title: string
  links: SidebarLink[]
}

export function Sidebar({ title, links }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-asphalt border-r border-smoke z-30 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-smoke">
        <Link to="/" className="font-display text-xl tracking-wider">
          <span className="text-neon-green">HC</span>
        </Link>
        <p className="font-heading text-xs uppercase tracking-widest text-dust mt-1">{title}</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4">
        {links.map((link) => {
          const active = location.pathname === link.path ||
            (link.path !== '/seller' && link.path !== '/admin' && location.pathname.startsWith(link.path))
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`
                flex items-center px-6 py-3 font-heading text-sm uppercase tracking-widest
                transition-all duration-300 border-l-3
                ${active
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

      {/* User info */}
      <div className="px-6 py-4 border-t border-smoke">
        <p className="font-mono text-xs text-dust truncate">{user?.email}</p>
        <button
          onClick={() => logout()}
          className="font-heading text-xs uppercase tracking-widest text-dust hover:text-danger transition-colors mt-2"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
