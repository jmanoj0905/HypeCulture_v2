import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChapterLabel } from '@components/typography/ChapterLabel'
import { ScrambleText } from '@components/typography/ScrambleText'
import { TransitionLink } from '@components/navigation/TransitionLink'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    id: 1,
    name: 'Sneakers',
    tag: 'Jordan · Dunk · Air Max',
    count: '2,481 pairs',
    letter: 'S',
    image: '/images/products/1-air-jordan-1.jpg',
    span: 'lg:col-span-7 lg:row-span-2',
  },
  {
    id: 2,
    name: 'Boots',
    tag: 'Timberland · Dr. Martens',
    count: '412 pairs',
    letter: 'B',
    image: '/images/products/7-timberland.jpg',
    span: 'lg:col-span-5 lg:row-span-1',
  },
  {
    id: 3,
    name: 'Running',
    tag: 'Ultra Boost · Gel-Kayano',
    count: '680 pairs',
    letter: 'R',
    image: '/images/products/8-ultra-boost.jpg',
    span: 'lg:col-span-5 lg:row-span-1',
  },
]

export function CategoryGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.cat-card', gridRef.current)
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 75%',
        once: true,
      },
    })
  }, { scope: gridRef })

  return (
    <section className="py-28 lg:py-36 bg-void">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <ChapterLabel number="04" title="Shop" className="mb-5" />
            <h2 className="font-display text-6xl md:text-7xl text-white tracking-wider leading-none">
              <ScrambleText>BY</ScrambleText>{' '}
              <span className="text-neon-green"><ScrambleText>CATEGORY.</ScrambleText></span>
            </h2>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:auto-rows-[340px]"
        >
          {categories.map((c) => (
            <TransitionLink
              key={c.id}
              to={`/browse/${c.id}`}
              data-cursor="view"
              className={`cat-card group relative overflow-hidden border border-smoke/60 bg-asphalt
                          transition-colors duration-500 hover:border-neon-green/60 ${c.span}`}
            >
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover opacity-25 transition-all duration-700 ease-[var(--ease-out-quart)] group-hover:opacity-40 group-hover:scale-105"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-void via-void/80 to-transparent pointer-events-none" />

              {/* Giant letter */}
              <span className="absolute -bottom-8 -right-4 font-display text-[18rem] lg:text-[22rem] leading-none text-smoke/40 select-none transition-all duration-700 ease-[var(--ease-out-quart)] group-hover:text-neon-green/30 group-hover:-translate-x-3">
                {c.letter}
              </span>

              <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dust">
                    {c.count}
                  </span>
                  <span className="font-mono text-sm text-chalk opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    →
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none mb-3 transition-colors duration-300 group-hover:text-neon-green">
                    {c.name.toUpperCase()}
                  </h3>
                  <p className="font-body text-sm text-dust">{c.tag}</p>
                </div>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  )
}
