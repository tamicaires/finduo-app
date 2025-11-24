import * as React from 'react'
import { cn } from '@shared/utils'
import { useIsMobile } from '@presentation/hooks/use-is-mobile'

export interface MobileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Tipo de teclado mobile a exibir
   * - 'decimal': Teclado numérico com decimais (para valores monetários)
   * - 'numeric': Teclado numérico simples
   * - 'email': Teclado com @ e .com
   * - 'tel': Teclado de telefone
   * - 'url': Teclado com .com
   */
  mobileKeyboard?: 'decimal' | 'numeric' | 'email' | 'tel' | 'url'
}

/**
 * Input otimizado para mobile
 * - Altura mínima 48px (touch-friendly)
 * - Font-size 16px+ (evita zoom no iOS)
 * - Teclados corretos por tipo
 */
const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, type, mobileKeyboard, ...props }, ref) => {
    const isMobile = useIsMobile()

    // Determinar inputMode baseado no mobileKeyboard
    const getInputMode = (): React.HTMLAttributes<HTMLInputElement>['inputMode'] => {
      if (!isMobile) return undefined
      
      switch (mobileKeyboard) {
        case 'decimal':
          return 'decimal'
        case 'numeric':
          return 'numeric'
        case 'email':
          return 'email'
        case 'tel':
          return 'tel'
        case 'url':
          return 'url'
        default:
          return undefined
      }
    }

    // Para valores monetários, usar type="tel" com inputMode="decimal"
    const inputType = mobileKeyboard === 'decimal' ? 'tel' : type

    return (
      <input
        type={inputType}
        inputMode={getInputMode()}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          // Mobile optimizations
          isMobile && [
            'h-12', // 48px altura (mínimo Apple HIG)
            'text-base', // 16px (evita zoom no iOS)
            'px-4', // Padding maior
          ],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
MobileInput.displayName = 'MobileInput'

export { MobileInput }
