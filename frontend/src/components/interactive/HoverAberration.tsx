interface HoverAberrationProps {
  children: string
  className?: string
}

/** String wrapped in a span that renders RGB-split layers on hover via CSS. */
export function HoverAberration({ children, className = '' }: HoverAberrationProps) {
  return (
    <span className={`aberration-target ${className}`} data-text={children}>
      {children}
    </span>
  )
}
