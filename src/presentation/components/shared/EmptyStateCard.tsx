import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { cn } from '@shared/utils'

interface EmptyStateCardProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  variant?: 'default' | 'warning' | 'info' | 'error'
  children?: ReactNode
  className?: string
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  children,
  className,
}: EmptyStateCardProps) {
  const variantStyles = {
    default: {
      container: 'border-muted bg-muted/20',
      iconBg: 'bg-muted',
      icon: 'text-muted-foreground',
      title: 'text-foreground',
      description: 'text-muted-foreground',
    },
    info: {
      container: 'border-primary/20 bg-primary/5',
      iconBg: 'bg-primary/10',
      icon: 'text-primary',
      title: 'text-foreground',
      description: 'text-muted-foreground',
    },
    warning: {
      container: 'border-amber-500/20 bg-amber-500/5',
      iconBg: 'bg-amber-500/10',
      icon: 'text-amber-600 dark:text-amber-500',
      title: 'text-foreground',
      description: 'text-muted-foreground',
    },
    error: {
      container: 'border-destructive/20 bg-destructive/5',
      iconBg: 'bg-destructive/10',
      icon: 'text-destructive',
      title: 'text-foreground',
      description: 'text-muted-foreground',
    },
  }

  const styles = variantStyles[variant]

  return (
    <Card className={cn(styles.container, className)}>
      <CardContent className="flex flex-col items-center justify-center text-center p-8 md:p-12">
        <div className={cn('p-4 rounded-full mb-6', styles.iconBg)}>
          <Icon className={cn('h-10 w-10', styles.icon)} />
        </div>

        <h3 className={cn('text-xl font-semibold mb-2', styles.title)}>
          {title}
        </h3>

        <p className={cn('text-sm mb-6 max-w-md', styles.description)}>
          {description}
        </p>

        {children}

        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant={variant === 'error' ? 'destructive' : variant === 'info' ? 'default' : 'outline'}
            className="mt-2"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
