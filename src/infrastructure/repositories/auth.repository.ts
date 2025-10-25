import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import type { User } from '@core/entities/User'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  access_token: string
  user: User
}

export interface SignUpRequest {
  name: string
  email: string
  password: string
}

export const authRepository = {
  async signIn(data: SignInRequest): Promise<SignInResponse> {
    const response = await apiClient.post<SignInResponse>(API_ROUTES.SIGN_IN, data)
    return response.data
  },

  async signUp(data: SignUpRequest): Promise<SignInResponse> {
    const response = await apiClient.post<SignInResponse>(API_ROUTES.SIGN_UP, data)
    return response.data
  },
}
