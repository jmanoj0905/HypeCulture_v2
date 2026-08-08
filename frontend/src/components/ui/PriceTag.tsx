interface PriceTagProps {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-sm px-2.5 py-0.5',
  md: 'text-lg px-3 py-1',
  lg: 'text-3xl px-5 py-2',
}

export function PriceTag({ amount, size = 'md', className = '' }: PriceTagProps) {
  return (
    <span className={`inline-flex items-center font-heading font-bold bg-neon-green text-chalk rounded-full ${sizes[size]} ${className}`}>
      ${amount.toFixed(2)}
    </span>
  )
}
