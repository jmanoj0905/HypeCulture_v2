import { useEffect, useRef, createElement, type ElementType } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

interface ScrambleTextProps {
  children: string
  as?: ElementType
  className?: string
  trigger?: 'mount' | 'hover' | 'inview'
  duration?: number
  delay?: number
}

/**
 * Scrambles characters then resolves to final text.
 * Hand-rolled (no GSAP plugin dep) for zero license risk.
 */
export function ScrambleText({
  children,
  as: Tag = 'span',
  className = '',
  trigger = 'inview',
  duration = 900,
  delay = 0,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null)
  const rafRef = useRef<number>(0)
  const startedRef = useRef<boolean>(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.textContent = children

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const run = () => {
      if (startedRef.current) return
      startedRef.current = true
      const start = performance.now() + delay
      const target = children
      const len = target.length

      const tick = (now: number) => {
        const t = Math.max(0, Math.min(1, (now - start) / duration))
        let out = ''
        for (let i = 0; i < len; i++) {
          const charProgress = Math.max(0, Math.min(1, t * 1.6 - i / len))
          if (target[i] === ' ') {
            out += ' '
          } else if (charProgress >= 1) {
            out += target[i]
          } else if (charProgress > 0) {
            out += CHARS[Math.floor(Math.random() * CHARS.length)]
          } else {
            out += ' '
          }
        }
        if (el) el.textContent = out
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else if (el) {
          el.textContent = target
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (trigger === 'mount') {
      run()
      return () => cancelAnimationFrame(rafRef.current)
    }

    if (trigger === 'hover') {
      const onEnter = () => { startedRef.current = false; run() }
      el.addEventListener('mouseenter', onEnter)
      return () => {
        el.removeEventListener('mouseenter', onEnter)
        cancelAnimationFrame(rafRef.current)
      }
    }

    // inview
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          run()
          io.disconnect()
          break
        }
      }
    }, { threshold: 0.4 })
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [children, trigger, duration, delay])

  return createElement(Tag, { ref, className }, children)
}
