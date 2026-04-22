import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router'
import gsap from 'gsap'
import { useAuth } from '@hooks/useAuth'
import { registerCustomer, registerSeller } from '@api/auth'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'

type Role = 'customer' | 'seller'

const roleDashboards: Record<string, string> = {
  customer: '/',
  seller: '/seller',
}

export function RegisterPage() {
  const [role, setRole] = useState<Role>('customer')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      navigate(roleDashboards[user.role] ?? '/', { replace: true })
    }
  }, [user, navigate])

  const shakeForm = () => {
    if (!formRef.current) return
    gsap.fromTo(
      formRef.current,
      { x: 0 },
      { x: 10, duration: 0.06, ease: 'none', repeat: 5, yoyo: true, onComplete: () => gsap.set(formRef.current, { x: 0 }) }
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      shakeForm()
      return
    }
    setLoading(true)
    try {
      let res
      if (role === 'seller') {
        res = await registerSeller({ username, email, password })
      } else {
        res = await registerCustomer({ username, email, password })
      }
      if (res.data.success && res.data.data) {
        navigate(roleDashboards[role], { replace: true })
        window.location.reload()
      } else {
        setError(res.data.error ?? 'Registration failed')
        shakeForm()
      }
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Registration failed')
      shakeForm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div ref={formRef} className="w-full max-w-sm bg-asphalt border border-smoke p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl tracking-wider">
            <span className="text-neon-green">HYPE</span>
            <span className="text-white">CULTURE</span>
          </h1>
          <p className="font-heading text-xs uppercase tracking-widest text-dust mt-2">Create your account</p>
        </div>

        {/* Role selector */}
        <div className="flex mb-6 border border-smoke">
          {(['customer', 'seller'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 font-heading text-xs uppercase tracking-widest transition-colors ${
                role === r
                  ? 'bg-neon-green text-void'
                  : 'text-dust hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Username"
            type="text"
            placeholder="your_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-danger text-sm font-mono">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-center text-dust text-xs font-mono mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-neon-green hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
