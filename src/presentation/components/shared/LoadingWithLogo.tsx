import { Card, CardContent } from '@presentation/components/ui/card'
import { AnimatedCoupleRings } from './AnimatedCoupleRings'
import { cn } from '@shared/utils'

interface LoadingWithLogoProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullCard?: boolean
}

export function LoadingWithLogo({
  message = 'Carregando...',
  size = 'md',
  className,
  fullCard = true
}: LoadingWithLogoProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <AnimatedCoupleRings size={size} animate={true} />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  )

  if (fullCard) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}
