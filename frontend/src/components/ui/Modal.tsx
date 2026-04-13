import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-void/80 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-asphalt border border-smoke w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto
                       transform transition-transform duration-300 ease-[var(--ease-out-expo)]
                       border-t-2 border-t-neon-green">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-smoke">
            <h3 className="font-heading text-xl uppercase tracking-wider text-white">{title}</h3>
            <button onClick={onClose} className="text-dust hover:text-chalk transition-colors text-xl leading-none">&times;</button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
