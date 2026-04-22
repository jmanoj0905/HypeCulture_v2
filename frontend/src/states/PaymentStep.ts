import type { CartItem } from '@api/cart'
import type { CheckoutState, CheckoutStep } from './CheckoutState'

export type PaymentMethod = 'Credit Card' | 'UPI' | 'Cash on Delivery'

export interface PaymentDetails {
  method: PaymentMethod
}

export class PaymentStep implements CheckoutState {
  readonly step: CheckoutStep = 'payment'
  readonly items: CartItem[]
  private _subtotal: number
  private _paymentDetails: PaymentDetails
  private _errors: string[] = []

  constructor(
    items: CartItem[],
    subtotal: number,
    initialMethod?: PaymentMethod
  ) {
    this.items = items
    this._subtotal = subtotal
    this._paymentDetails = {
      method: initialMethod ?? 'Credit Card',
    }
  }

  get subtotal(): number {
    return this._subtotal
  }

  get paymentDetails(): PaymentDetails {
    return this._paymentDetails
  }

  setMethod(method: PaymentMethod): void {
    this._paymentDetails.method = method
  }

  canProceed(): boolean {
    return !!this._paymentDetails.method
  }

  getNextStep(): CheckoutStep | null {
    return this.canProceed() ? 'confirmation' : null
  }

  validate(): { valid: boolean; errors: string[] } {
    if (!this._paymentDetails.method) {
      this._errors = ['Please select a payment method']
    } else {
      this._errors = []
    }
    return { valid: this._errors.length === 0, errors: this._errors }
  }
}