import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

interface DragGalleryProps {
  children: ReactNode
  className?: string
}

/**
 * Hand-rolled drag + inertia track. Zero external deps.
 * Mouse drag, wheel horizontal, touch, trackpad. Clicks still bubble if drag < 5px.
 */
export function DragGallery({ children, className = '' }: DragGalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    x: 0,
    velocity: 0,
    min: 0,
    isDown: false,
    startX: 0,
    startPos: 0,
    lastX: 0,
    lastTime: 0,
    dragged: 0,
  })

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const measure = () => {
      const min = viewport.clientWidth - track.scrollWidth
      stateRef.current.min = Math.min(0, min)
      clamp()
    }

    const clamp = () => {
      const s = stateRef.current
      if (s.x > 0) s.x = 0
      if (s.x < s.min) s.x = s.min
      gsap.set(track, { x: s.x })
    }

    measure()
    window.addEventListener('resize', measure)

    let rafId = 0
    const tick = () => {
      const s = stateRef.current
      if (s.isDown) {
        rafId = requestAnimationFrame(tick)
        return
      }
      if (Math.abs(s.velocity) > 0.1) {
        s.x += s.velocity
        s.velocity *= 0.92
        if (s.x > 0) { s.x = 0; s.velocity = 0 }
        if (s.x < s.min) { s.x = s.min; s.velocity = 0 }
        gsap.set(track, { x: s.x })
      } else {
        s.velocity = 0
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onDown = (clientX: number) => {
      const s = stateRef.current
      s.isDown = true
      s.startX = clientX
      s.startPos = s.x
      s.lastX = clientX
      s.lastTime = performance.now()
      s.dragged = 0
      s.velocity = 0
      viewport.setAttribute('data-dragging', '1')
    }
    const onMove = (clientX: number) => {
      const s = stateRef.current
      if (!s.isDown) return
      const delta = clientX - s.startX
      s.x = s.startPos + delta
      if (s.x > 20) s.x = 20 + (s.x - 20) * 0.3
      if (s.x < s.min - 20) s.x = s.min - 20 + (s.x - (s.min - 20)) * 0.3
      gsap.set(track, { x: s.x })
      const now = performance.now()
      const dt = Math.max(1, now - s.lastTime)
      s.velocity = (clientX - s.lastX) / dt * 16
      s.lastX = clientX
      s.lastTime = now
      s.dragged = Math.max(s.dragged, Math.abs(delta))
    }
    const onUp = () => {
      const s = stateRef.current
      s.isDown = false
      viewport.removeAttribute('data-dragging')
      const sync = () => { gsap.set(track, { x: s.x }) }
      if (s.x > 0) gsap.to(s, { x: 0, duration: 0.5, ease: 'power3.out', onUpdate: sync })
      else if (s.x < s.min) gsap.to(s, { x: s.min, duration: 0.5, ease: 'power3.out', onUpdate: sync })
    }

    const mDown = (e: MouseEvent) => { onDown(e.clientX) }
    const mMove = (e: MouseEvent) => onMove(e.clientX)
    const mUp = () => onUp()
    const tStart = (e: TouchEvent) => { onDown(e.touches[0].clientX) }
    const tMove = (e: TouchEvent) => onMove(e.touches[0].clientX)
    const tEnd = () => onUp()
    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      if (absX < 6 && absX < absY) return
      e.preventDefault()
      const s = stateRef.current
      s.x -= e.deltaX || e.deltaY
      if (s.x > 0) s.x = 0
      if (s.x < s.min) s.x = s.min
      gsap.set(track, { x: s.x })
    }
    const onClickCapture = (e: MouseEvent) => {
      if (stateRef.current.dragged > 5) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const onDragStart = (e: DragEvent) => e.preventDefault()
    const onSelectStart = (e: Event) => {
      if (stateRef.current.isDown) e.preventDefault()
    }

    viewport.addEventListener('mousedown', mDown)
    window.addEventListener('mousemove', mMove)
    window.addEventListener('mouseup', mUp)
    viewport.addEventListener('touchstart', tStart, { passive: true })
    viewport.addEventListener('touchmove', tMove, { passive: true })
    viewport.addEventListener('touchend', tEnd)
    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('click', onClickCapture, true)
    viewport.addEventListener('dragstart', onDragStart)
    viewport.addEventListener('selectstart', onSelectStart)

    // Disable native drag on all images and anchors inside
    viewport.querySelectorAll('img, a').forEach((el) => {
      ;(el as HTMLElement).setAttribute('draggable', 'false')
    })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', measure)
      viewport.removeEventListener('mousedown', mDown)
      window.removeEventListener('mousemove', mMove)
      window.removeEventListener('mouseup', mUp)
      viewport.removeEventListener('touchstart', tStart)
      viewport.removeEventListener('touchmove', tMove)
      viewport.removeEventListener('touchend', tEnd)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('click', onClickCapture, true)
      viewport.removeEventListener('dragstart', onDragStart)
      viewport.removeEventListener('selectstart', onSelectStart)
    }
  }, [])

  return (
    <div
      ref={viewportRef}
      className={`overflow-hidden select-none ${className}`}
      data-cursor="drag"
      style={{ cursor: 'grab', WebkitUserDrag: 'none', touchAction: 'pan-y' } as React.CSSProperties}
    >
      <div ref={trackRef} className="flex gap-6 will-change-transform" style={{ width: 'max-content' }}>
        {children}
      </div>
    </div>
  )
}
