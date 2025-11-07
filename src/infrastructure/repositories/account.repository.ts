import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import type { Account } from '@core/entities/Account'
import type { AccountType } from '@core/enums/AccountType'

export interface CreateAccountDto {
  name: string
  type: AccountType
  initial_balance?: number
  is_personal?: boolean
}

export interface UpdateAccountDto {
  name?: string
  type?: AccountType
  is_personal?: boolean
}

export const accountRepository = {
  async list(): Promise<Account[]> {
    const response = await apiClient.get<{ accounts: Account[]; total_balance: number }>(
      API_ROUTES.LIST_ACCOUNTS
    )
    return response.data.accounts
  },

  async create(data: CreateAccountDto): Promise<Account> {
    const response = await apiClient.post<Account>(API_ROUTES.CREATE_ACCOUNT, data)
    return response.data
  },

  async update(id: string, data: UpdateAccountDto): Promise<Account> {
    const response = await apiClient.patch<Account>(API_ROUTES.UPDATE_ACCOUNT(id), data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ROUTES.DELETE_ACCOUNT(id))
  },

  async toggleVisibility(id: string, isPersonal: boolean): Promise<Account> {
    const response = await apiClient.patch<Account>(API_ROUTES.UPDATE_ACCOUNT(id), {
      is_personal: isPersonal,
    })
    return response.data
  },
}
