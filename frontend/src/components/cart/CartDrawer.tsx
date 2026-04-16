import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCart } from '@hooks/useCart'
import { CartDrawerItem } from './CartDrawerItem'
import { MagneticButton } from '@components/interactive/MagneticButton'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { PriceTag } from '@components/ui/PriceTag'

export function CartDrawer() {
  const { items, subtotal, count, drawerOpen, closeDrawer } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!panelRef.current || !overlayRef.current) return
    if (drawerOpen) {
      gsap.set(panelRef.current, { display: 'flex' })
      gsap.set(overlayRef.current, { display: 'block' })
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.to(panelRef.current, { x: 0, duration: 0.5, ease: 'power4.out' })
      if (contentRef.current) {
        const rows = contentRef.current.querySelectorAll('.drawer-item')
        gsap.from(rows, { x: 40, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.15 })
      }
    } else {
      gsap.to(panelRef.current, { x: '100%', duration: 0.4, ease: 'power3.in', onComplete: () => { gsap.set(panelRef.current, { display: 'none' }) } })
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: () => { gsap.set(overlayRef.current, { display: 'none' }) } })
    }
  }, { dependencies: [drawerOpen] })

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen, closeDrawer])

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeDrawer}
        className="fixed inset-0 z-[70] bg-void/60 backdrop-blur-sm"
        style={{ display: 'none', opacity: 0 }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 z-[71] w-full sm:w-[420px] bg-asphalt border-l border-smoke/60 flex-col hidden"
        style={{ transform: 'translateX(100%)', willChange: 'transform' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-smoke/40">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-3xl text-white tracking-wider">CART</h2>
            <span className="font-mono text-[10px] text-dust tracking-[0.3em] uppercase">
              {count} {count === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            data-cursor="link"
            className="font-mono text-xs text-dust hover:text-neon-green transition-colors uppercase tracking-[0.3em]"
          >
            Close ✕
          </button>
        </div>

        {/* Items */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <span className="font-display text-8xl text-smoke/30 leading-none">0</span>
              <p className="font-mono text-xs text-dust uppercase tracking-[0.3em]">Nothing here yet</p>
              <MagneticButton as="div">
                <TransitionLink
                  to="/browse"
                  onClick={closeDrawer}
                  data-cursor="view"
                  className="inline-block font-heading text-xs uppercase tracking-[0.25em] px-6 py-3 border border-neon-green text-neon-green hover:bg-neon-green hover:text-void transition-colors"
                >
                  Browse Drops
                </TransitionLink>
              </MagneticButton>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <CartDrawerItem key={item.cartItemId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-smoke/40 px-6 py-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dust">Subtotal</span>
              <PriceTag amount={subtotal} size="lg" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dust">Shipping</span>
              <span className="font-mono text-xs text-neon-green">FREE</span>
            </div>
            <div className="w-full h-px bg-smoke/40" />
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm uppercase tracking-[0.2em] text-white">Total</span>
              <PriceTag amount={subtotal} size="lg" />
            </div>
            <MagneticButton as="div" className="w-full">
              <TransitionLink
                to="/checkout"
                onClick={closeDrawer}
                data-cursor="buy"
                className="block w-full text-center font-heading text-xs uppercase tracking-[0.3em] px-6 py-4 bg-neon-green text-void border border-neon-green hover:bg-transparent hover:text-neon-green transition-colors"
              >
                Checkout →
              </TransitionLink>
            </MagneticButton>
            <TransitionLink
              to="/cart"
              onClick={closeDrawer}
              data-cursor="link"
              className="block text-center font-mono text-[10px] uppercase tracking-[0.3em] text-dust hover:text-neon-green transition-colors"
            >
              View full cart
            </TransitionLink>
          </div>
        )}
      </div>
    </>
  )
}
