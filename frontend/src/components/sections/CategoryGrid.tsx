import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollRevealText } from '@components/typography/ScrollRevealText'
import { NeonDivider } from '@components/ui/NeonDivider'
import { TransitionLink } from '@components/navigation/TransitionLink'
import angularMask from '@assets/masks/angular-cut.svg'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  { id: 1, name: 'Sneakers', description: 'Jordan, Dunk, Air Max', accent: 'neon-green' },
  { id: 2, name: 'Boots', description: 'Timberland, Dr. Martens', accent: 'neon-pink' },
  { id: 3, name: 'Running', description: 'Ultra Boost, Gel-Kayano', accent: 'neon-cyan' },
  { id: 4, name: 'Casual', description: 'Vans, Converse, NB 550', accent: 'neon-yellow' },
]

const accentColors: Record<string, string> = {
  'neon-green': 'group-hover:border-neon-green/60 group-hover:shadow-[0_0_40px_rgba(57,255,20,0.12)]',
  'neon-pink': 'group-hover:border-neon-pink/60 group-hover:shadow-[0_0_40px_rgba(255,45,123,0.12)]',
  'neon-cyan': 'group-hover:border-neon-cyan/60 group-hover:shadow-[0_0_40px_rgba(0,240,255,0.12)]',
  'neon-yellow': 'group-hover:border-neon-yellow/60 group-hover:shadow-[0_0_40px_rgba(240,255,0,0.12)]',
}

const accentText: Record<string, string> = {
  'neon-green': 'group-hover:text-neon-green',
  'neon-pink': 'group-hover:text-neon-pink',
  'neon-cyan': 'group-hover:text-neon-cyan',
  'neon-yellow': 'group-hover:text-neon-yellow',
}

export function CategoryGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!gridRef.current) return

    const cards = gsap.utils.toArray<HTMLElement>('.cat-card', gridRef.current)
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        once: true,
      },
    })
  }, { scope: gridRef })

  return (
    <section className="py-24 bg-void">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollRevealText as="h2" className="font-display text-6xl text-white tracking-wider">
          SHOP BY CATEGORY
        </ScrollRevealText>
        <NeonDivider color="pink" className="mt-4 mb-12" />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <TransitionLink
              key={cat.id}
              to={`/browse/${cat.id}`}
              className="cat-card group"
            >
              <div
                className={`relative h-64 bg-asphalt border border-smoke overflow-hidden
                            transition-all duration-500 ease-[var(--ease-out-expo)]
                            ${accentColors[cat.accent]}`}
                style={{
                  maskImage: `url(${angularMask})`,
                  WebkitMaskImage: `url(${angularMask})`,
                  maskSize: 'cover',
                  WebkitMaskSize: 'cover',
                }}
              >
                {/* Background letter */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-display text-[12rem] text-smoke/20 leading-none select-none
                                   transition-transform duration-700 ease-[var(--ease-out-expo)]
                                   group-hover:scale-110">
                    {cat.name.charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className={`font-display text-4xl text-white tracking-wider
                                  transition-colors duration-300 ${accentText[cat.accent]}`}>
                    {cat.name}
                  </h3>
                  <p className="font-body text-sm text-dust mt-1">{cat.description}</p>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-6 right-6 opacity-0 translate-x-4
                                group-hover:opacity-100 group-hover:translate-x-0
                                transition-all duration-300">
                  <span className="font-mono text-sm text-dust">&rarr;</span>
                </div>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  )
}
