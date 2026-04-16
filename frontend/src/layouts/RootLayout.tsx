import { Outlet } from 'react-router'
import { TransitionProvider } from '@context/TransitionContext'
import { CartDrawer } from '@components/cart/CartDrawer'

export function RootLayout() {
  return (
    <TransitionProvider>
      <CartDrawer />
      <Outlet />
    </TransitionProvider>
  )
}
