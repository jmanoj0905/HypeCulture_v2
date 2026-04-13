import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-neon-green text-void hover:bg-transparent hover:text-neon-green border-neon-green',
  secondary: 'bg-transparent text-chalk border-smoke hover:border-neon-green hover:text-neon-green',
  danger: 'bg-danger text-white hover:bg-transparent hover:text-danger border-danger',
  ghost: 'bg-transparent text-dust hover:text-chalk border-transparent',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
}

export function Button({ variant = 'primary', size = 'md', children, loading, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`
        font-heading uppercase tracking-wider font-semibold border
        transition-all duration-300 ease-[var(--ease-out-expo)]
        active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : children}
    </button>
  )
}
