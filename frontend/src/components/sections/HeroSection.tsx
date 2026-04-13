import { lazy, Suspense, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from '@components/typography/SplitText'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { FluidRevealEffect } from '@components/effects/FluidRevealEffect'

gsap.registerPlugin(ScrollTrigger)

const SneakerScene = lazy(() =>
  import('@three/SneakerScene').then((m) => ({ default: m.SneakerScene }))
)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !textRef.current || !canvasWrapRef.current) return

    gsap.to([textRef.current, canvasWrapRef.current], {
      opacity: 0,
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">

      {/* Fluid reveal — full viewport */}
      <div className="absolute inset-0 z-0">
        <FluidRevealEffect
          options={{ cursor_size: 28, mouse_force: 70, dissipation: 0.94 }}
        />
      </div>

      {/* Light scrim — just enough to anchor text, doesn't kill the fluid */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(6,6,6,0.72) 45%, rgba(6,6,6,0.1) 100%)' }}
      />

      {/* 3D sneaker — right half, full height, floats over fluid */}
      <div
        ref={canvasWrapRef}
        className="absolute top-0 right-0 h-full z-[2] hidden lg:block"
        style={{ width: '52%', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <SneakerScene />
        </Suspense>
      </div>

      {/* Text content — bottom-left, Lando-style */}
      <div ref={textRef} className="absolute bottom-0 left-0 z-10 max-w-7xl px-6 pb-16 lg:pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-green mb-4">
          EST. 2024
        </p>

        <h1 className="font-display leading-[0.85] tracking-wider"
          style={{ fontSize: 'clamp(4.5rem, 9vw, 9rem)' }}
        >
          <SplitText animation="scroll-reveal" className="block text-white whitespace-nowrap">
            THE
          </SplitText>
          <SplitText animation="scroll-reveal" staggerDelay={0.025} className="block whitespace-nowrap" neonColor="green">
            UNDERGROUND
          </SplitText>
          <SplitText animation="scroll-reveal" staggerDelay={0.025} className="block text-white whitespace-nowrap">
            SNEAKER
          </SplitText>
          <SplitText animation="scroll-reveal" staggerDelay={0.025} className="block text-white whitespace-nowrap">
            MARKET
          </SplitText>
        </h1>

        <p className="font-body text-dust mt-5 text-base max-w-sm">
          Buy, sell, and trade the most hyped sneakers. Direct from the streets.
        </p>

        <div className="flex gap-4 mt-7">
          <TransitionLink
            to="/browse"
            className="inline-block font-heading text-sm uppercase tracking-widest px-7 py-3
                       bg-neon-green text-void border border-neon-green
                       hover:bg-transparent hover:text-neon-green
                       transition-all duration-300"
          >
            Browse Drops
          </TransitionLink>
          <TransitionLink
            to="/login"
            className="inline-block font-heading text-sm uppercase tracking-widest px-7 py-3
                       bg-transparent text-chalk border border-smoke/60
                       hover:border-neon-green hover:text-neon-green
                       transition-all duration-300"
          >
            Sign In
          </TransitionLink>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-dust/60 uppercase tracking-widest"
          style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-neon-green/60 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
