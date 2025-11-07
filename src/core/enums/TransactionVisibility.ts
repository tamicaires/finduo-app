export enum TransactionVisibility {
  SHARED = 'SHARED',
  PRIVATE = 'PRIVATE',
  FREE_SPENDING = 'FREE_SPENDING',
}

export const TransactionVisibilityLabels: Record<TransactionVisibility, string> = {
  [TransactionVisibility.SHARED]: 'Compartilhada',
  [TransactionVisibility.PRIVATE]: 'Privada',
  [TransactionVisibility.FREE_SPENDING]: 'Gasto Livre',
}
