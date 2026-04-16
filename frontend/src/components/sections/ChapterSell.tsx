import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterLabel } from '@components/typography/ChapterLabel'
import { MagneticButton } from '@components/interactive/MagneticButton'
import { TransitionLink } from '@components/navigation/TransitionLink'

gsap.registerPlugin(ScrollTrigger)

const PERKS = [
  'List in under 60 seconds',
  'Reach 90k active buyers monthly',
  'Get paid within 24 hours of delivery',
  'Zero listing fees',
  'Authentication handled for you',
]

export function ChapterSell() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const el = headlineRef.current
    if (!el) return
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: 'power4.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
    })
    const items = gsap.utils.toArray<HTMLElement>('.perk-row', sectionRef.current)
    gsap.from(items, {
      x: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 bg-void overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-2">
          <div className="sticky top-28">
            <ChapterLabel number="05" title="Sell" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2
              ref={headlineRef}
              className="font-display leading-[0.82] tracking-wider"
              style={{ fontSize: 'clamp(4rem, 11vw, 11rem)' }}
            >
              <span className="block text-white">GOT</span>
              <span className="block text-white">HEAT?</span>
              <span className="block text-neon-green">LIST IT.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-1 lg:pt-12">
            {PERKS.map((p, i) => (
              <div
                key={p}
                className="perk-row flex items-center justify-between border-b border-smoke/60 py-5"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-[10px] text-dust tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-heading text-base md:text-lg uppercase tracking-[0.15em] text-white">
                    {p}
                  </span>
                </div>
                <span className="font-mono text-neon-green">✓</span>
              </div>
            ))}
            <div className="mt-10">
              <MagneticButton as="div">
                <TransitionLink
                  to="/login"
                  data-cursor="buy"
                  className="inline-block font-heading text-xs uppercase tracking-[0.3em] px-10 py-5
                             bg-neon-green text-void border border-neon-green
                             hover:bg-transparent hover:text-neon-green
                             transition-colors duration-300"
                >
                  Start selling →
                </TransitionLink>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
