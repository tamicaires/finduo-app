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

export interface ArchiveAccountResponse {
  success: boolean
  archived_account_id: string
}

export interface DeleteAccountResponse {
  success: boolean
  deleted_account_id: string
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

  async archive(id: string): Promise<ArchiveAccountResponse> {
    const response = await apiClient.patch<ArchiveAccountResponse>(
      API_ROUTES.ARCHIVE_ACCOUNT(id)
    )
    return response.data
  },

  async delete(id: string): Promise<DeleteAccountResponse> {
    // ⚠️ IMPORTANT: This permanently deletes the account AND all its transactions
    // Use archive() instead for soft delete
    const response = await apiClient.delete<DeleteAccountResponse>(
      API_ROUTES.DELETE_ACCOUNT(id)
    )
    return response.data
  },

  async toggleVisibility(id: string, isPersonal: boolean): Promise<Account> {
    const response = await apiClient.patch<Account>(API_ROUTES.UPDATE_ACCOUNT(id), {
      is_personal: isPersonal,
    })
    return response.data
  },
}
