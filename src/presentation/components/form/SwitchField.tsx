import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@presentation/components/ui/form'
import { Switch } from '@presentation/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@presentation/components/ui/tooltip'
import { useSwitchVariants, type SwitchVariant } from '@application/hooks/useSwitchVariants'
import { cn } from '@shared/utils'
import { Info } from 'lucide-react'

interface SwitchFieldProps {
  name: string
  label: string
  variant?: SwitchVariant
  description?: string
  tooltipMessage?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

/**
 * Switch field component integrated with React Hook Form
 * Provides a styled switch with label, description, and optional tooltip
 * Supports multiple variants for different visual contexts
 */
export function SwitchField({
  name,
  label,
  variant = 'default',
  description,
  tooltipMessage,
  disabled = false,
  required = false,
  className,
}: SwitchFieldProps) {
  const form = useFormContext()
  const variantClasses = useSwitchVariants(variant)

  if (!form) {
    throw new Error('SwitchField must be used within a FormProvider')
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-row items-center justify-between rounded-lg border p-4 transition-colors',
            variantClasses.container,
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <div className="space-y-1 flex-1 pr-2">
            <div className="flex items-center gap-2">
              <FormLabel
                className={cn(
                  'text-base leading-none cursor-pointer',
                  variantClasses.label,
                  disabled && 'cursor-not-allowed'
                )}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>

              {tooltipMessage && (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      onClick={(e) => e.preventDefault()}
                    >
                      <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-xs bg-popover text-popover-foreground border border-border shadow-md"
                      sideOffset={8}
                    >
                      <div className="flex items-start gap-2 p-1">
                        <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed">{tooltipMessage}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {description && (
              <FormDescription className={cn('text-sm', variantClasses.description)}>
                {description}
              </FormDescription>
            )}

            <FormMessage />
          </div>

          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={cn(variantClasses.switch)}
              aria-label={label}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
