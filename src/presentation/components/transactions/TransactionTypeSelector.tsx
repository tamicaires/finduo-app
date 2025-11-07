import { MdTrendingUp, MdTrendingDown } from 'react-icons/md'
import { Label } from '@presentation/components/ui/label'
import { TransactionType } from '@core/enums/TransactionType'

interface TransactionTypeSelectorProps {
  value?: TransactionType
  onChange: (type: TransactionType) => void
}

export function TransactionTypeSelector({ value, onChange }: TransactionTypeSelectorProps) {
  const types = [
    {
      value: TransactionType.INCOME,
      label: 'Receita',
      description: 'Dinheiro que entra',
      icon: MdTrendingUp,
      color: 'green',
    },
    {
      value: TransactionType.EXPENSE,
      label: 'Despesa',
      description: 'Dinheiro que sai',
      icon: MdTrendingDown,
      color: 'red',
    },
  ]

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Qual tipo de transação?</Label>
      <div className="grid grid-cols-2 gap-4">
        {types.map((type) => {
          const Icon = type.icon
          const isSelected = value === type.value
          const colorClasses = {
            green: {
              selected: 'border-green-500 bg-green-50 dark:bg-green-950',
              icon: 'bg-green-500 text-white',
              label: 'text-green-700 dark:text-green-400',
              hover: 'hover:border-green-300',
            },
            red: {
              selected: 'border-red-500 bg-red-50 dark:bg-red-950',
              icon: 'bg-red-500 text-white',
              label: 'text-red-700 dark:text-red-400',
              hover: 'hover:border-red-300',
            },
          }[type.color] || {
            selected: 'border-border bg-background',
            icon: 'bg-muted text-muted-foreground',
            label: 'text-foreground',
            hover: 'hover:border-primary',
          }

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`
                relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all
                hover:shadow-lg hover:scale-[1.02]
                ${
                  isSelected
                    ? colorClasses.selected
                    : `border-border bg-background ${colorClasses.hover}`
                }
              `}
            >
              <div
                className={`
                  p-4 rounded-full transition-colors
                  ${isSelected ? colorClasses.icon : 'bg-muted text-muted-foreground'}
                `}
              >
                <Icon className="h-8 w-8" />
              </div>
              <div className="text-center">
                <div
                  className={`
                    font-bold text-lg
                    ${isSelected ? colorClasses.label : 'text-foreground'}
                  `}
                >
                  {type.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {type.description}
                </div>
              </div>
              {isSelected && (
                <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${type.color === 'green' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
