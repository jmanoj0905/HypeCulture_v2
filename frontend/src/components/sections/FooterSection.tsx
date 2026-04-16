import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { Marquee } from '@components/typography/Marquee'

gsap.registerPlugin(ScrollTrigger)

function useUTCClock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export function FooterSection() {
  const ref = useRef<HTMLElement>(null)
  const giantRef = useRef<HTMLDivElement>(null)
  const clock = useUTCClock()

  useGSAP(() => {
    if (!giantRef.current) return
    gsap.fromTo(giantRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      },
    )
  }, { scope: ref })

  const hh = String(clock.getUTCHours()).padStart(2, '0')
  const mm = String(clock.getUTCMinutes()).padStart(2, '0')
  const ss = String(clock.getUTCSeconds()).padStart(2, '0')

  return (
    <footer ref={ref} className="relative bg-void border-t border-smoke/40 overflow-hidden">
      <div className="border-b border-smoke py-4">
        <Marquee duration={50}>
          <span className="flex items-center gap-10 pr-10 font-mono text-xs uppercase tracking-[0.4em] text-dust">
            <span>HYPECULTURE © SS/26</span>
            <span className="text-neon-green">●</span>
            <span>AUTHENTICATED IN-HOUSE</span>
            <span className="text-neon-green">●</span>
            <span>SHIPPING WORLDWIDE</span>
            <span className="text-neon-green">●</span>
            <span>BUILT IN NYC</span>
            <span className="text-neon-green">●</span>
          </span>
        </Marquee>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-20 pb-10 grid grid-cols-2 md:grid-cols-4 gap-10">
        <Col title="Shop">
          <FLink to="/browse">All Drops</FLink>
          <FLink to="/browse/1">Sneakers</FLink>
          <FLink to="/browse/2">Boots</FLink>
          <FLink to="/browse/3">Running</FLink>
        </Col>
        <Col title="Account">
          <FLink to="/login">Sign In</FLink>
          <FLink to="/cart">Cart</FLink>
          <FLink to="/orders">Orders</FLink>
        </Col>
        <Col title="Sell">
          <FLink to="/login">Seller Portal</FLink>
          <FLink to="/seller/new-listing">List a Pair</FLink>
          <FLink to="/seller/inventory">Inventory</FLink>
        </Col>
        <Col title="Coordinates">
          <div className="font-mono text-xs text-dust">N 40°44'21"</div>
          <div className="font-mono text-xs text-dust">W 73°59'11"</div>
          <div className="font-mono text-xs text-neon-green tabular-nums mt-2">
            UTC {hh}:{mm}:{ss}
          </div>
        </Col>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pb-6">
        <div
          ref={giantRef}
          className="font-display tracking-tighter leading-[0.82] text-white select-none"
          style={{ fontSize: 'clamp(4rem, 20vw, 22rem)', willChange: 'clip-path' }}
        >
          HYPE<span className="text-neon-green">·</span>CULTURE
        </div>
      </div>

      <div className="border-t border-smoke/40 px-6 lg:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-dust">
          © 2024–26 HYPECULTURE. All rights reserved.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-dust">
          Built with React · Three.js · GSAP · Tailwind
        </p>
      </div>
    </footer>
  )
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-mono text-[10px] uppercase tracking-[0.35em] text-neon-green mb-2">{title}</h4>
      {children}
    </div>
  )
}

function FLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <TransitionLink
      to={to}
      data-cursor="link"
      className="font-heading text-sm uppercase tracking-[0.15em] text-chalk hover:text-neon-green transition-colors duration-300 w-fit"
    >
      {children}
    </TransitionLink>
  )
}
