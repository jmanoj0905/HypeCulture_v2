import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SplitTextAnimationOptions {
  trigger?: 'scroll' | 'load'
  staggerDelay?: number
  duration?: number
}

export function useSplitTextAnimation<T extends HTMLElement>(options: SplitTextAnimationOptions = {}) {
  const ref = useRef<T>(null)
  const {
    trigger = 'scroll',
    staggerDelay = 0.03,
    duration = 0.6,
  } = options

  useGSAP(() => {
    if (!ref.current) return

    const chars = ref.current.querySelectorAll('.split-char')
    if (!chars.length) return

    const fromVars: gsap.TweenVars = {
      yPercent: 100,
      opacity: 0,
      duration,
      ease: 'power3.out',
      stagger: staggerDelay,
    }

    if (trigger === 'scroll') {
      gsap.from(chars, {
        ...fromVars,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      })
    } else {
      gsap.from(chars, fromVars)
    }
  }, { scope: ref, dependencies: [trigger, staggerDelay, duration] })

  return ref
}
