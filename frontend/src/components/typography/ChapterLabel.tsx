interface ChapterLabelProps {
  number: string
  title: string
  className?: string
}

export function ChapterLabel({ number, title, className = '' }: ChapterLabelProps) {
  return (
    <div
      className={`font-mono text-[10px] uppercase tracking-[0.35em] text-dust flex items-center gap-3 ${className}`}
    >
      <span className="text-neon-green">{number}</span>
      <span className="w-6 h-px bg-smoke" />
      <span>{title}</span>
    </div>
  )
}
