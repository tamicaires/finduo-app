import { Card, CardContent } from '@presentation/components/ui/card'
import { cn } from '@shared/utils'
import type { LucideProps } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon: React.ComponentType<LucideProps>
  trend?: {
    value: string
    isPositive: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'
  className?: string
}

const variantStyles = {
  default: {
    card: 'border-l-4 border-l-slate-400 bg-card dark:bg-card',
    icon: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    trend: 'text-slate-600 dark:text-slate-400',
  },
  secondary: {
    card: 'border-l-4 border-l-indigo-400 bg-card dark:bg-card',
    icon: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    trend: 'text-indigo-600 dark:text-indigo-400',
  },
  success: {
    card: 'border-l-4 border-l-emerald-400 bg-card dark:bg-card',
    icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    trend: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    card: 'border-l-4 border-l-amber-400 bg-card dark:bg-card',
    icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    trend: 'text-amber-600 dark:text-amber-400',
  },
  danger: {
    card: 'border-l-4 border-l-rose-400 bg-card dark:bg-card',
    icon: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
    trend: 'text-rose-600 dark:text-rose-400',
  },
  info: {
    card: 'border-l-4 border-l-sky-400 bg-card dark:bg-card',
    icon: 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400',
    trend: 'text-sky-600 dark:text-sky-400',
  },
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', styles.card, className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{value}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className={cn('flex items-center gap-1 text-sm font-medium mt-2', styles.trend)}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{trend.value}</span>
                <span className="text-xs text-muted-foreground">vs mês anterior</span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-xl', styles.icon)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
