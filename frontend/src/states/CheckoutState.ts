import type { CartItem } from '@api/cart'

export type CheckoutStep = 'review' | 'shipping' | 'payment' | 'confirmation'

export interface CheckoutState {
  readonly step: CheckoutStep
  readonly items: CartItem[]
  readonly subtotal: number
  canProceed(): boolean
  getNextStep(): CheckoutStep | null
  validate(): { valid: boolean; errors: string[] }
}

export interface CheckoutContext {
  state: CheckoutState
  goToStep(step: CheckoutStep): void
  placeOrder(): Promise<{ orderId: number; total: number }>
}

export type CheckoutStateFactory = (items: CartItem[], subtotal: number) => CheckoutState