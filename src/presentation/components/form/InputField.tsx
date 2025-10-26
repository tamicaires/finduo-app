import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@presentation/components/ui/form'
import { Input } from '@presentation/components/ui/input'
import type { ComponentProps } from 'react'

interface InputFieldProps extends Omit<ComponentProps<typeof Input>, 'name'> {
  name: string
  label: string
}

export function InputField({ name, label, ...inputProps }: InputFieldProps) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
