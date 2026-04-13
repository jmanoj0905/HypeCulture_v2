interface PriceTagProps {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-3xl',
}

export function PriceTag({ amount, size = 'md', className = '' }: PriceTagProps) {
  return (
    <span className={`font-mono font-bold text-neon-green ${sizes[size]} ${className}`}>
      ${amount.toFixed(2)}
    </span>
  )
}
