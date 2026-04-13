import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="font-heading text-sm uppercase tracking-wider text-dust">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          bg-transparent border-b-2 border-smoke px-0 py-2.5
          text-chalk font-body text-base outline-none
          transition-colors duration-300
          focus:border-neon-green
          placeholder:text-smoke
          ${error ? 'border-danger' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-danger text-sm">{error}</span>}
    </div>
  )
}
