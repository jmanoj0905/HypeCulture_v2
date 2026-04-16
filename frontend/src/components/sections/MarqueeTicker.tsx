import { Marquee } from '@components/typography/Marquee'

const ITEMS = [
  'JUST DROPPED',
  'AUTHENTICATED IN-HOUSE',
  '24-HOUR PAYOUT',
  'SS/26 CATALOG LIVE',
  'FREE SHIPPING OVER $200',
  'WORLDWIDE',
]

export function MarqueeTicker() {
  return (
    <div className="border-y border-smoke bg-void py-5 relative z-[1]">
      <Marquee duration={40}>
        {ITEMS.map((t, i) => (
          <span key={i} className="flex items-center gap-12 pr-12">
            <span className="font-display text-3xl tracking-[0.15em] text-white">{t}</span>
            <span className="text-neon-green text-2xl leading-none">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
