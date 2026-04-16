import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ScrambledTextProps {
  text: string
  className?: string
  radius?: number
  duration?: number
  speed?: number
  scrambleChars?: string
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*?<>[]{}'

export function ScrambledText({
  text,
  className = '',
  radius = 120,
  duration = 0.8,
  speed = 0.3,
  scrambleChars = DEFAULT_CHARS,
}: ScrambledTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const charsRef = useRef<HTMLElement[]>([])
  const isScramblingRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const chars = containerRef.current.querySelectorAll('.scramble-char') as HTMLElement[]
    charsRef.current = chars

    chars.forEach((char) => {
      gsap.set(char, {
        display: 'inline-block',
        attr: { 'data-original': char.textContent },
      })
    })

    const charsArr = scrambleChars.split('')

    const handleMove = (e: PointerEvent) => {
      if (isScramblingRef.current) return
      isScramblingRef.current = true

      chars.forEach((char) => {
        const rect = char.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = e.clientX - centerX
        const dy = e.clientY - centerY
        const dist = Math.hypot(dx, dy)

        if (dist < radius) {
          const intensity = 1 - dist / radius

          gsap.to(char, {
            duration: duration * intensity,
            scrambleText: {
              text: char.dataset.original || '',
              chars: scrambleChars,
              speed,
            },
            ease: 'none',
            onComplete: () => {
              char.textContent = char.dataset.original || ''
            },
          })
        } else {
          gsap.to(char, {
            duration: 0.3,
            onComplete: () => {
              char.textContent = char.dataset.original || ''
            },
          })
        }
      })

      setTimeout(() => {
        isScramblingRef.current = false
      }, 100)
    }

    const handleLeave = () => {
      chars.forEach((char) => {
        gsap.to(char, {
          duration: 0.4,
          onComplete: () => {
            char.textContent = char.dataset.original || ''
          },
        })
      })
    }

    window.addEventListener('pointermove', handleMove)
    containerRef.current.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      containerRef.current?.removeEventListener('mouseleave', handleLeave)
    }
  }, [text, radius, duration, speed, scrambleChars])

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="scramble-char"
          style={{ display: 'inline-block' }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}