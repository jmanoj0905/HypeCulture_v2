import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  suffix?: string
  label: string
  decimals?: number
}

const STATS: Stat[] = [
  { value: 14238, label: 'pairs sold this year' },
  { value: 98.6, suffix: '%', decimals: 1, label: 'authentication rate' },
  { value: 24, suffix: 'h', label: 'to seller payout' },
  { value: 97, suffix: '+', label: 'countries shipped' },
]

function useCountUp(target: number, active: boolean, decimals = 0, duration = 1600) {
  const [val, setVal] = useState(0)
  const rafRef = useRef<number>(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      setVal(target * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, active, duration])
  const formatted = decimals > 0
    ? val.toFixed(decimals)
    : Math.round(val).toLocaleString()
  return formatted
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const display = useCountUp(stat.value, active, stat.decimals ?? 0)
  return (
    <div className="flex flex-col gap-3 border-t border-smoke pt-6">
      <div className="flex items-baseline gap-1 flex-nowrap whitespace-nowrap overflow-hidden">
        <span className="font-display text-5xl sm:text-6xl lg:text-8xl text-white leading-none tracking-wider tabular-nums">
          {display}
        </span>
        {stat.suffix && (
          <span className="font-display text-2xl sm:text-3xl lg:text-5xl text-neon-green leading-none">
            {stat.suffix}
          </span>
        )}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dust leading-snug">{stat.label}</span>
    </div>
  )
}

export function StatsCounter() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setActive(true)
        io.disconnect()
      }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-28 lg:py-36 bg-void">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        {STATS.map((s) => (
          <StatItem key={s.label} stat={s} active={active} />
        ))}
      </div>
    </section>
  )
}
