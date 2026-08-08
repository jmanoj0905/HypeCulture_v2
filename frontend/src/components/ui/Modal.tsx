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
        className="absolute inset-0 bg-chalk/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-void border border-smoke rounded-[14px] w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto
                       transform transition-transform duration-[750ms] ease-[cubic-bezier(0.65,0.05,0,1)]">
        {title && (
          <div className="flex items-center justify-between px-7 py-5 border-b border-smoke">
            <h3 className="font-heading font-bold text-2xl text-chalk tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full bg-asphalt text-chalk hover:bg-neon-green transition-colors text-xl leading-none flex items-center justify-center"
            >
              &times;
            </button>
          </div>
        )}
        <div className="p-7">
          {children}
        </div>
      </div>
    </div>
  )
}
