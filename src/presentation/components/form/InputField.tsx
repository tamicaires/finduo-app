import { useCallback, useRef, useState, type ComponentProps } from 'react'
import { useFormContext } from 'react-hook-form'
import { Eye, EyeOff, type LucideProps } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@presentation/components/ui/form'
import { Input } from '@presentation/components/ui/input'
import { useInputFormatter, type InputFieldType } from '@application/hooks/useInputFormatter'
import { cn } from '@shared/utils'

interface InputFieldProps extends Omit<ComponentProps<'input'>, 'name' | 'type'> {
  name: string
  label?: string
  description?: string
  icon?: React.ComponentType<LucideProps>
  type?: InputFieldType
  maxPercentage?: number
  suppressError?: boolean
  inputClassName?: string
}

/**
 * Enhanced input field component with support for various Brazilian formats
 * Supports: money, phone, CPF, CNPJ, CEP, percentages, and more
 */
export function InputField({
  name,
  label,
  description,
  icon: Icon,
  type = 'text',
  maxPercentage,
  suppressError,
  inputClassName,
  className,
  required,
  ...inputProps
}: InputFieldProps) {
  const form = useFormContext()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { displayValue, handleChange, getMaxLength, getInputType } = useInputFormatter({
    form,
    name,
    type,
    maxPercentage,
  })

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : getInputType()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={cn('relative', className)}>
              {/* Icon */}
              {Icon && (
                <Icon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer z-10"
                  onClick={focusInput}
                />
              )}

              {/* Input */}
              <Input
                {...inputProps}
                ref={(element) => {
                  inputRef.current = element
                  if (typeof field.ref === 'function') {
                    field.ref(element)
                  }
                }}
                type={inputType}
                value={displayValue}
                onChange={handleChange}
                onBlur={field.onBlur}
                maxLength={getMaxLength()}
                className={cn(
                  'w-full h-12 px-3 pt-4 pb-2 text-sm bg-background rounded-md border-2 border-border',
                  'focus:outline-none focus:ring-0',
                  Icon && 'pl-10',
                  inputClassName
                )}
              />

              {/* Floating Label */}
              {label && (
                <label
                  className="absolute left-3 top-[-6px] text-xs font-medium bg-background px-1 cursor-pointer"
                  onClick={focusInput}
                >
                  {label}
                  {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
              )}

              {/* Password Toggle */}
              {type === 'password' && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              )}
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          {!suppressError && <FormMessage />}
        </FormItem>
      )}
    />
  )
}
