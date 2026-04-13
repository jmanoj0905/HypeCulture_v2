import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="font-heading text-sm uppercase tracking-wider text-dust">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          bg-void border-b-2 border-smoke px-0 py-2.5
          text-chalk font-body text-base outline-none cursor-pointer
          transition-colors duration-300
          focus:border-neon-green
          ${error ? 'border-danger' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-asphalt">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-danger text-sm">{error}</span>}
    </div>
  )
}
