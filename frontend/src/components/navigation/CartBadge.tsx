import { Link } from 'react-router'
import { useCart } from '@hooks/useCart'

export function CartBadge() {
  const { count } = useCart()

  return (
    <Link to="/cart" className="relative group">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.5" className="w-6 h-6 text-chalk group-hover:text-neon-green transition-colors duration-300">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-neon-pink text-void text-xs font-mono font-bold w-5 h-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
