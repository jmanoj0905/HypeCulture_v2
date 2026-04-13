import { useRef, type ElementType } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type NeonColor = 'green' | 'pink' | 'cyan' | 'yellow'

const neonColorMap: Record<NeonColor, { text: string; shadow: string }> = {
  green:  { text: 'text-neon-green',  shadow: '0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.2)' },
  pink:   { text: 'text-neon-pink',   shadow: '0 0 20px rgba(255,45,123,0.5), 0 0 40px rgba(255,45,123,0.2)' },
  cyan:   { text: 'text-neon-cyan',   shadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)' },
  yellow: { text: 'text-neon-yellow', shadow: '0 0 20px rgba(240,255,0,0.5), 0 0 40px rgba(240,255,0,0.2)' },
}

interface SplitTextProps {
  children: string
  as?: ElementType
  className?: string
  animation?: 'hover-lift' | 'scroll-reveal' | 'none'
  staggerDelay?: number
  neonColor?: NeonColor
}

export function SplitText({
  children,
  as: Tag = 'span',
  className = '',
  animation = 'hover-lift',
  staggerDelay = 0.02,
  neonColor,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (animation !== 'scroll-reveal' || !containerRef.current) return

    const chars = containerRef.current.querySelectorAll('.split-char')
    gsap.from(chars, {
      yPercent: 100,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: staggerDelay,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      },
    })
  }, { scope: containerRef, dependencies: [animation, staggerDelay] })

  const chars = children.split('')
  const neon = neonColor ? neonColorMap[neonColor] : null
  const hoverClass = animation === 'hover-lift' ? 'group' : ''

  return (
    <Tag
      ref={containerRef}
      className={`${hoverClass} ${neon?.text ?? ''} ${className}`}
      style={neon ? { textShadow: neon.shadow } : undefined}
    >
      {chars.map((char: string, i: number) => (
        <span
          key={i}
          className={`split-char inline-block transition-transform duration-300 ease-[var(--ease-out-expo)]
            ${animation === 'hover-lift' ? 'group-hover:-translate-y-full' : ''}
          `}
          style={animation === 'hover-lift' ? { transitionDelay: `${i * staggerDelay}s` } : undefined}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  )
}
