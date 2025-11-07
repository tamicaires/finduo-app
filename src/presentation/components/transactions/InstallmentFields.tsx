import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { MdAttachMoney, MdCalendarToday, MdViewWeek, MdInfo } from 'react-icons/md'
import { InputField } from '@presentation/components/form/InputField'
import { Alert, AlertDescription } from '@presentation/components/ui/alert'
import { formatCurrency } from '@shared/utils/format-currency'

interface InstallmentFieldsProps {
  totalAmount: number
}

export function InstallmentFields({ totalAmount }: InstallmentFieldsProps) {
  const { watch, setValue } = useFormContext()
  const totalInstallments = watch('total_installments') || 2
  const [installmentAmount, setInstallmentAmount] = useState(0)

  useEffect(() => {
    if (totalAmount && totalInstallments >= 2) {
      const amount = totalAmount / totalInstallments
      setInstallmentAmount(amount)
    }
  }, [totalAmount, totalInstallments])

  const handleInstallmentsChange = (value: number) => {
    if (value < 2) {
      setValue('total_installments', 2)
    } else if (value > 99) {
      setValue('total_installments', 99)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <MdViewWeek className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Configuração de Parcelamento</h3>
      </div>

      {/* <Alert className="bg-blue-500/10 border-blue-500/25">
        <MdInfo className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-900">
          O valor total será dividido igualmente em {totalInstallments} parcelas de{' '}
          <span className="font-semibold">{formatCurrency(installmentAmount)}</span>
        </AlertDescription>
      </Alert> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          name="total_amount"
          label="Valor Total"
          type="money"
          placeholder="R$ 0,00"
          icon={MdAttachMoney}
          required
          description="Valor total que será parcelado"
        />

        <InputField
          name="total_installments"
          label="Número de Parcelas"
          type="number"
          placeholder="Ex: 12"
          icon={MdViewWeek}
          required
          min={2}
          max={99}
          description="Mínimo 2, máximo 99 parcelas"
          onBlur={(e) => {
            const value = parseInt(e.target.value)
            handleInstallmentsChange(value)
          }}
        />

        <InputField
          name="first_installment_date"
          label="Data da Primeira Parcela"
          type="date"
          icon={MdCalendarToday}
          description="As demais parcelas serão criadas mensalmente"
        />
      </div>

      <div className="mt-4 p-3 bg-background rounded-md border border-dashed">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Valor por parcela:</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(installmentAmount)}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
          <span>{totalInstallments}x de</span>
          <span>{formatCurrency(installmentAmount)}</span>
        </div>
      </div>
    </div>
  )
}
