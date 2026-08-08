import type { ReactNode } from 'react'

type BadgeVariant = 'green' | 'cyan' | 'pink' | 'yellow' | 'danger' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  green: 'bg-neon-green text-chalk',
  cyan: 'bg-smoke text-chalk',
  pink: 'bg-neon-pink text-chalk',
  yellow: 'bg-neon-green text-chalk',
  danger: 'bg-danger text-void',
  neutral: 'bg-smoke text-dust',
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-heading font-bold rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
