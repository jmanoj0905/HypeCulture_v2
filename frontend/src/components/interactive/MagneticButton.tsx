import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
  as?: 'button' | 'div'
  onClick?: () => void
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.2,
  radius = 80,
  as: Tag = 'button',
  onClick,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLButtonElement & HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const xTo = gsap.quickTo(inner, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > radius) {
        xTo(0); yTo(0)
        return
      }
      xTo(dx * strength)
      yTo(dy * strength)
    }

    const onLeave = () => { xTo(0); yTo(0) }

    window.addEventListener('mousemove', onMove, { passive: true })
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [strength, radius])

  const Component = Tag as 'button'
  return (
    <Component
      ref={wrapRef}
      onClick={onClick}
      className={`inline-block ${className}`}
      style={{ willChange: 'transform' }}
    >
      <span ref={innerRef} className="inline-block" style={{ willChange: 'transform' }}>
        {children}
      </span>
    </Component>
  )
}
