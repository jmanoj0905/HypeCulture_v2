import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@api/auth'
import { getSession, login as apiLogin, logout as apiLogout, type LoginPayload } from '@api/auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSession()
      .then((res) => {
        if (res.data.success) setUser(res.data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    setError(null)
    try {
      const res = await apiLogin(payload)
      if (res.data.success) {
        setUser(res.data.data)
      } else {
        setError(res.data.error ?? 'Login failed')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
