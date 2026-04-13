import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollRevealText } from '@components/typography/ScrollRevealText'
import { NeonDivider } from '@components/ui/NeonDivider'
import { PriceTag } from '@components/ui/PriceTag'
import { TransitionLink } from '@components/navigation/TransitionLink'

gsap.registerPlugin(ScrollTrigger)

// Mock featured products (replaced by API data later)
const featured = [
  { id: 1, name: 'Air Jordan 1 Retro High', brand: 'Nike', price: 189, image: '/images/products/1-air-jordan-1.jpg' },
  { id: 2, name: 'Yeezy Boost 350 V2', brand: 'Adidas', price: 230, image: '/images/products/2-yeezy-350.jpg' },
  { id: 3, name: 'Dunk Low Panda', brand: 'Nike', price: 120, image: '/images/products/3-dunk-low-panda.jpg' },
  { id: 4, name: 'New Balance 550', brand: 'New Balance', price: 110, image: '/images/products/4-nb-550.jpg' },
  { id: 5, name: 'Air Force 1 Low', brand: 'Nike', price: 100, image: '/images/products/5-air-force-1.jpg' },
]

export function FeaturedScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return

    const cards = gsap.utils.toArray<HTMLElement>('.featured-card', trackRef.current)
    const totalWidth = trackRef.current.scrollWidth - containerRef.current.offsetWidth

    gsap.to(trackRef.current, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    // Staggered card entrance
    cards.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: card,
          containerAnimation: gsap.getById?.('featured-scroll') ?? undefined,
          start: 'left 80%',
          once: true,
        },
      })
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative bg-void overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <ScrollRevealText as="h2" className="font-display text-6xl text-white tracking-wider">
          TRENDING NOW
        </ScrollRevealText>
        <NeonDivider className="mt-4 mb-8" />
      </div>

      <div ref={trackRef} className="flex gap-6 px-6 pb-20" style={{ width: 'max-content' }}>
        {featured.map((product) => (
          <TransitionLink
            key={product.id}
            to={`/product/${product.id}`}
            className="featured-card flex-shrink-0 w-80 group"
          >
            <div className="relative bg-asphalt border border-smoke overflow-hidden
                            transition-all duration-300 ease-[var(--ease-out-expo)]
                            group-hover:border-neon-green/50
                            group-hover:shadow-[0_0_30px_rgba(57,255,20,0.1)]">
              {/* Image placeholder */}
              <div className="h-72 bg-concrete flex items-center justify-center
                              transition-transform duration-500 ease-[var(--ease-out-expo)]
                              group-hover:scale-105">
                <span className="font-display text-4xl text-smoke/50 tracking-wider">
                  {product.brand.charAt(0)}
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="font-mono text-xs text-dust uppercase">{product.brand}</p>
                <h3 className="font-heading text-lg text-white mt-1 leading-tight">{product.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <PriceTag amount={product.price} size="md" />
                  <span className="font-mono text-xs text-dust opacity-0 translate-y-2
                                   group-hover:opacity-100 group-hover:translate-y-0
                                   transition-all duration-300">
                    View &rarr;
                  </span>
                </div>
              </div>
            </div>
          </TransitionLink>
        ))}
      </div>
    </section>
  )
}
