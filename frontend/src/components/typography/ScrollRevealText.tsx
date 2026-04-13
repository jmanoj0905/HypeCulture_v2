import { useRef, type ElementType } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealTextProps {
  children: string
  as?: ElementType
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
}

export function ScrollRevealText({
  children,
  as: Tag = 'div',
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.8,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLElement>(null)

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  useGSAP(() => {
    if (!ref.current) return
    const { x, y } = directionMap[direction]

    gsap.from(ref.current, {
      x,
      y,
      opacity: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        once: true,
      },
    })
  }, { scope: ref, dependencies: [direction, delay, duration] })

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
