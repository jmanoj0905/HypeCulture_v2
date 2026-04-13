import { Outlet } from 'react-router'
import { TransitionProvider } from '@context/TransitionContext'

export function RootLayout() {
  return (
    <TransitionProvider>
      <Outlet />
    </TransitionProvider>
  )
}
