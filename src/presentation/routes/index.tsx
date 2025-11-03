import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoute } from '@presentation/components/routes/PrivateRoute'
import { AppLayout } from '@presentation/components/layout/AppLayout'
import { LoginPage } from '@presentation/pages/auth/LoginPage'
import { DashboardPageNew as DashboardPage } from '@presentation/pages/dashboard/DashboardPageNew'
import { AccountsPage } from '@presentation/pages/accounts/AccountsPage'
import { TransactionsPage } from '@presentation/pages/transactions/TransactionsPage'
import { CoupleManagementPage } from '@presentation/pages/couple/CoupleManagementPage'
import { SettingsPage } from '@presentation/pages/settings/SettingsPage'
import { GamificationPage } from '@presentation/pages/gamification/GamificationPage'
import { AchievementsPage } from '@presentation/pages/achievements/AchievementsPage'
import { BillingPage } from '@presentation/pages/billing/BillingPage'
import { AdminPage } from '@presentation/pages/admin/AdminPage'

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
    path: '/settings',
    element: (
      <PrivateRoute>
        <AppLayout>
          <SettingsPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/gamification',
    element: (
      <PrivateRoute>
        <AppLayout>
          <GamificationPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/achievements',
    element: (
      <PrivateRoute>
        <AppLayout>
          <AchievementsPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/billing',
    element: (
      <PrivateRoute>
        <AppLayout>
          <BillingPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <AppLayout>
          <AdminPage />
        </AppLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
