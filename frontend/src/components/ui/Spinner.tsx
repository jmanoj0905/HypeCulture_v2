interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div className={`${sizes[size]} border-neon-green/30 border-t-neon-green rounded-full animate-spin ${className}`} />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-void">
      <Spinner size="lg" />
    </div>
  )
}
