import { Outlet } from 'react-router'
import { TransitionProvider } from '@context/TransitionContext'
import { CartDrawer } from '@components/cart/CartDrawer'

export function RootLayout() {
  return (
    <TransitionProvider>
      <CartDrawer />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </TransitionProvider>
  )
}
