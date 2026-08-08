import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={selectId} className="font-heading text-sm font-medium text-dust">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          bg-asphalt border border-smoke rounded-full px-5 py-3
          text-chalk font-body text-base outline-none cursor-pointer
          transition-colors duration-[750ms] ease-[cubic-bezier(0.65,0.05,0,1)]
          focus:border-chalk focus:bg-void
          ${error ? 'border-danger focus:border-danger' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-void text-chalk">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-danger text-sm font-heading">{error}</span>}
    </div>
  )
}
