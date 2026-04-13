import { useEffect, useRef } from 'react'
import FluidReveal, { type FluidRevealOptions } from '@lib/fluid-reveal'

interface FluidRevealEffectProps {
  baseTextureUrl?: string
  overlayTextureUrl?: string
  options?: FluidRevealOptions
  className?: string
}

/** Base: near-black with subtle grain */
function makeBaseTexture(): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#060606'
  ctx.fillRect(0, 0, 1024, 1024)

  // Subtle grain
  for (let i = 0; i < 30000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.025})`
    ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1, 1)
  }

  // Faint horizontal scan lines
  for (let y = 0; y < 1024; y += 6) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.fillRect(0, y, 1024, 1)
  }

  return canvas.toDataURL('image/jpeg', 0.9)
}

/**
 * Overlay: neon city-grid — visually stark contrast to base.
 * Moving cursor reveals this bright grid through the dark base.
 */
function makeOverlayTexture(): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#040404'
  ctx.fillRect(0, 0, 1024, 1024)

  const GRID = 80

  // Filled grid cells (random highlights)
  const seed = 42
  for (let col = 0; col < 1024 / GRID; col++) {
    for (let row = 0; row < 1024 / GRID; row++) {
      const v = Math.sin(col * 12.9898 + row * 78.233 + seed) * 43758.5453
      const r = v - Math.floor(v)
      if (r < 0.18) {
        ctx.fillStyle = `rgba(57,255,20,${0.12 + r * 0.25})`
        ctx.fillRect(col * GRID, row * GRID, GRID, GRID)
      }
    }
  }

  // Grid lines — bright neon green
  ctx.strokeStyle = 'rgba(57,255,20,0.55)'
  ctx.lineWidth = 1
  for (let x = 0; x <= 1024; x += GRID) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
  }
  for (let y = 0; y <= 1024; y += GRID) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
  }

  // Pink diagonal accent lines
  ctx.strokeStyle = 'rgba(255,45,123,0.25)'
  ctx.lineWidth = 1
  for (let i = -1024; i < 2048; i += 160) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 1024, 1024); ctx.stroke()
  }

  // Bright neon green glow — centre burst
  const g = ctx.createRadialGradient(512, 512, 0, 512, 512, 380)
  g.addColorStop(0, 'rgba(57,255,20,0.35)')
  g.addColorStop(0.5, 'rgba(57,255,20,0.08)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 1024, 1024)

  // Corner glow — pink
  const p = ctx.createRadialGradient(900, 100, 0, 900, 100, 300)
  p.addColorStop(0, 'rgba(255,45,123,0.3)')
  p.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = p
  ctx.fillRect(0, 0, 1024, 1024)

  // Scanlines
  for (let y = 0; y < 1024; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    ctx.fillRect(0, y, 1024, 1)
  }

  return canvas.toDataURL('image/jpeg', 0.9)
}

export function FluidRevealEffect({
  baseTextureUrl,
  overlayTextureUrl,
  options,
  className = '',
}: FluidRevealEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<FluidReveal | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const base = baseTextureUrl ?? makeBaseTexture()
    const overlay = overlayTextureUrl ?? makeOverlayTexture()

    instanceRef.current = new FluidReveal({
      container: containerRef.current,
      baseTextureUrl: base,
      overlayTextureUrl: overlay,
      options: {
        cursor_size: 26,
        mouse_force: 65,
        resolution: 0.13,
        dissipation: 0.95,
        iterations: 5,
        ...options,
      },
    })

    return () => {
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
    />
  )
}
