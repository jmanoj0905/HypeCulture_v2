import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterLabel } from '@components/typography/ChapterLabel'
import { ScrambleText } from '@components/typography/ScrambleText'
import { TransitionLink } from '@components/navigation/TransitionLink'

gsap.registerPlugin(ScrollTrigger)

export function ChapterDrop() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!imgRef.current) return
    gsap.fromTo(imgRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      },
    )
    gsap.to(imgRef.current.querySelector('img'), {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative bg-void py-32 lg:py-40 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-12 gap-6">
        {/* Sidelabel */}
        <div className="col-span-12 lg:col-span-2">
          <div className="sticky top-28">
            <ChapterLabel number="01" title="The Drop" />
          </div>
        </div>

        {/* Copy */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <h2 className="font-display text-6xl md:text-8xl leading-[0.85] text-white tracking-wider">
            <ScrambleText>WHAT</ScrambleText>
            <br />
            <ScrambleText>DROPS</ScrambleText>
            <br />
            <span className="text-neon-green"><ScrambleText>TODAY.</ScrambleText></span>
          </h2>
          <p className="font-body text-dust text-lg max-w-md leading-relaxed">
            From Jordan retros to limited Yeezys, every pair listed is verified by our authentication team before it leaves the seller's hands. No fakes. No guesswork.
          </p>
          <TransitionLink
            to="/browse"
            data-cursor="view"
            className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-neon-green w-fit mt-4"
          >
            <span className="relative">
              View today's drops
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-neon-green" />
            </span>
            <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
          </TransitionLink>
        </div>

        {/* Image */}
        <div className="col-span-12 lg:col-span-5">
          <div
            ref={imgRef}
            className="relative aspect-[4/5] bg-asphalt overflow-hidden border border-smoke/40"
          >
            <img
              src="/images/products/1-air-jordan-1.jpg"
              alt="Featured drop"
              className="w-full h-full object-cover"
              style={{ willChange: 'transform' }}
              onError={(e) => {
                const img = e.currentTarget
                img.style.display = 'none'
                const parent = img.parentElement
                if (parent) {
                  const fallback = parent.querySelector('[data-fallback]') as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }
              }}
            />
            <div
              data-fallback
              className="absolute inset-0 hidden items-center justify-center"
            >
              <span className="font-display text-[14rem] text-smoke/30 leading-none">J</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-green">AJ1 / RETRO HIGH</span>
              <span className="font-display text-2xl text-price">$189</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
