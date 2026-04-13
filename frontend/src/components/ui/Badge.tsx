import type { ReactNode } from 'react'

type BadgeVariant = 'green' | 'cyan' | 'pink' | 'yellow' | 'danger' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  green: 'bg-neon-green/15 text-neon-green',
  cyan: 'bg-neon-cyan/15 text-neon-cyan',
  pink: 'bg-neon-pink/15 text-neon-pink',
  yellow: 'bg-neon-yellow/15 text-neon-yellow',
  danger: 'bg-danger/15 text-danger',
  neutral: 'bg-smoke text-dust',
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
