import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoute } from '@presentation/components/routes/PrivateRoute'
import { AppLayout } from '@presentation/components/layout/AppLayout'
import { LoginPage } from '@presentation/pages/auth/LoginPage'
import { DashboardPageNew as DashboardPage } from '@presentation/pages/dashboard/DashboardPageNew'
import { AccountsPage } from '@presentation/pages/accounts/AccountsPage'
import { TransactionsPage } from '@presentation/pages/transactions/TransactionsPage'
import { CoupleManagementPage } from '@presentation/pages/couple/CoupleManagementPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/accounts',
    element: (
      <PrivateRoute>
        <AppLayout>
          <AccountsPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/transactions',
    element: (
      <PrivateRoute>
        <AppLayout>
          <TransactionsPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/couple',
    element: (
      <PrivateRoute>
        <AppLayout>
          <CoupleManagementPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
