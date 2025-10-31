import { AccountType } from '../enums/AccountType'

export interface Account {
  id: string
  couple_id: string
  owner_id: string | null
  name: string
  type: AccountType
  balance: number
  created_at: Date
}
