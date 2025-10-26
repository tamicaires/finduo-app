import { useCallback } from 'react'
import type { FieldValues, UseFormReturn, FieldPath } from 'react-hook-form'
import {
  phoneMask,
  cpfMask,
  cnpjMask,
  cepMask,
  plateMask,
} from '@shared/utils/masks'
import {
  currencyFormatter,
  numberFormatter,
  parseCurrency,
  parsePercentage,
} from '@shared/utils/number-formatters'
import {
  formatDateTimeLocal,
  parseDateTimeLocal,
} from '@shared/utils/date-formatters'

export type InputFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'month'
  | 'week'
  | 'money'
  | 'percent'
  | 'br-phone'
  | 'cpf'
  | 'cnpj'
  | 'cep'
  | 'plate'
  | 'only-number'

interface UseInputFormatterProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  type?: InputFieldType
  maxPercentage?: number
}

interface UseInputFormatterReturn {
  displayValue: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  getMaxLength: () => number | undefined
  getInputType: () => string
}

/**
 * Custom hook for handling input formatting, masking, and value transformation
 * Encapsulates all logic for different input types (money, phone, CPF, etc.)
 */
export function useInputFormatter<T extends FieldValues = FieldValues>({
  form,
  name,
  type = 'text',
  maxPercentage,
}: UseInputFormatterProps<T>): UseInputFormatterReturn {
  const rawValue = form.watch(name)

  /**
   * Formats the raw value for display based on input type
   */
  const formatValue = useCallback(
    (value: unknown, inputType: InputFieldType): string => {
      if (value === undefined || value === null) return ''

      switch (inputType) {
        case 'money':
          return currencyFormatter.format(Number(value))

        case 'percent':
          return numberFormatter.format(Number(value) * 100)

        case 'br-phone':
          return phoneMask(String(value))

        case 'cpf':
          return cpfMask(String(value))

        case 'cnpj':
          return cnpjMask(String(value))

        case 'cep':
          return cepMask(String(value))

        case 'plate':
          return plateMask(String(value))

        case 'datetime-local':
          return formatDateTimeLocal(value)

        default:
          return String(value)
      }
    },
    []
  )

  /**
   * Processes input value based on type before storing in form
   */
  const processValue = useCallback(
    (input: string, inputType: InputFieldType): number | string | Date | undefined => {
      if (!input) return undefined

      switch (inputType) {
        case 'money':
          return parseCurrency(input)

        case 'percent': {
          let value = parsePercentage(input)
          if (maxPercentage && value > maxPercentage) {
            value = maxPercentage
          }
          return value
        }

        case 'datetime-local':
          return parseDateTimeLocal(input)

        case 'br-phone':
          return phoneMask(input) || undefined

        case 'cpf':
          return cpfMask(input) || undefined

        case 'cnpj':
          return cnpjMask(input) || undefined

        case 'cep':
          return cepMask(input) || undefined

        case 'plate':
          return plateMask(input) || undefined

        case 'only-number':
          return input.replace(/\D/g, '') || undefined

        case 'number': {
          const numericValue = input.replace(/\D/g, '')
          return numericValue ? Number(numericValue) : undefined
        }

        default:
          return input
      }
    },
    [maxPercentage]
  )

  /**
   * Handles input change events
   */
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value
      const processedValue = processValue(input, type)

      if (processedValue !== undefined) {
        form.setValue(name, processedValue as never, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        })
      }
    },
    [form, name, type, processValue]
  )

  /**
   * Gets maximum length for input based on type
   */
  const getMaxLength = useCallback((): number | undefined => {
    const maxLengthMap: Partial<Record<InputFieldType, number>> = {
      'br-phone': 15,
      cnpj: 18,
      cpf: 14,
      cep: 9,
      plate: 8,
    }

    return maxLengthMap[type]
  }, [type])

  /**
   * Determines HTML input type attribute
   */
  const getInputType = useCallback((): string => {
    if (type === 'password') return 'password'
    if (['percent', 'money'].includes(type)) return 'text'
    if (['br-phone', 'cnpj', 'cpf', 'only-number', 'cep'].includes(type)) {
      return 'tel'
    }
    return type
  }, [type])

  return {
    displayValue: formatValue(rawValue, type),
    handleChange,
    getMaxLength,
    getInputType,
  }
}
