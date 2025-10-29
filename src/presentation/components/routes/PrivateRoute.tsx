import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@application/stores/auth.store'

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuthStore()

  console.log('🔍 [PRIVATE ROUTE] Verificando autenticação:', isAuthenticated)

  if (!isAuthenticated) {
    console.log('❌ [PRIVATE ROUTE] Não autenticado - redirecionando para /login')
    return <Navigate to="/login" replace />
  }

  console.log('✅ [PRIVATE ROUTE] Autenticado - renderizando conteúdo')
  return <>{children}</>
}
