import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ClipPathRevealOptions {
  trigger?: 'hover' | 'scroll'
  duration?: number
}

export function useClipPathReveal<T extends HTMLElement>(options: ClipPathRevealOptions = {}) {
  const ref = useRef<T>(null)
  const { trigger = 'hover', duration = 0.6 } = options

  useGSAP(() => {
    if (!ref.current) return

    if (trigger === 'scroll') {
      gsap.fromTo(ref.current,
        { clipPath: 'ellipse(0% 0% at 50% 50%)' },
        {
          clipPath: 'ellipse(100% 100% at 50% 50%)',
          duration,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
      return
    }

    // Hover mode: set initial state, add event listeners
    const el = ref.current
    gsap.set(el, { clipPath: 'ellipse(0% 0% at 50% 50%)' })

    const onEnter = () => {
      gsap.to(el, {
        clipPath: 'ellipse(100% 100% at 50% 50%)',
        duration,
        ease: 'expo.out',
        overwrite: true,
      })
    }

    const onLeave = () => {
      gsap.to(el, {
        clipPath: 'ellipse(0% 0% at 50% 50%)',
        duration: duration * 0.6,
        ease: 'power2.in',
        overwrite: true,
      })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, { scope: ref, dependencies: [trigger, duration] })

  return ref
}
