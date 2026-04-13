import type { ReactNode, MouseEvent } from 'react'
import { usePageTransition } from '@hooks/usePageTransition'

interface TransitionLinkProps {
  to: string
  children: ReactNode
  className?: string
}

export function TransitionLink({ to, children, className = '' }: TransitionLinkProps) {
  const { navigateWithTransition } = usePageTransition()

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    navigateWithTransition(to)
  }

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
