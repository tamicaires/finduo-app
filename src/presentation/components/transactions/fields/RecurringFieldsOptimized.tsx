import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { MdRepeat, MdCalendarToday, MdEventRepeat, MdInfo } from 'react-icons/md'
import { InputField } from '@presentation/components/form/InputField'
import { DateField } from '@presentation/components/form/DateField'
import { SelectField } from '@presentation/components/form/SelectField'
import { SwitchField } from '@presentation/components/form/SwitchField'
import { Alert, AlertDescription } from '@presentation/components/ui/alert'
import { RecurrenceFrequency, RecurrenceFrequencyLabels } from '@core/enums/RecurrenceFrequency'

/**
 * Campos de recorrência otimizados
 * - Layout mais compacto
 * - Menos espaçamento
 * - Informações mais concisas
 * - Hierarquia visual melhor
 */
export function RecurringFieldsOptimized() {
  const { watch, setValue } = useFormContext()
  const frequency = watch('frequency')
  const interval = watch('interval') || 1
  const hasEndDate = watch('has_end_date')

  useEffect(() => {
    if (!hasEndDate) {
      setValue('end_date', undefined)
    }
  }, [hasEndDate, setValue])

  const frequencyOptions = Object.entries(RecurrenceFrequencyLabels).map(([value, label]) => ({
    value,
    label,
  }))

  const getRecurrenceDescription = () => {
    if (!frequency) return null

    const frequencyMap: Record<RecurrenceFrequency, string> = {
      [RecurrenceFrequency.DAILY]: interval === 1 ? 'dia' : 'dias',
      [RecurrenceFrequency.WEEKLY]: interval === 1 ? 'semana' : 'semanas',
      [RecurrenceFrequency.MONTHLY]: interval === 1 ? 'mês' : 'meses',
      [RecurrenceFrequency.YEARLY]: interval === 1 ? 'ano' : 'anos',
    }

    const unit = frequencyMap[frequency as RecurrenceFrequency]
    return interval === 1
      ? `Repete todo ${unit}`
      : `Repete a cada ${interval} ${unit}`
  }

  return (
    <div className="space-y-3 p-3 bg-muted/20 rounded-lg border">
      <div className="flex items-center gap-2">
        <MdRepeat className="h-4 w-4 text-primary" />
        <h3 className="font-medium text-sm">Configuração de Recorrência</h3>
      </div>

      {/* Preview da recorrência */}
      {frequency && (
        <Alert className="py-2 bg-green-500/10 border-green-500/20">
          <MdInfo className="h-3 w-3 text-green-600" />
          <AlertDescription className="text-xs text-green-700">
            {getRecurrenceDescription()}
          </AlertDescription>
        </Alert>
      )}

      {/* Grid compacto: Frequência + Intervalo na mesma linha */}
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          name="frequency"
          label="Frequência"
          placeholder="Selecione"
          options={frequencyOptions}
          icon={MdEventRepeat}
          required
        />

        <InputField
          name="interval"
          label="A cada"
          type="number"
          placeholder="1"
          icon={MdRepeat}
          required
          min={1}
          max={99}
        />
      </div>

      {/* Datas: Início + Toggle de término */}
      <div className="grid grid-cols-2 gap-3">
        <DateField
          name="start_date"
          label="Data de Início"
          icon={MdCalendarToday}
          required
          align="end"
        />

        <div className="flex items-end">
          <SwitchField
            name="has_end_date"
            label="Definir término"
            variant="outline"
          />
        </div>
      </div>

      {/* Data de término (condicional) */}
      {hasEndDate && (
        <DateField
          name="end_date"
          label="Data de Término"
          icon={MdCalendarToday}
          align="end"
        />
      )}

      {/* Toggle: Criar primeira transação */}
      <div className="pt-2 border-t">
        <SwitchField
          name="create_first_transaction"
          label="Criar primeira transação imediatamente"
          variant="outline"
          description="A primeira transação será criada na data de início"
        />
      </div>

      {/* Aviso sobre término */}
      {!hasEndDate && (
        <Alert className="py-2">
          <MdInfo className="h-3 w-3" />
          <AlertDescription className="text-xs">
            Sem data de término, a recorrência continuará até ser cancelada.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
