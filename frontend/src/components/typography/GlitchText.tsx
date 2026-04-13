import type { ElementType, ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

export function GlitchText({ children, as: Tag = 'span', className = '' }: GlitchTextProps) {
  return (
    <Tag className={`relative inline-block ${className}`}>
      {/* Main text */}
      <span className="relative z-10">{children}</span>
      {/* Glitch layers */}
      <span
        className="absolute inset-0 text-neon-cyan opacity-0 hover:opacity-70 transition-opacity duration-100"
        style={{ clipPath: 'inset(20% 0 40% 0)', transform: 'translate(-2px, 1px)' }}
        aria-hidden
      >
        {children}
      </span>
      <span
        className="absolute inset-0 text-neon-pink opacity-0 hover:opacity-70 transition-opacity duration-100"
        style={{ clipPath: 'inset(60% 0 10% 0)', transform: 'translate(2px, -1px)' }}
        aria-hidden
      >
        {children}
      </span>
    </Tag>
  )
}
