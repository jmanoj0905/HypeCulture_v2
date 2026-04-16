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
        scrolled ? 'bg-void/70 backdrop-blur-xl border-b border-smoke/60' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl tracking-wider flex items-center gap-2 shrink-0" data-cursor="link">
          <span className="font-mono text-[9px] text-neon-green tracking-[0.3em] hidden md:inline">◉</span>
          <DecryptedText text="HYPECULTURE" />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/browse">Browse</NavLink>
          {user?.role === 'seller' && <NavLink to="/seller">Seller</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          {user?.role === 'customer' && <CartBadge />}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-dust hidden sm:block uppercase tracking-widest">
                {user.username}
              </span>
              <button
                onClick={() => logout()}
                className="font-heading text-xs uppercase tracking-widest text-dust hover:text-danger transition-colors"
                data-cursor="link"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              data-cursor="link"
              className="relative font-heading text-xs uppercase tracking-widest px-5 py-2 text-neon-green
                         before:content-[''] before:absolute before:inset-0 before:border before:border-neon-green
                         before:transition-transform before:duration-500
                         hover:before:scale-x-105 hover:before:scale-y-110"
            >
              <span className="relative">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Scroll progress */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-smoke/40 overflow-hidden">
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
      className="group relative font-heading text-xs uppercase tracking-[0.25em] text-chalk hover:text-neon-green transition-colors duration-300"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-px bg-neon-green w-0 group-hover:w-full transition-[width] duration-500 ease-[var(--ease-out-quart)]" />
    </Link>
  )
}
