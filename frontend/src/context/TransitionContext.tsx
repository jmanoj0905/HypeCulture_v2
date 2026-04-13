import { createContext, useCallback, useRef, useState, type ReactNode } from 'react'
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
  const navigate = useNavigate()

  const navigateWithTransition = useCallback((path: string) => {
    if (isTransitioning) return
    const curtain = curtainRef.current
    if (!curtain) {
      navigate(path)
      return
    }

    setIsTransitioning(true)

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    })

    // Curtain slides up from bottom
    tl.set(curtain, { yPercent: 100, display: 'flex' })
    tl.to(curtain, {
      yPercent: 0,
      duration: 0.4,
      ease: 'power3.inOut',
    })
    // Swap route behind curtain
    tl.call(() => navigate(path))
    tl.to(curtain, {
      yPercent: -100,
      duration: 0.4,
      ease: 'power3.inOut',
      delay: 0.15,
    })
    tl.set(curtain, { display: 'none' })
  }, [isTransitioning, navigate])

  return (
    <TransitionContext.Provider value={{ isTransitioning, navigateWithTransition }}>
      {/* Page curtain overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[60] bg-void items-center justify-center hidden"
        style={{ willChange: 'transform' }}
      >
        <span className="font-display text-5xl tracking-wider">
          <span className="text-neon-green">HYPE</span>
          <span className="text-white">CULTURE</span>
        </span>
      </div>
      {children}
    </TransitionContext.Provider>
  )
}
