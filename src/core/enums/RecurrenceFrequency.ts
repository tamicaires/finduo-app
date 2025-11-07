export enum RecurrenceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export const RecurrenceFrequencyLabels: Record<RecurrenceFrequency, string> = {
  [RecurrenceFrequency.DAILY]: 'Diário',
  [RecurrenceFrequency.WEEKLY]: 'Semanal',
  [RecurrenceFrequency.MONTHLY]: 'Mensal',
  [RecurrenceFrequency.YEARLY]: 'Anual',
}
