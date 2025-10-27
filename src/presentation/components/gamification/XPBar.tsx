import { Progress } from '@presentation/components/ui/progress'
import { cn } from '@/lib/utils'

interface XPBarProps {
  currentXp: number
  totalXp: number
  level: number
  xpForNextLevel: number
  progressPercentage: number
  className?: string
  showDetails?: boolean
}

export function XPBar({
  currentXp,
  totalXp,
  level,
  xpForNextLevel,
  progressPercentage,
  className,
  showDetails = true,
}: XPBarProps) {
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100
  const xpInCurrentLevel = totalXp - xpForCurrentLevel
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel

  return (
    <div className={cn('space-y-2', className)}>
      {showDetails && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            XP: {xpInCurrentLevel.toLocaleString()} / {xpNeededForLevel.toLocaleString()}
          </span>
          <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Nível {level}
          </span>
        </div>
      )}

      <div className="relative">
        <Progress
          value={progressPercentage}
          className="h-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950"
          indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
        />

        {showDetails && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {showDetails && (
        <p className="text-xs text-muted-foreground text-center">
          {(xpNeededForLevel - xpInCurrentLevel).toLocaleString()} XP para o próximo nível
        </p>
      )}
    </div>
  )
}
