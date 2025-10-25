import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoute } from '@presentation/components/routes/PrivateRoute'
import { LoginPage } from '@presentation/pages/auth/LoginPage'
import { DashboardPage } from '@presentation/pages/dashboard/DashboardPage'

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
        <DashboardPage />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
