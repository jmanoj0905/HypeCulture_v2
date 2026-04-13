import { Link } from 'react-router'
import { useAuth } from '@hooks/useAuth'
import { CartBadge } from './CartBadge'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-void/95 border-b border-smoke">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl tracking-wider">
          <span className="text-neon-green">HYPE</span>
          <span className="text-white">CULTURE</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/browse" className="font-heading text-sm uppercase tracking-widest text-dust hover:text-neon-green transition-colors duration-300">
            Browse
          </Link>
          {user?.role === 'seller' && (
            <Link to="/seller" className="font-heading text-sm uppercase tracking-widest text-dust hover:text-neon-green transition-colors duration-300">
              Seller Panel
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="font-heading text-sm uppercase tracking-widest text-dust hover:text-neon-green transition-colors duration-300">
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {user?.role === 'customer' && <CartBadge />}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-dust hidden sm:block">{user.username}</span>
              <button
                onClick={() => logout()}
                className="font-heading text-sm uppercase tracking-widest text-dust hover:text-danger transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-heading text-sm uppercase tracking-widest px-4 py-2 border border-neon-green text-neon-green
                         hover:bg-neon-green hover:text-void transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
