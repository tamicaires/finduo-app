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

  /**
   * Archives an account (soft delete - recommended for normal use)
   * - Account receives archived_at timestamp
   * - Hidden from all listings
   * - Transactions are preserved (appear in reports)
   * - Can be restored in the future
   * - Instant (no balance or transaction validation)
   * @param id Account ID
   * @returns Archive response with archived account ID
   */
  async archive(id: string): Promise<ArchiveAccountResponse> {
    const response = await apiClient.patch<ArchiveAccountResponse>(
      API_ROUTES.ARCHIVE_ACCOUNT(id)
    )
    return response.data
  },

  /**
   * ⚠️ PERMANENTLY deletes an account and ALL its transactions
   *
   * CRITICAL: Requires explicit user confirmation
   *
   * What happens:
   * - Account is REMOVED from database
   * - ALL transactions are deleted (CASCADE)
   * - ALL installment templates are deleted (CASCADE)
   * - IRREVERSIBLE - cannot be undone
   *
   * Use archive() instead for normal operations
   *
   * @param id Account ID
   * @returns Delete response with deleted account ID
   */
  async delete(id: string): Promise<DeleteAccountResponse> {
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
