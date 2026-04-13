import type { ElementType, ReactNode } from 'react'

interface NeonTextProps {
  children: ReactNode
  as?: ElementType
  color?: 'green' | 'pink' | 'cyan' | 'yellow'
  className?: string
  glow?: boolean
}

const colorMap = {
  green: { text: 'text-neon-green', shadow: '0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.2)' },
  pink: { text: 'text-neon-pink', shadow: '0 0 20px rgba(255,45,123,0.5), 0 0 40px rgba(255,45,123,0.2)' },
  cyan: { text: 'text-neon-cyan', shadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)' },
  yellow: { text: 'text-neon-yellow', shadow: '0 0 20px rgba(240,255,0,0.5), 0 0 40px rgba(240,255,0,0.2)' },
}

export function NeonText({ children, as: Tag = 'span', color = 'green', className = '', glow = true }: NeonTextProps) {
  const { text, shadow } = colorMap[color]

  return (
    <Tag
      className={`${text} ${className}`}
      style={glow ? { textShadow: shadow } : undefined}
    >
      {children}
    </Tag>
  )
}
