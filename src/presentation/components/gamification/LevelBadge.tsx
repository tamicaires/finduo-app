import { Badge } from '@presentation/components/ui/badge'
import { cn } from '@/lib/utils'
import { Trophy, Star, Sparkles, Award, Crown, Gem } from 'lucide-react'

interface LevelBadgeProps {
  level: number
  levelName: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

const getLevelIcon = (level: number) => {
  if (level === 1) return Trophy
  if (level === 2) return Star
  if (level === 3) return Sparkles
  if (level === 4) return Award
  if (level === 5) return Crown
  return Gem
}

const getLevelColor = (level: number) => {
  if (level === 1) return 'bg-muted text-muted-foreground'
  if (level === 2) return 'bg-muted text-foreground'
  if (level === 3) return 'bg-muted text-foreground'
  if (level === 4) return 'bg-primary/10 text-primary border-primary/20'
  if (level === 5) return 'bg-primary/20 text-primary border-primary/30'
  return 'bg-primary text-primary-foreground'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
}

export function LevelBadge({
  level,
  levelName,
  className,
  size = 'md',
  showName = true,
}: LevelBadgeProps) {
  const Icon = getLevelIcon(level)
  const colorClass = getLevelColor(level)
  const iconSize = iconSizes[size]

  return (
    <Badge
      className={cn(
        'font-semibold flex items-center gap-1.5',
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      <Icon size={iconSize} />
      {showName ? (
        <span>{levelName}</span>
      ) : (
        <span>Nível {level}</span>
      )}
    </Badge>
  )
}
