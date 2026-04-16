import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterLabel } from '@components/typography/ChapterLabel'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { n: '01', t: 'Seller ships to HQ', d: 'Every listing routes through our New York authentication hub.' },
  { n: '02', t: 'Experts inspect', d: '38 checkpoints: stitching, sole pattern, colorway, box, tags, smell.' },
  { n: '03', t: 'We ship to you', d: 'Authenticated. Tagged. Sealed. In your hands in under 5 days.' },
]

export function ChapterAuth() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const steps = gsap.utils.toArray<HTMLElement>('.auth-step', sectionRef.current)
    gsap.from(steps, {
      x: -40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative bg-asphalt py-32 lg:py-44 border-y border-smoke/40 overflow-hidden">
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.04]">
        <span className="font-display text-[32rem] leading-none text-neon-green">✓</span>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-6 relative">
        <div className="col-span-12 lg:col-span-2">
          <div className="sticky top-28">
            <ChapterLabel number="03" title="Authenticity" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <h2 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-wider text-white">
            ZERO
            <br />
            <span className="text-neon-green">FAKES.</span>
            <br />
            EVER.
          </h2>
          <p className="font-body text-dust text-lg mt-6 max-w-md leading-relaxed">
            We authenticate every pair in-house before it reaches a buyer. If it doesn't pass, the seller pays — not you.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col divide-y divide-smoke/50">
          {STEPS.map((s) => (
            <div key={s.n} className="auth-step flex gap-6 py-8 first:pt-0 last:pb-0">
              <span className="font-mono text-xs text-neon-green tracking-[0.3em] pt-1">{s.n}</span>
              <div className="flex-1">
                <h3 className="font-display text-3xl text-white tracking-wider mb-2">{s.t.toUpperCase()}</h3>
                <p className="font-body text-dust">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
