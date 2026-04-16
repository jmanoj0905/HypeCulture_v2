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
        <MagneticCursor />
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}
