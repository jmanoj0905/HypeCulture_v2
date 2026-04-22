import type { CartItem } from '@api/cart'
import type { CheckoutState, CheckoutStep } from './CheckoutState'

export interface ShippingDetails {
  address: string
  city: string
  state: string
  zipCode: string
}

export class ShippingStep implements CheckoutState {
  readonly step: CheckoutStep = 'shipping'
  private _shippingDetails: ShippingDetails
  private _errors: string[] = []

  constructor(
    private readonly items: CartItem[],
    private readonly _subtotal: number,
    initialDetails?: Partial<ShippingDetails>
  ) {
    this._shippingDetails = {
      address: initialDetails?.address ?? '',
      city: initialDetails?.city ?? '',
      state: initialDetails?.state ?? '',
      zipCode: initialDetails?.zipCode ?? '',
    }
  }

  get items(): CartItem[] {
    return this.items
  }

  get subtotal(): number {
    return this._subtotal
  }

  get shippingDetails(): ShippingDetails {
    return this._shippingDetails
  }

  updateDetails(details: Partial<ShippingDetails>): void {
    this._shippingDetails = { ...this._shippingDetails, ...details }
    this.validate()
  }

  canProceed(): boolean {
    return this.validate().valid
  }

  getNextStep(): CheckoutStep | null {
    return this.canProceed() ? 'payment' : null
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const { address, city, state, zipCode } = this._shippingDetails

    if (!address?.trim()) errors.push('Address is required')
    if (!city?.trim()) errors.push('City is required')
    if (!state?.trim()) errors.push('State is required')
    if (!zipCode?.trim()) errors.push('ZIP code is required')
    else if (!/^\d{5}(-\d{4})?$/.test(zipCode))
      errors.push('Invalid ZIP code format')

    this._errors = errors
    return { valid: errors.length === 0, errors }
  }
}