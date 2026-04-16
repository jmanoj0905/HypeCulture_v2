import { DragGallery } from '@components/interactive/DragGallery'
import { TiltCard } from '@components/interactive/TiltCard'
import { ChapterLabel } from '@components/typography/ChapterLabel'
import { ScrambleText } from '@components/typography/ScrambleText'
import { PriceTag } from '@components/ui/PriceTag'
import { TransitionLink } from '@components/navigation/TransitionLink'

const featured = [
  { id: 1, name: 'Air Jordan 1 Retro High', brand: 'Nike', price: 189, image: '/images/products/1-air-jordan-1.jpg' },
  { id: 2, name: 'Yeezy Boost 350 V2', brand: 'Adidas', price: 230, image: '/images/products/2-yeezy-350.jpg' },
  { id: 3, name: 'Dunk Low Panda', brand: 'Nike', price: 120, image: '/images/products/3-dunk-low-panda.jpg' },
  { id: 4, name: 'New Balance 550', brand: 'New Balance', price: 110, image: '/images/products/4-nb-550.jpg' },
  { id: 5, name: 'Air Force 1 Low', brand: 'Nike', price: 100, image: '/images/products/5-air-force-1.jpg' },
  { id: 6, name: 'Ultra Boost', brand: 'Adidas', price: 180, image: '/images/products/8-ultra-boost.jpg' },
  { id: 7, name: 'Chuck Taylor 70', brand: 'Converse', price: 85, image: '/images/products/6-chuck-taylor.jpg' },
]

export function FeaturedScroll() {
  return (
    <section className="relative bg-void py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mb-12 flex items-end justify-between gap-6">
        <div>
          <ChapterLabel number="02" title="Trending" className="mb-5" />
          <h2 className="font-display text-6xl md:text-7xl text-white tracking-wider leading-none">
            <ScrambleText>MOST</ScrambleText>{' '}
            <span className="text-neon-green"><ScrambleText>WANTED.</ScrambleText></span>
          </h2>
        </div>
        <p className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-dust max-w-xs text-right">
          Drag · scroll · swipe<br />
          <span className="text-neon-green">/07</span>
        </p>
      </div>

      <DragGallery className="pl-6 lg:pl-10 pb-10">
        {featured.map((p, i) => (
          <TransitionLink
            key={p.id}
            to={`/product/${p.id}`}
            data-cursor="view"
            className="shrink-0 w-[300px] md:w-[340px] group"
          >
            <TiltCard className="block">
              <div className="relative aspect-[4/5] bg-asphalt border border-smoke/60 overflow-hidden transition-colors duration-500 group-hover:border-neon-green/50">
                <span className="absolute top-4 left-4 z-10 font-mono text-[10px] uppercase tracking-[0.3em] text-dust">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-105"
                  draggable={false}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent opacity-70 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-dust mb-1">{p.brand}</p>
                    <h3 className="font-heading text-base text-white leading-tight max-w-[180px]">{p.name}</h3>
                  </div>
                  <PriceTag amount={p.price} size="md" />
                </div>
              </div>
            </TiltCard>
          </TransitionLink>
        ))}
        <div className="shrink-0 w-6" />
      </DragGallery>
    </section>
  )
}
