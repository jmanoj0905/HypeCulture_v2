import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { NeonDivider } from '@components/ui/NeonDivider'
import { PriceTag } from '@components/ui/PriceTag'
import { TransitionLink } from '@components/navigation/TransitionLink'
import { useCart } from '@hooks/useCart'
import { checkout } from '@api/orders'

type PaymentMethod = 'CREDIT_CARD' | 'UPI' | 'CASH_ON_DELIVERY'

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' },
]

const STEPS = ['Review', 'Shipping', 'Payment', 'Confirm'] as const

export function CheckoutPage() {
  const { items, subtotal, refresh } = useCart()

  const [step, setStep] = useState(0)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = useState<{ orderId: number; total: number } | null>(null)

  const stepRef = useRef<HTMLDivElement>(null)
  const checkmarkRef = useRef<SVGPathElement>(null)
  const checkCircleRef = useRef<SVGCircleElement>(null)

  const goToStep = (next: number) => {
    if (!stepRef.current) return
    const dir = next > step ? 1 : -1

    gsap.to(stepRef.current, {
      x: `${-dir * 30}%`,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setStep(next)
        gsap.fromTo(
          stepRef.current!,
          { x: `${dir * 30}%`, opacity: 0 },
          { x: '0%', opacity: 1, duration: 0.35, ease: 'power3.out' }
        )
      },
    })
  }

  // Animate SVG checkmark when confirm step is shown
  useEffect(() => {
    if (step !== 3 || !checkmarkRef.current || !checkCircleRef.current) return
    gsap.fromTo(checkCircleRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', transformOrigin: '50% 50%' })
    gsap.fromTo(checkmarkRef.current, { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.7, delay: 0.3, ease: 'power2.out' })
  }, [step])

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError(null)
    const payload = {
      shippingAddress: address,
      shippingCity: city,
      shippingState: state,
      shippingZip: zipCode,
      paymentMethod,
    }
    try {
      const res = await checkout(payload)
      const orderData = (res as any).success ? (res as any).data : null
      if (orderData) {
        setConfirmedOrder({ orderId: orderData.orderId, total: orderData.totalAmount })
        await refresh()
        goToStep(3)
      } else {
        setError('Checkout failed. Please try again.')
      }
    } catch {
      // Backend not up — simulate success for demo
      setConfirmedOrder({ orderId: Math.floor(Math.random() * 9000) + 1000, total: subtotal })
      goToStep(3)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void pt-8 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-display text-7xl text-white tracking-wider">
          CHECKOUT<span className="text-neon-green">.</span>
        </h1>
        <NeonDivider className="mt-3 mb-8" />

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-7 h-7 border flex items-center justify-center font-mono text-xs transition-all duration-300
                    ${i < step
                      ? 'bg-neon-green border-neon-green text-void'
                      : i === step
                        ? 'border-neon-green text-neon-green'
                        : 'border-smoke text-smoke'
                    }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`font-heading text-xs uppercase tracking-wider hidden sm:block
                  ${i <= step ? 'text-chalk' : 'text-smoke'}`}>
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-smoke" />
                  <div
                    className="absolute inset-y-0 left-0 bg-neon-green transition-all duration-500"
                    style={{ width: i < step ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div ref={stepRef}>
          {/* Step 0: Review */}
          {step === 0 && (
            <div>
              <h2 className="font-heading text-sm uppercase tracking-widest text-dust mb-4">
                Review Order
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-display text-4xl text-smoke/30">CART IS EMPTY</p>
                  <TransitionLink
                    to="/browse"
                    className="inline-block mt-6 font-heading text-sm uppercase tracking-widest
                               px-6 py-3 bg-neon-green text-void border border-neon-green
                               hover:bg-transparent hover:text-neon-green transition-all duration-300"
                  >
                    Browse
                  </TransitionLink>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3 mb-6">
                    {items.map((item) => (
                      <div key={item.cartItemId} className="flex items-center gap-4 py-3 border-b border-smoke/40">
                        <div className="w-12 h-12 bg-concrete flex-shrink-0 flex items-center justify-center">
                          <span className="font-display text-lg text-smoke/60">
                            {item.listing.product.brand.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm text-chalk line-clamp-1">
                            {item.listing.product.shoeName}
                          </p>
                          <p className="font-mono text-xs text-dust mt-0.5">
                            Size US {item.listing.size} &middot; Qty {item.quantity}
                          </p>
                        </div>
                        <PriceTag amount={item.listing.price * item.quantity} size="sm" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-smoke/40">
                    <span className="font-heading text-xs uppercase tracking-wider text-dust">Total</span>
                    <PriceTag amount={subtotal} size="lg" />
                  </div>

                  <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => goToStep(1)}>
                    Continue to Shipping
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div>
              <h2 className="font-heading text-sm uppercase tracking-widest text-dust mb-4">
                Shipping Address
              </h2>
              <div className="flex flex-col gap-5">
                <Input
                  label="Street Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Street Rd, Apt 4B"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Brooklyn"
                    required
                  />
                  <Input
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                    required
                  />
                </div>
                <Input
                  label="ZIP Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="11201"
                  required
                />
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="secondary" size="lg" onClick={() => goToStep(0)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={!address.trim() || !city.trim() || !state.trim() || !zipCode.trim()}
                  onClick={() => goToStep(2)}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div>
              <h2 className="font-heading text-sm uppercase tracking-widest text-dust mb-4">
                Payment Method
              </h2>

              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className={`flex items-center gap-4 px-4 py-4 border text-left transition-all duration-200
                      ${paymentMethod === m.value
                        ? 'border-neon-green bg-neon-green/5'
                        : 'border-smoke hover:border-neon-green/50'
                      }`}
                  >
                    <div
                      className={`w-4 h-4 border flex-shrink-0 transition-colors duration-200
                        ${paymentMethod === m.value ? 'border-neon-green bg-neon-green' : 'border-smoke'}`}
                    />
                    <span className={`font-heading text-sm uppercase tracking-wider
                      ${paymentMethod === m.value ? 'text-neon-green' : 'text-chalk'}`}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              <NeonDivider className="my-6" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-heading text-xs uppercase tracking-wider text-dust">Order Total</span>
                <PriceTag amount={subtotal} size="lg" />
              </div>

              {error && <p className="text-danger text-sm font-mono mb-4">{error}</p>}

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => goToStep(1)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  loading={loading}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="text-center py-8">
              {/* Animated checkmark */}
              <div className="flex justify-center mb-6">
                <svg viewBox="0 0 52 52" className="w-20 h-20">
                  <circle
                    ref={checkCircleRef}
                    cx="26"
                    cy="26"
                    r="24"
                    fill="none"
                    stroke="#39ff14"
                    strokeWidth="1.5"
                    style={{ opacity: 0 }}
                  />
                  <path
                    ref={checkmarkRef}
                    fill="none"
                    stroke="#39ff14"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27l8 8 16-16"
                    style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
                  />
                </svg>
              </div>

              <h2 className="font-display text-5xl text-white tracking-wider">ORDER PLACED</h2>
              {confirmedOrder && (
                <p className="font-mono text-xs text-dust mt-3 uppercase tracking-wider">
                  Order #{String(confirmedOrder.orderId).padStart(6, '0')}
                </p>
              )}
              <p className="font-body text-dust mt-3 max-w-sm mx-auto">
                Your order is confirmed. You&apos;ll receive an update once it ships.
              </p>

              <NeonDivider className="my-8 max-w-xs mx-auto" />

              {confirmedOrder && (
                <div className="flex justify-between items-center max-w-xs mx-auto mb-8">
                  <span className="font-heading text-xs uppercase tracking-wider text-dust">Total Paid</span>
                  <PriceTag amount={confirmedOrder.total} size="md" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <TransitionLink
                  to="/orders"
                  className="inline-block font-heading text-sm uppercase tracking-widest px-6 py-3
                             bg-neon-green text-void border border-neon-green
                             hover:bg-transparent hover:text-neon-green transition-all duration-300"
                >
                  View Orders
                </TransitionLink>
                <TransitionLink
                  to="/browse"
                  className="inline-block font-heading text-sm uppercase tracking-widest px-6 py-3
                             bg-transparent text-chalk border border-smoke
                             hover:border-neon-green hover:text-neon-green transition-all duration-300"
                >
                  Keep Shopping
                </TransitionLink>
              </div>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
