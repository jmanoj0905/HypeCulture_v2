import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'

interface TiltCardProps {
  children: ReactNode
  max?: number
  scale?: number
  className?: string
}

export function TiltCard({ children, max = 8, scale = 1.02, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (py - 0.5) * -max * 2
    const ry = (px - 0.5) * max * 2
    gsap.to(el, {
      rotationX: rx,
      rotationY: ry,
      scale,
      transformPerspective: 900,
      duration: 0.4,
      ease: 'power3.out',
    })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
