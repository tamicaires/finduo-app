import { apiClient } from '@/infrastructure/http/api-client'
import { API_ROUTES } from '@/shared/constants/api-routes'

export interface SubscriptionStatus {
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'CANCELED'
  planName: string
  startDate: Date
  endDate: Date | null
  daysRemaining: number | null
  canUpgrade: boolean
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
}

export interface CheckoutSession {
  sessionUrl: string
  sessionId: string
}

export interface PortalSession {
  portalUrl: string
}

class SubscriptionService {
  async getStatus(): Promise<SubscriptionStatus> {
    const response = await apiClient.get<SubscriptionStatus>(API_ROUTES.SUBSCRIPTION_STATUS)
    return {
      ...response.data,
      startDate: new Date(response.data.startDate),
      endDate: response.data.endDate ? new Date(response.data.endDate) : null,
    }
  }

  async createCheckoutSession(userEmail: string): Promise<CheckoutSession> {
    const response = await apiClient.post<CheckoutSession>(API_ROUTES.SUBSCRIPTION_CHECKOUT, {
      userEmail,
    })
    return response.data
  }

  async createPortalSession(): Promise<PortalSession> {
    const response = await apiClient.get<PortalSession>(API_ROUTES.SUBSCRIPTION_PORTAL)
    return response.data
  }
}

export const subscriptionService = new SubscriptionService()
