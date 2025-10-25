import { cn } from '@shared/utils/cn'

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-destructive/10 p-3 text-sm text-destructive',
        className
      )}
    >
      {message}
    </div>
  )
}
