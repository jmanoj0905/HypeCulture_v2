import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Animation = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn'

interface ScrollAnimationOptions {
  animation?: Animation
  start?: string
  end?: string
  scrub?: boolean | number
  stagger?: number
  duration?: number
  delay?: number
  childSelector?: string
}

const animationPresets: Record<Animation, gsap.TweenVars> = {
  fadeUp: { y: 40, opacity: 0 },
  fadeIn: { opacity: 0 },
  slideLeft: { x: 60, opacity: 0 },
  slideRight: { x: -60, opacity: 0 },
  scaleIn: { scale: 0.85, opacity: 0 },
}

export function useScrollAnimation<T extends HTMLElement>(options: ScrollAnimationOptions = {}) {
  const ref = useRef<T>(null)
  const {
    animation = 'fadeUp',
    start = 'top 85%',
    end = 'top 20%',
    scrub = false,
    stagger = 0,
    duration = 0.8,
    delay = 0,
    childSelector,
  } = options

  useGSAP(() => {
    if (!ref.current) return

    const targets = childSelector
      ? ref.current.querySelectorAll(childSelector)
      : ref.current

    gsap.from(targets, {
      ...animationPresets[animation],
      duration,
      delay,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: ref.current,
        start,
        end,
        scrub,
        once: !scrub,
      },
    })
  }, { scope: ref, dependencies: [animation, start, end, scrub, stagger, duration, delay, childSelector] })

  return ref
}
