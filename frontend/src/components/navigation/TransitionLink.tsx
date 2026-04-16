import type { ReactNode, MouseEvent } from 'react'
import { usePageTransition } from '@hooks/usePageTransition'

export interface TransitionLinkProps {
  to: string
  children: ReactNode
  className?: string
  onClick?: () => void
  'data-cursor'?: string
}

export function TransitionLink({ to, children, className = '', onClick, ...rest }: TransitionLinkProps) {
  const { navigateWithTransition } = usePageTransition()

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    onClick?.()
    navigateWithTransition(to)
  }

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  )
}
