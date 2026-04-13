import { Navigate } from 'react-router'
import { useAuth } from '@hooks/useAuth'
import { FullPageSpinner } from '@components/ui/Spinner'
import type { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: 'customer' | 'seller' | 'admin'
}

const roleDashboards: Record<string, string> = {
  customer: '/',
  seller: '/seller',
  admin: '/admin',
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={roleDashboards[user.role] ?? '/'} replace />
  }

  return <>{children}</>
}
