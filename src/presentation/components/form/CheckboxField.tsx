import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@presentation/components/ui/form'
import { Checkbox } from '@presentation/components/ui/checkbox'
import { cn } from '@shared/utils'

interface CheckboxFieldProps {
  name: string
  label: string
  description?: string
  disabled?: boolean
  className?: string
}

/**
 * Checkbox field component integrated with React Hook Form
 * Provides a styled checkbox with label and optional description
 */
export function CheckboxField({
  name,
  label,
  description,
  disabled = false,
  className,
}: CheckboxFieldProps) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4',
            'transition-colors hover:bg-accent/50',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className="mt-0.5"
            />
          </FormControl>
          <div className="space-y-1 leading-none flex-1">
            <FormLabel className={cn('cursor-pointer', disabled && 'cursor-not-allowed')}>
              {label}
            </FormLabel>
            {description && (
              <FormDescription className="text-xs text-muted-foreground">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}
