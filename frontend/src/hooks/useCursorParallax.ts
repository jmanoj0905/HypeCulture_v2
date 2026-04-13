import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface CursorParallaxOptions {
  intensity?: number
  smooth?: number
}

export function useCursorParallax<T extends HTMLElement>(options: CursorParallaxOptions = {}) {
  const ref = useRef<T>(null)
  const { intensity = 20, smooth = 0.3 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Normalize to -1 to 1
      const offsetX = (clientX / innerWidth - 0.5) * 2
      const offsetY = (clientY / innerHeight - 0.5) * 2

      gsap.to(el, {
        x: offsetX * intensity,
        y: offsetY * intensity,
        duration: smooth,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [intensity, smooth])

  return ref
}
