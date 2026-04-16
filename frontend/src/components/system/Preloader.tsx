import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const STORAGE_KEY = 'hc-loaded'

export function Preloader() {
  const [alreadyLoaded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  })
  const [mounted, setMounted] = useState<boolean>(!alreadyLoaded)
  const [skipAnimation, setSkipAnimation] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSkipAnimation(true)
      sessionStorage.setItem(STORAGE_KEY, '1')
      setMounted(false)
    }
  }, [])

  useGSAP(() => {
    if (alreadyLoaded || !rootRef.current || skipAnimation) return

    const counter = { value: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setMounted(false)
      },
    })

    tl.to(barRef.current, {
      scaleX: 1,
      duration: 1.8,
      ease: 'power2.inOut',
    }, 0)

    tl.to(counter, {
      value: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0')
        }
      },
    }, 0)

    tl.to(logoRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
    }, '+=0.15')

    tl.to(rootRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
    }, '-=0.1')
  }, { dependencies: [alreadyLoaded, skipAnimation] })

  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center"
      style={{ willChange: 'transform' }}
      aria-label="Loading HypeCulture"
    >
      <div ref={logoRef} className="flex flex-col items-center gap-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-dust">
          est. 2024 / authenticated
        </p>
        <h1 className="font-display text-6xl md:text-8xl tracking-wider leading-none">
          <span className="text-neon-green">HYPE</span>
          <span className="text-white">CULTURE</span>
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <span
            ref={counterRef}
            className="font-mono text-sm text-neon-green tabular-nums"
          >
            000
          </span>
          <div className="w-60 h-px bg-smoke overflow-hidden">
            <div
              ref={barRef}
              className="h-full bg-neon-green origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <span className="font-mono text-sm text-dust tabular-nums">100</span>
        </div>
      </div>
    </div>
  )
}
