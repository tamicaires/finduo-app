import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authRepository } from '@infrastructure/repositories/auth.repository'
import { useAuthStore } from '@application/stores/auth.store'
import type { SignInInput } from '@infrastructure/validators/auth.schema'
import type { SignUpInput } from '@infrastructure/validators/auth.schema'

export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { login, logout, user, isAuthenticated } = useAuthStore()

  const signInMutation = useMutation({
    mutationFn: (data: SignInInput) => {
      console.log('🔵 [USE AUTH] Tentando fazer login...')
      return authRepository.signIn({ email: data.email, password: data.password })
    },
    onSuccess: (response) => {
      console.log('✅ [USE AUTH] Login bem-sucedido na API', response)
      login(response.access_token, response.user)
      console.log('🔵 [USE AUTH] Navegando para /dashboard')
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('❌ [USE AUTH] Erro no login:', error)
    },
  })

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpInput) =>
      authRepository.signUp({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    onSuccess: (response) => {
      login(response.access_token, response.user)
      navigate('/dashboard')
    },
  })

  const handleLogout = () => {
    // Limpa todo o cache do React Query
    queryClient.clear()
    // Limpa o estado de autenticação
    logout()
    // Use replace para evitar que o usuário volte com o botão voltar
    navigate('/login', { replace: true })
  }

  return {
    // State
    user,
    isAuthenticated,

    // Mutations
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    logout: handleLogout,

    // Loading states
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,

    // Errors
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
  }
}
