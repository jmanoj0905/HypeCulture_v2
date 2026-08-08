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
  primary: 'bg-neon-green text-chalk border-neon-green hover:bg-chalk hover:text-neon-green hover:border-chalk',
  secondary: 'bg-transparent text-chalk border-chalk hover:bg-chalk hover:text-void',
  danger: 'bg-danger text-void border-danger hover:bg-transparent hover:text-danger',
  ghost: 'bg-transparent text-dust border-transparent hover:text-chalk',
}

const sizes: Record<Size, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-3 text-base',
  lg: 'px-10 py-4 text-lg',
}

export function Button({ variant = 'primary', size = 'md', children, loading, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`
        font-heading font-bold rounded-full border
        transition-colors duration-[750ms] ease-[cubic-bezier(0.65,0.05,0,1)]
        active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading
        </span>
      ) : children}
    </button>
  )
}
