import type { FinancialModel } from '@core/entities/Couple'

export const FINANCIAL_MODEL_LABELS: Record<FinancialModel, string> = {
  TRANSPARENT: 'Transparência Total',
  AUTONOMOUS: 'Autonomia com Colaboração',
  CUSTOM: 'Personalizado',
}

export const FINANCIAL_MODEL_DESCRIPTIONS: Record<FinancialModel, string> = {
  TRANSPARENT: 'Todas as contas são conjuntas, sem transações privadas',
  AUTONOMOUS: 'Permite contas pessoais e transações privadas',
  CUSTOM: 'Você configura cada permissão manualmente',
}

export const FINANCIAL_MODEL_FEATURES: Record<FinancialModel, string[]> = {
  TRANSPARENT: [
    'Todas as contas são conjuntas',
    'Ambos veem todas as transações',
    'Um único orçamento compartilhado',
    'Gastos pessoais com limite mensal',
  ],
  AUTONOMOUS: [
    'Contas conjuntas + Contas pessoais',
    'Gastos compartilhados visíveis',
    'Gastos pessoais privados',
    'Cada um gerencia seu dinheiro',
  ],
  CUSTOM: [
    'Todas as opções disponíveis',
    'Configure manualmente depois',
    'Máxima flexibilidade',
  ],
}
