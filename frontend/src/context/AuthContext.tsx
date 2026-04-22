import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { getSession, login as apiLogin, logout as apiLogout, type User } from '@api/auth'
import { authSubject, type PendingAction } from '@observer/Subject'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  login: (payload: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  storePendingAction: (action: PendingAction) => void
}

export const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  storePendingAction: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const notifyAuthChange = useCallback((u: User | null) => {
    authSubject.notify({
      userId: u?.userId ?? null,
      role: u?.role ?? null,
    })
  }, [])

  useEffect(() => {
    getSession()
      .then((res) => {
        if (res.data.success && res.data.data) {
          setUser(res.data.data)
          notifyAuthChange(res.data.data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [notifyAuthChange])

  const login = useCallback(async (payload: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiLogin(payload)
      if (res.data.success && res.data.data) {
        setUser(res.data.data)
        notifyAuthChange(res.data.data)
      } else {
        setError(res.data.error ?? 'Login failed')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Invalid email or password'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [notifyAuthChange])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {}
    setUser(null)
    notifyAuthChange(null)
    authSubject.clearPendingActions()
  }, [notifyAuthChange])

  const storePendingAction = useCallback((action: PendingAction) => {
    authSubject.storePendingAction(action)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, storePendingAction }}>
      {children}
    </AuthContext.Provider>
  )
}
