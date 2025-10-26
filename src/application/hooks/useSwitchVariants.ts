import { useMemo } from 'react'

export type SwitchVariant = 'default' | 'secondary' | 'outline' | 'warning' | 'success' | 'destructive'

interface VariantClasses {
  container: string
  label: string
  description: string
  switch: string
}

/**
 * Custom hook for managing switch field variant styles
 * Provides consistent styling across different switch variants
 */
export function useSwitchVariants(variant: SwitchVariant = 'default'): VariantClasses {
  return useMemo(() => {
    const variantMap: Record<SwitchVariant, VariantClasses> = {
      default: {
        container: 'border-border bg-background hover:bg-accent/50',
        label: 'text-foreground',
        description: 'text-muted-foreground',
        switch: '',
      },
      secondary: {
        container: 'border-primary/30 bg-primary/5 hover:bg-primary/10',
        label: 'text-primary font-semibold',
        description: 'text-primary/80',
        switch: 'data-[state=checked]:bg-primary',
      },
      outline: {
        container: 'border-2 border-border bg-background hover:border-primary/50',
        label: 'text-foreground font-medium',
        description: 'text-muted-foreground',
        switch: '',
      },
      warning: {
        container: 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10',
        label: 'text-yellow-600 dark:text-yellow-500 font-semibold',
        description: 'text-yellow-600/80 dark:text-yellow-500/80',
        switch: 'data-[state=checked]:bg-yellow-600 dark:data-[state=checked]:bg-yellow-500',
      },
      success: {
        container: 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10',
        label: 'text-green-600 dark:text-green-500 font-semibold',
        description: 'text-green-600/80 dark:text-green-500/80',
        switch: 'data-[state=checked]:bg-green-600 dark:data-[state=checked]:bg-green-500',
      },
      destructive: {
        container: 'border-destructive/30 bg-destructive/5 hover:bg-destructive/10',
        label: 'text-destructive font-semibold',
        description: 'text-destructive/80',
        switch: 'data-[state=checked]:bg-destructive',
      },
    }

    return variantMap[variant]
  }, [variant])
}
