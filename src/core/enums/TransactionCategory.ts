export enum TransactionCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HOUSING = 'HOUSING',
  SALARY = 'SALARY',
  INVESTMENT_RETURN = 'INVESTMENT_RETURN',
  OTHER = 'OTHER',
}

export const TransactionCategoryLabels: Record<TransactionCategory, string> = {
  [TransactionCategory.FOOD]: 'Alimentação',
  [TransactionCategory.TRANSPORT]: 'Transporte',
  [TransactionCategory.HEALTH]: 'Saúde',
  [TransactionCategory.EDUCATION]: 'Educação',
  [TransactionCategory.ENTERTAINMENT]: 'Entretenimento',
  [TransactionCategory.HOUSING]: 'Moradia',
  [TransactionCategory.SALARY]: 'Salário',
  [TransactionCategory.INVESTMENT_RETURN]: 'Rendimento',
  [TransactionCategory.OTHER]: 'Outros',
}
