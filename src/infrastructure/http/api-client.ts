import axios from 'axios'
import { APP_CONFIG } from '@shared/constants/app-config'

export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para adicionar token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem(APP_CONFIG.TOKEN_KEY)
      localStorage.removeItem(APP_CONFIG.USER_KEY)
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)
