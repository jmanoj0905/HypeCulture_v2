import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useCart } from '@hooks/useCart'

const SCRAMBLE_CHARS = '0123456789'

function useScrambleCount(value: number) {
  const [display, setDisplay] = useState(String(value))
  const prevRef = useRef(value)

  useEffect(() => {
    if (value === prevRef.current) return
    prevRef.current = value

    const target = value > 9 ? '9+' : String(value)
    let frame = 0
    const totalFrames = 8
    const tick = () => {
      frame++
      if (frame >= totalFrames) {
        setDisplay(target)
        return
      }
      setDisplay(
        target
          .split('')
          .map((ch) =>
            /\d/.test(ch)
              ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
              : ch,
          )
          .join(''),
      )
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])

  return display
}

export function CartBadge() {
  const { count, openDrawer } = useCart()
  const iconRef = useRef<HTMLButtonElement>(null)
  const display = useScrambleCount(count)
  const prevCount = useRef(count)

  useEffect(() => {
    if (count > prevCount.current && iconRef.current) {
      gsap.fromTo(iconRef.current,
        { x: 0 },
        { x: 3, duration: 0.06, repeat: 5, yoyo: true, ease: 'none' },
      )
      gsap.fromTo(iconRef.current.querySelector('.cart-badge'),
        { scale: 1.4 },
        { scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.1 },
      )
    }
    prevCount.current = count
  }, [count])

  return (
    <button
      ref={iconRef}
      onClick={openDrawer}
      className="relative group"
      data-cursor="link"
      aria-label={`Cart with ${count} items`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.5" className="w-6 h-6 text-chalk group-hover:text-neon-green transition-colors duration-300">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      {count > 0 && (
        <span className="cart-badge absolute -top-2 -right-2.5 bg-neon-green text-void text-[10px] font-mono font-bold min-w-5 h-5 flex items-center justify-center px-1 tabular-nums">
          {display}
        </span>
      )}
    </button>
  )
}
