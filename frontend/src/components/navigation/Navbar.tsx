import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@hooks/useAuth'
import { CartBadge } from './CartBadge'
import { DecryptedText } from '@components/typography/DecryptedText'

export function Navbar() {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        scrolled ? 'bg-void/85 backdrop-blur-xl border-b border-smoke' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-3xl tracking-tight flex items-center gap-2 shrink-0 text-chalk" data-cursor="link">
          <span className="inline-block w-2 h-2 rounded-full bg-neon-green" />
          <DecryptedText text="HYPECULTURE" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/browse">Browse</NavLink>
          {user?.role === 'seller' && <NavLink to="/seller">Seller</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </div>

        <div className="flex items-center gap-5">
          {user?.role === 'customer' && <CartBadge />}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-heading text-sm text-dust hidden sm:block">
                {user.username}
              </span>
              <button
                onClick={() => logout()}
                className="font-heading text-sm font-medium text-dust hover:text-danger transition-colors"
                data-cursor="link"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              data-cursor="link"
              className="font-heading font-bold text-sm rounded-full px-6 py-2.5 bg-neon-green text-chalk
                         hover:bg-chalk hover:text-neon-green transition-colors duration-[750ms] ease-[cubic-bezier(0.65,0.05,0,1)]"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-smoke overflow-hidden">
        <div
          ref={progressRef}
          className="h-full w-full bg-neon-green origin-left"
          style={{ transform: 'scaleX(0)', willChange: 'transform' }}
        />
      </div>
    </nav>
  )
}

function NavLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      data-cursor="link"
      className="group relative font-heading font-medium text-sm text-chalk hover:text-dust transition-colors duration-300"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-0.5 bg-neon-green w-0 group-hover:w-full transition-[width] duration-500 ease-[var(--ease-out-quart)]" />
    </Link>
  )
}
