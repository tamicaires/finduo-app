import { cn } from '@shared/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

/**
 * Skeleton para Card de Transação
 */
function TransactionCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
  )
}

/**
 * Skeleton para Card de Conta
 */
function AccountCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-8 w-24" />
      <div className="pt-3 border-t space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  )
}

/**
 * Skeleton para Dashboard Card
 */
function DashboardCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}

/**
 * Skeleton para lista completa
 */
function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TransactionCardSkeleton key={i} />
      ))}
    </>
  )
}

export {
  Skeleton,
  TransactionCardSkeleton,
  AccountCardSkeleton,
  DashboardCardSkeleton,
  ListSkeleton,
}
