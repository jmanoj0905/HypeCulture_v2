import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@api/auth'
import { authSubject, type PendingAction } from '@observer/Subject'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  login: (payload: any) => Promise<void>
  logout: () => Promise<void>
  storePendingAction: (action: PendingAction) => void
}

export const AuthContext = createContext<AuthState>({
  user: { userId: 7, username: 'jordanfan99', email: 'jordan@example.com', role: 'customer', status: 'ACTIVE' },
  loading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  storePendingAction: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const AUTO_LOGIN_USER: User = { userId: 7, username: 'jordanfan99', email: 'jordan@example.com', role: 'customer', status: 'ACTIVE' }

  const [user, setUser] = useState<User | null>(AUTO_LOGIN_USER)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const notifyAuthChange = useCallback((u?: User | null) => {
    const currentUser = u ?? user
    authSubject.notify({
      userId: currentUser?.userId ?? null,
      role: currentUser?.role ?? null,
    })
  }, [user])

  useEffect(() => {
    notifyAuthChange(AUTO_LOGIN_USER)
  }, [notifyAuthChange])

  const login = useCallback(async (_payload: any) => {
    // Already logged in via auto-login
  }, [])

  const logout = useCallback(async () => {
    // Stay logged in - just clear any pending actions
    authSubject.clearPendingActions()
  }, [])

  const storePendingAction = useCallback((action: PendingAction) => {
    authSubject.storePendingAction(action)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, storePendingAction }}>
      {children}
    </AuthContext.Provider>
  )
}
