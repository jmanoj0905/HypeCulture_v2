import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface DecryptedTextProps {
  text: string
  className?: string
  speed?: number
  maxIterations?: number
  characters?: string
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*?<>[]'

export function DecryptedText({
  text,
  className = '',
  speed = 40,
  maxIterations = 6,
  characters = CHARS,
}: DecryptedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const isAnimatingRef = useRef(false)

  useGSAP(() => {
    if (!containerRef.current) return

    const chars = characters.split('')

    const handleMouseEnter = () => {
      if (isAnimatingRef.current) return
      isAnimatingRef.current = true

      const letters = containerRef.current!.querySelectorAll('.decrypt-letter') as HTMLElement[]
      if (!letters.length) return

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false
        },
      })

      // Initial scramble
      letters.forEach((letter) => {
        const original = letter.dataset.original
        if (original && original !== ' ') {
          letter.textContent = chars[Math.floor(Math.random() * chars.length)]
        }
      })

      // Reveal each letter
      letters.forEach((letter, i) => {
        const original = letter.dataset.original
        if (!original || original === ' ') return

        tl.to(letter, {
          duration: speed / 1000,
          onStart: () => {
            if (!isAnimatingRef.current) return
            letter.textContent = chars[Math.floor(Math.random() * chars.length)]
          },
          onComplete: () => {
            letter.textContent = original
          },
        }, i * (speed / 1000 * 0.8))
      })
    }

    const handleMouseLeave = () => {
      const letters = containerRef.current!.querySelectorAll('.decrypt-letter') as HTMLElement[]
      letters.forEach((letter) => {
        const original = letter.dataset.original
        if (original) letter.textContent = original
      })
      isAnimatingRef.current = false
    }

    containerRef.current.addEventListener('mouseenter', handleMouseEnter)
    containerRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter)
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [text, speed, characters])

  return (
    <span ref={containerRef} className={`decrypted-text inline-block ${className}`} style={{ whiteSpace: 'pre' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="decrypt-letter"
          data-original={char}
          style={{ display: 'inline-block' }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}