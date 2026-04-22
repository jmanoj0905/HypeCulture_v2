import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'

interface TransitionState {
  isTransitioning: boolean
  navigateWithTransition: (path: string) => void
}

export const TransitionContext = createContext<TransitionState>({
  isTransitioning: false,
  navigateWithTransition: () => {},
})

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const curtainRef = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      tlRef.current?.kill()
      setIsTransitioning(false)
    }
  }, [])

  const navigateWithTransition = useCallback((path: string) => {
    if (isTransitioning) return
    const curtain = curtainRef.current
    if (!curtain) {
      navigate(path)
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      navigate(path)
      return
    }

    setIsTransitioning(true)

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    })
    tlRef.current = tl

    // Curtain wipes from bottom with diagonal stripe reveal
    tl.set(curtain, { yPercent: 100, display: 'flex', opacity: 1 })
    tl.fromTo(curtain, 
      { yPercent: 100 },
      { yPercent: 0, duration: 0.5, ease: 'power4.inOut' }
    )
    // Quick flash of brand at peak coverage
    tl.to(curtain.querySelector('.brand-text'), {
      opacity: 1,
      scale: 1.1,
      duration: 0.15,
      ease: 'power2.out',
    }, '-=0.1')
    tl.to(curtain.querySelector('.brand-text'), {
      opacity: 0,
      scale: 0.9,
      duration: 0.1,
    }, '+=0.05')
    // Swap route behind curtain
    tl.call(() => { navigate(path) })
    // Reveal new page from top
    tl.to(curtain, {
      yPercent: -100,
      duration: 0.5,
      ease: 'power4.inOut',
      delay: 0.1,
    })
    tl.set(curtain, { display: 'none', opacity: 0 })
  }, [isTransitioning, navigate])

  return (
    <TransitionContext.Provider value={{ isTransitioning, navigateWithTransition }}>
      {/* Page curtain overlay - diagonal stripe pattern */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[60] bg-void hidden items-center justify-center overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        {/* Diagonal stripes */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #39ff14 10px,
            #39ff14 11px
          )`,
        }} />
        {/* Brand text */}
        <div className="brand-text opacity-0">
          <span className="font-display text-7xl tracking-wider">
            <span className="text-neon-green">HYPE</span>
            <span className="text-white">CULTURE</span>
          </span>
        </div>
      </div>
      {children}
    </TransitionContext.Provider>
  )
}
