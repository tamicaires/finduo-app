import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@shared/utils'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@presentation/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@presentation/components/ui/popover'
import { Calendar } from '@presentation/components/ui/calendar'

interface DateFieldProps {
  name: string
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  icon?: React.ComponentType<{ className?: string }>
  align?: 'start' | 'end' | 'center'
}

export function DateField({
  name,
  label,
  description,
  placeholder = 'Selecione uma data',
  disabled = false,
  required = false,
  icon: Icon,
  align = 'start',
}: DateFieldProps) {
  const formContext = useFormContext()
  const [isOpen, setIsOpen] = useState(false)

  if (!formContext) {
    throw new Error('DateField deve ser usado dentro de um FormProvider')
  }

  const { control } = formContext

  // Parse value - aceita Date ou string
  const parseValue = (val: unknown): Date | undefined => {
    if (!val) return undefined
    if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val
    if (typeof val === 'string') {
      const parsed = new Date(val)
      return isNaN(parsed.getTime()) ? undefined : parsed
    }
    return undefined
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = parseValue(field.value)

        return (
          <FormItem className="w-full">
            <div className="relative">
              {/* Label */}
              {label && (
                <label
                  className={cn(
                    'absolute left-3 -top-2 text-xs font-medium bg-background px-1 z-10',
                    Icon && 'left-10'
                  )}
                >
                  {label}
                  {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
              )}

              {/* Icon */}
              {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <Icon className="text-gray-500 dark:text-gray-400 h-4 w-4" />
                </div>
              )}

              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <button
                      type="button"
                      disabled={disabled}
                      className={cn(
                        'flex h-12 w-full px-3 text-sm bg-background rounded-md border-2 border-border',
                        'focus:outline-none focus:ring-0 focus:border-primary',
                        'items-center justify-between hover:bg-background transition-colors',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        Icon && 'pl-10',
                        label && 'pt-4 pb-2',
                        !value && 'text-muted-foreground'
                      )}
                    >
                      {value ? (
                        format(value, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        <span>{placeholder}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align={align}>
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                      field.onChange(date)
                      setIsOpen(false)
                    }}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
