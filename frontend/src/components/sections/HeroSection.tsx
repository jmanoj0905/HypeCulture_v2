import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { FluidRevealEffect } from '@components/effects/FluidRevealEffect'
import { MagneticButton } from '@components/interactive/MagneticButton'
import { ScrambleText } from '@components/typography/ScrambleText'

gsap.registerPlugin(ScrollTrigger)

const SneakerScene = lazy(() =>
  import('@three/SneakerScene').then((m) => ({ default: m.SneakerScene }))
)

const WORDS = ['HYPE', 'CULTURE', 'UNDER', 'GROUND']

function useClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
  const clock = useClock()

  useGSAP(() => {
    if (!sectionRef.current) return

    // Per-word kinetic stagger in on mount
    if (wordsRef.current) {
      const lines = wordsRef.current.querySelectorAll('.word-line')
      gsap.from(lines, {
        yPercent: 110,
        opacity: 0,
        duration: 1.0,
        ease: 'power4.out',
        stagger: 0.08,
        delay: 0.2,
      })
    }

    // Scroll-scrubbed parallax out
    gsap.to([textRef.current, metaRef.current], {
      opacity: 0,
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })

    gsap.to(canvasWrapRef.current, {
      scale: 1.08,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
  }, { scope: sectionRef })

  const hh = String(clock.getHours()).padStart(2, '0')
  const mm = String(clock.getMinutes()).padStart(2, '0')
  const ss = String(clock.getSeconds()).padStart(2, '0')

  return (
    <section ref={sectionRef} className="relative h-[100svh] overflow-hidden bg-void">

      {/* Fluid reveal */}
      <div className="absolute inset-0 z-0">
        <FluidRevealEffect
          options={{ cursor_size: 28, mouse_force: 70, dissipation: 0.94 }}
        />
      </div>

      {/* Left scrim */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(100deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.55) 40%, rgba(10,10,10,0.1) 72%, rgba(10,10,10,0) 100%)',
        }}
      />

      {/* 3D sneaker — right 60% */}
      <div
        ref={canvasWrapRef}
        className="absolute top-0 right-0 h-full z-[2] hidden lg:block"
        style={{ width: '60%', pointerEvents: 'none', willChange: 'transform' }}
      >
        <Suspense fallback={null}>
          <SneakerScene scrollSection={sectionRef} />
        </Suspense>
      </div>

      {/* Top meta strip */}
      <div
        ref={metaRef}
        className="absolute top-20 left-0 right-0 z-10 px-6 lg:px-10 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-dust pointer-events-none"
      >
        <div className="flex flex-col gap-1">
          <span className="text-neon-green">◉ LIVE FEED</span>
          <span>N 40°44'21" / W 73°59'11"</span>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="text-chalk tabular-nums">{hh}:{mm}:<span className="text-neon-green">{ss}</span></span>
          <span>SS/26 · CATALOG 01</span>
        </div>
      </div>

      {/* Mega kinetic type — bottom-left */}
      <div
        ref={textRef}
        className="absolute bottom-0 left-0 z-10 w-full px-6 lg:px-10 pb-14 lg:pb-20 flex items-end justify-between gap-8 pointer-events-none"
      >
        <div className="flex-1 max-w-full xl:max-w-[72%]">
          <div
            ref={wordsRef}
            className="overflow-hidden"
          >
            {WORDS.map((w, i) => (
              <div key={w} className="overflow-hidden">
                <h1
                  className={`word-line font-display leading-[0.82] tracking-wider whitespace-nowrap ${
                    i === 1 ? 'text-neon-green' : 'text-white'
                  }`}
                  style={{ fontSize: 'clamp(3rem, 9vw, 9rem)', willChange: 'transform' }}
                >
                  {w}
                </h1>
              </div>
            ))}
          </div>

          <p className="font-body text-dust mt-6 text-base max-w-sm pointer-events-auto">
            The authenticated resell market. Buy direct from verified sellers, sell to a global audience, get paid within 24 hours.
          </p>

          <div className="flex gap-3 mt-7 pointer-events-auto">
            <MagneticButton as="div" className="inline-block">
              <TransitionLink
                to="/browse"
                data-cursor="buy"
                className="inline-block font-heading text-xs uppercase tracking-[0.25em] px-8 py-4
                           bg-neon-green text-void border border-neon-green
                           hover:bg-transparent hover:text-neon-green
                           transition-colors duration-300"
              >
                Browse Drops →
              </TransitionLink>
            </MagneticButton>
            <MagneticButton as="div" className="inline-block">
              <TransitionLink
                to="/login"
                data-cursor="link"
                className="inline-block font-heading text-xs uppercase tracking-[0.25em] px-8 py-4
                           bg-transparent text-chalk border border-smoke/60
                           hover:border-neon-green hover:text-neon-green
                           transition-colors duration-300"
              >
                Sign In
              </TransitionLink>
            </MagneticButton>
          </div>
        </div>

        {/* Right rail — stats */}
        <div className="hidden xl:flex flex-col items-end gap-4 pb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-dust pointer-events-auto shrink-0">
          <div className="text-right">
            <div className="text-neon-green tabular-nums text-3xl font-display tracking-wider">14,238</div>
            <div className="mt-1">pairs sold · ytd</div>
          </div>
          <div className="w-10 h-px bg-smoke" />
          <ScrambleText as="span" trigger="inview" duration={1400} className="text-chalk">
            AUTHENTICATED IN-HOUSE
          </ScrambleText>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span
          className="font-mono text-[10px] text-dust/60 uppercase tracking-[0.3em]"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll ↓
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-neon-green/60 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
