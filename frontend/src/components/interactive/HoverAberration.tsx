import type { ReactNode } from 'react'

interface HoverAberrationProps {
  children: ReactNode
  intensity?: number
  className?: string
}

/** String wrapped in a span that renders RGB-split layers on hover via CSS. */
export function HoverAberration({ children, intensity = 1, className = '' }: HoverAberrationProps) {
  return (
    <span className={`aberration-target ${className}`} data-text={String(children)}>
      {children}
    </span>
  )
}
