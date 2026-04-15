import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@layouts/RootLayout'
import { PublicLayout } from '@layouts/PublicLayout'
import { CustomerLayout } from '@layouts/CustomerLayout'
import { SellerLayout } from '@layouts/SellerLayout'
import { AdminLayout } from '@layouts/AdminLayout'

import { LandingPage } from '@pages/public/LandingPage'
import { LoginPage } from '@pages/public/LoginPage'
import { BrowsePage } from '@pages/customer/BrowsePage'
import { ProductDetailPage } from '@pages/customer/ProductDetailPage'
import { CartPage } from '@pages/customer/CartPage'
import { CheckoutPage } from '@pages/customer/CheckoutPage'
import { OrdersPage } from '@pages/customer/OrdersPage'
import { SellerDashboard } from '@pages/seller/SellerDashboard'
import { NewListingPage } from '@pages/seller/NewListingPage'
import { InventoryPage } from '@pages/seller/InventoryPage'
import { AdminDashboard } from '@pages/admin/AdminDashboard'
import { UsersPage } from '@pages/admin/UsersPage'
import { ProductsPage } from '@pages/admin/ProductsPage'
import { CatalogPage } from '@pages/admin/CatalogPage'
import { ReportsPage } from '@pages/admin/ReportsPage'
import { NotFoundPage } from '@pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: PublicLayout,
        children: [
          { path: '/', Component: LandingPage },
          { path: '/login', Component: LoginPage },
          { path: '/browse', Component: BrowsePage },
          { path: '/browse/:categoryId', Component: BrowsePage },
          { path: '/product/:productId', Component: ProductDetailPage },
        ],
      },
      {
        Component: CustomerLayout,
        children: [
          { path: '/cart', Component: CartPage },
          { path: '/checkout', Component: CheckoutPage },
          { path: '/orders', Component: OrdersPage },
        ],
      },
      {
        path: '/seller',
        Component: SellerLayout,
        children: [
          { index: true, Component: SellerDashboard },
          { path: 'new-listing', Component: NewListingPage },
          { path: 'inventory', Component: InventoryPage },
        ],
      },
      {
        path: '/admin',
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'users', Component: UsersPage },
          { path: 'products', Component: ProductsPage },
          { path: 'catalog', Component: CatalogPage },
          { path: 'reports', Component: ReportsPage },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
