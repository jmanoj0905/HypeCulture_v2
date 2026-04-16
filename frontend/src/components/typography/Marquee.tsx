import { type ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  direction?: 'ltr' | 'rtl'
  duration?: number
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  children,
  direction = 'ltr',
  duration = 35,
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden relative ${className}`}
      style={
        {
          ['--marquee-duration' as string]: `${duration}s`,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        if (pauseOnHover) e.currentTarget.style.setProperty('--marquee-state', 'paused')
      }}
      onMouseLeave={(e) => {
        if (pauseOnHover) e.currentTarget.style.setProperty('--marquee-state', 'running')
      }}
    >
      <div className="marquee-track" data-dir={direction}>
        <div className="flex items-center shrink-0 pr-12">{children}</div>
        <div aria-hidden className="flex items-center shrink-0 pr-12">{children}</div>
      </div>
    </div>
  )
}
