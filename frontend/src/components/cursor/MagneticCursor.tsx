import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type CursorMode = 'default' | 'view' | 'drag' | 'buy' | 'link'

const labelMap: Record<CursorMode, string> = {
  default: '',
  view: 'VIEW',
  drag: 'DRAG',
  buy: 'BUY',
  link: '',
}

function hasFinePointer(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: fine)').matches
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function MagneticCursor() {
  const [active, setActive] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    setActive(true)
    document.documentElement.setAttribute('data-cursor', 'custom')
    return () => {
      document.documentElement.removeAttribute('data-cursor')
    }
  }, [])

  useEffect(() => {
    if (!active || !dotRef.current || !ringRef.current) return

    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.15, ease: 'power3.out' })
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.15, ease: 'power3.out' })
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.45, ease: 'power3.out' })

    let currentMode: CursorMode = 'default'

    const setMode = (mode: CursorMode) => {
      if (mode === currentMode) return
      currentMode = mode
      const ring = ringRef.current!
      const label = labelRef.current!
      const isBig = mode === 'view' || mode === 'drag' || mode === 'buy'

      gsap.to(ring, {
        scale: isBig ? 2.6 : 1,
        borderColor: mode === 'drag'
          ? 'rgba(57,255,20,0.9)'
          : mode === 'buy'
          ? 'rgba(57,255,20,1)'
          : mode === 'view'
          ? 'rgba(224,224,224,0.9)'
          : mode === 'link'
          ? 'rgba(57,255,20,0.6)'
          : 'rgba(224,224,224,0.4)',
        backgroundColor: mode === 'buy' ? 'rgba(57,255,20,0.18)' : 'rgba(0,0,0,0)',
        duration: 0.35,
        ease: 'power3.out',
      })

      label.textContent = labelMap[mode]
      gsap.to(label, {
        opacity: isBig ? 1 : 0,
        duration: 0.25,
        ease: 'power3.out',
      })

      gsap.to(dotRef.current, {
        scale: isBig ? 0 : 1,
        duration: 0.25,
        ease: 'power3.out',
      })
    }

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const ctx = target.closest<HTMLElement>('[data-cursor]')
      const attr = ctx?.getAttribute('data-cursor') as CursorMode | null
      if (attr && attr in labelMap) {
        setMode(attr)
        return
      }
      const interactive = target.closest('a, button, [role="button"]')
      setMode(interactive ? 'link' : 'default')
    }

    const onLeave = () => setMode('default')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [active])

  if (!active) return null

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[99] pointer-events-none flex items-center justify-center rounded-full border border-chalk/40"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      >
        <span
          ref={labelRef}
          className="font-mono text-[9px] tracking-[0.2em] text-white opacity-0 uppercase"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[99] pointer-events-none rounded-full bg-neon-green"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          willChange: 'transform',
        }}
      />
    </>
  )
}
