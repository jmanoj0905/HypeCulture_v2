import { useEffect, useRef } from 'react'
import { RouterProvider } from 'react-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AuthProvider } from '@context/AuthContext'
import { CartProvider } from '@context/CartContext'
import { Preloader } from '@components/system/Preloader'
import { MagneticCursor } from '@components/cursor/MagneticCursor'
import { router } from './router'

gsap.registerPlugin(ScrollTrigger)

function SkipLink() {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    ref.current?.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById('main-content')
      target?.focus()
      target?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [])

  return (
    <a
      ref={ref}
      href="#main-content"
      className="fixed top-4 left-4 z-[9999] px-4 py-2 bg-void border border-neon-green text-neon-green font-mono text-xs uppercase tracking-widest
        opacity-0 pointer-events-none focus:opacity-100 focus:pointer-events-auto transition-opacity"
    >
      Skip to content
    </a>
  )
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.08,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    const raf = () => {
      lenis.raf(performance.now())
    }

    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        <Preloader />
        <SkipLink />
        <MagneticCursor />
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}
