export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  WALLET = 'WALLET',
  INVESTMENT = 'INVESTMENT',
}

export const AccountTypeLabels: Record<AccountType, string> = {
  [AccountType.CHECKING]: 'Conta Corrente',
  [AccountType.SAVINGS]: 'Poupança',
  [AccountType.WALLET]: 'Carteira',
  [AccountType.INVESTMENT]: 'Investimento',
}
