import type { CartItem } from '@api/cart'
import type { CheckoutState, CheckoutStep } from './CheckoutState'

export interface ConfirmationData {
  orderId: number
  total: number
}

export class ConfirmationStep implements CheckoutState {
  readonly step: CheckoutStep = 'confirmation'
  private _orderResult: ConfirmationData | null = null
  private _errors: string[] = []

  constructor(
    private readonly items: CartItem[],
    private readonly _subtotal: number
  ) {}

  get items(): CartItem[] {
    return this.items
  }

  get subtotal(): number {
    return this._subtotal
  }

  get orderResult(): ConfirmationData | null {
    return this._orderResult
  }

  canProceed(): boolean {
    return true
  }

  getNextStep(): CheckoutStep | null {
    return null
  }

  validate(): { valid: boolean; errors: string[] } {
    return { valid: true, errors: [] }
  }

  setOrderResult(result: ConfirmationData): void {
    this._orderResult = result
  }

  setError(error: string): void {
    this._errors = [error]
  }

  get hasError(): boolean {
    return this._errors.length > 0
  }

  get error(): string | null {
    return this._errors[0] ?? null
  }
}