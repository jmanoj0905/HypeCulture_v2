import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="font-heading text-sm font-medium text-dust">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          bg-asphalt border border-smoke rounded-full px-5 py-3
          text-chalk font-body text-base outline-none
          transition-colors duration-[750ms] ease-[cubic-bezier(0.65,0.05,0,1)]
          focus:border-chalk focus:bg-void
          placeholder:text-dust/60
          ${error ? 'border-danger focus:border-danger' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-danger text-sm font-heading">{error}</span>}
    </div>
  )
}
