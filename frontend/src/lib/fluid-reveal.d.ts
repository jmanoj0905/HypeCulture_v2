export interface FluidRevealOptions {
  cursor_size?: number
  mouse_force?: number
  resolution?: number
  dt?: number
  dissipation?: number
  iterations?: number
}

export interface FluidRevealConfig {
  container: HTMLElement
  baseTextureUrl: string
  overlayTextureUrl: string
  options?: FluidRevealOptions
}

export default class FluidReveal {
  constructor(config: FluidRevealConfig)
  destroy(): void
}
