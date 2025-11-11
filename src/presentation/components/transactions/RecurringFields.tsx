import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { MdRepeat, MdCalendarToday, MdEventRepeat, MdInfo, MdCheckCircle } from 'react-icons/md'
import { InputField } from '@presentation/components/form/InputField'
import { DateField } from '@presentation/components/form/DateField'
import { SelectField } from '@presentation/components/form/SelectField'
import { SwitchField } from '@presentation/components/form/SwitchField'
import { Alert, AlertDescription } from '@presentation/components/ui/alert'
import { RecurrenceFrequency, RecurrenceFrequencyLabels } from '@core/enums/RecurrenceFrequency'

export function RecurringFields() {
  const { watch, setValue } = useFormContext()
  const frequency = watch('frequency')
  const interval = watch('interval') || 1
  const hasEndDate = watch('has_end_date')
  const createFirstTransaction = watch('create_first_transaction')

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
      ? `A transação se repetirá a cada ${unit}`
      : `A transação se repetirá a cada ${interval} ${unit}`
  }

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <MdRepeat className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Configuração de Recorrência</h3>
      </div>

      {frequency && (
        <Alert className="bg-green-500/15 border-green-500/25">
          <MdInfo className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm text-green-500">
            {getRecurrenceDescription()}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField
          name="frequency"
          label="Frequência"
          placeholder="Selecione a frequência"
          options={frequencyOptions}
          icon={MdEventRepeat}
          required
          description="Com que frequência a transação se repetirá"
        />

        <InputField
          name="interval"
          label="Intervalo"
          type="number"
          placeholder="Ex: 1"
          icon={MdRepeat}
          required
          min={1}
          max={99}
          description="Repetir a cada quantos períodos"
        />

        <DateField
          name="start_date"
          label="Data de Início"
          icon={MdCalendarToday}
          required
          description="Quando a recorrência começará"
          align="end"
        />

        {hasEndDate && (
          <DateField
            name="end_date"
            label="Data de Término"
            icon={MdCalendarToday}
            description="Quando a recorrência terminará"
            align="end"
          />
        )}
      </div>

      <div className="space-y-3 pt-2">
        <SwitchField
          name="has_end_date"
          label="Definir Data de Término"
          variant="secondary"
          description="Marque para definir quando a recorrência deve parar"
        />

        <div className="flex items-center gap-3 p-3 bg-background rounded-md border">
          <div className={`flex-shrink-0 ${createFirstTransaction ? 'text-primary' : 'text-muted-foreground'}`}>
            <MdCheckCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <SwitchField
              name="create_first_transaction"
              label="Criar Primeira Transação Imediatamente"
              variant="outline"
              description="Se marcado, a primeira transação será criada na data de início"
            />
          </div>
        </div>
      </div>

      {!hasEndDate && (
        <Alert>
          <MdInfo className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Sem data de término, a recorrência continuará indefinidamente até ser cancelada manualmente.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
