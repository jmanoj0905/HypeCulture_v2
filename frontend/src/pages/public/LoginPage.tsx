import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { useAuth } from '@hooks/useAuth'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'

const roleDashboards: Record<string, string> = {
  customer: '/',
  seller: '/seller',
  admin: '/admin',
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login, error } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef<HTMLDivElement>(null)
  const prevError = useRef<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate(roleDashboards[user.role] ?? '/', { replace: true })
    }
  }, [user, navigate])

  // Shake form when a new error appears
  useEffect(() => {
    if (error && error !== prevError.current && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: 0 },
        {
          x: 10,
          duration: 0.06,
          ease: 'none',
          repeat: 5,
          yoyo: true,
          onComplete: () => gsap.set(formRef.current, { x: 0 }),
        }
      )
    }
    prevError.current = error ?? null
  }, [error])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
    } catch {
      // error already set in AuthContext
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div ref={formRef} className="w-full max-w-sm bg-asphalt border border-smoke p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl tracking-wider">
            <span className="text-neon-green">HYPE</span>
            <span className="text-white">CULTURE</span>
          </h1>
          <p className="font-heading text-xs uppercase tracking-widest text-dust mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-danger text-sm font-mono">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full mt-2">
            Enter
          </Button>
        </form>
      </div>
    </div>
  )
}
