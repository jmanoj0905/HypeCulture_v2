import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface DepthMapOptions {
  intensity?: number
  smooth?: number
}

export function useDepthMap<T extends HTMLElement>(options: DepthMapOptions = {}) {
  const ref = useRef<T>(null)
  const { intensity = 15, smooth = 0.4 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const layers = el.querySelectorAll<HTMLElement>('[data-depth]')
    if (!layers.length) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const rect = el.getBoundingClientRect()

      // Normalize relative to container center
      const offsetX = ((clientX - rect.left) / rect.width - 0.5) * 2
      const offsetY = ((clientY - rect.top) / rect.height - 0.5) * 2

      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth ?? '1')
        gsap.to(layer, {
          x: offsetX * intensity * depth,
          y: offsetY * intensity * depth,
          duration: smooth,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }

    const handleMouseLeave = () => {
      layers.forEach((layer) => {
        gsap.to(layer, {
          x: 0,
          y: 0,
          duration: smooth * 2,
          ease: 'power2.out',
        })
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [intensity, smooth])

  return ref
}
