interface NeonDividerProps {
  color?: 'green' | 'pink' | 'cyan'
  className?: string
}

const colors = {
  green: 'from-transparent via-neon-green to-transparent',
  pink: 'from-transparent via-neon-pink to-transparent',
  cyan: 'from-transparent via-neon-cyan to-transparent',
}

export function NeonDivider({ color = 'green', className = '' }: NeonDividerProps) {
  return (
    <div className={`h-px bg-gradient-to-r ${colors[color]} opacity-50 ${className}`} />
  )
}
