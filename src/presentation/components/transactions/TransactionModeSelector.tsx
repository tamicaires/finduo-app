import { MdReceipt, MdRepeat, MdViewWeek } from 'react-icons/md'
import { Label } from '@presentation/components/ui/label'
import type { TransactionMode } from '@core/types/transaction-mode'
import { TransactionType } from '@core/enums/TransactionType'
import { useTransactionModeFilter } from './wizard/hooks/use-transaction-mode-filter'

export type { TransactionMode }

interface TransactionModeSelectorProps {
  value: TransactionMode
  onChange: (mode: TransactionMode) => void
  transactionType?: TransactionType
}

export function TransactionModeSelector({ value, onChange, transactionType }: TransactionModeSelectorProps) {
  const { availableModes } = useTransactionModeFilter(transactionType || null)

  const allModes = [
    {
      value: 'simple' as const,
      label: 'Simples',
      description: 'Transação única',
      icon: MdReceipt,
    },
    {
      value: 'installment' as const,
      label: 'Parcelada',
      description: 'Dividir em parcelas',
      icon: MdViewWeek,
    },
    {
      value: 'recurring' as const,
      label: 'Recorrente',
      description: 'Repetir periodicamente',
      icon: MdRepeat,
    },
  ]

  // Filtrar modos baseado no tipo de transação
  const modes = allModes.filter(mode => availableModes.includes(mode.value))

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Tipo de Transação</Label>
      <div className={`grid gap-3 ${modes.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {modes.map((mode) => {
          const Icon = mode.icon
          const isSelected = value === mode.value

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange(mode.value)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                hover:shadow-md hover:scale-[1.02]
                ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-background hover:border-primary/50'
                }
              `}
            >
              <div
                className={`
                  p-3 rounded-full transition-colors
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div
                  className={`
                    font-semibold text-sm
                    ${isSelected ? 'text-primary' : 'text-foreground'}
                  `}
                >
                  {mode.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {mode.description}
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
