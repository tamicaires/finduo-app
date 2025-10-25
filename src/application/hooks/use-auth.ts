import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authRepository } from '@infrastructure/repositories/auth.repository'
import { useAuthStore } from '@application/stores/auth.store'
import type { SignInInput } from '@infrastructure/validators/auth.schema'
import type { SignUpInput } from '@infrastructure/validators/auth.schema'

export function useAuth() {
  const navigate = useNavigate()
  const { login, logout, user, isAuthenticated } = useAuthStore()

  const signInMutation = useMutation({
    mutationFn: (data: SignInInput) =>
      authRepository.signIn({ email: data.email, password: data.password }),
    onSuccess: (response) => {
      login(response.access_token, response.user)
      navigate('/dashboard')
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
    logout()
    navigate('/login')
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
