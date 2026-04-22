import type { CartItem } from '@api/cart'
import type { CheckoutState, CheckoutStep } from './CheckoutState'

export class ReviewStep implements CheckoutState {
  readonly step: CheckoutStep = 'review'
  readonly items: CartItem[]
  readonly subtotal: number
  constructor(
    items: CartItem[],
    subtotal: number
  ) {
    this.items = items
    this.subtotal = subtotal
  }

  canProceed(): boolean {
    return this.items.length > 0
  }

  getNextStep(): CheckoutStep | null {
    return this.canProceed() ? 'shipping' : null
  }

  validate(): { valid: boolean; errors: string[] } {
    if (this.items.length === 0) {
      return { valid: false, errors: ['Your cart is empty'] }
    }
    return { valid: true, errors: [] }
  }
}