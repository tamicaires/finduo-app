import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XPBar } from './XPBar'
import { LevelBadge } from './LevelBadge'
import { useGameProfile } from '@application/hooks/use-game-profile'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { Gamepad2, Flame } from 'lucide-react'

export function GamificationCard() {
  const { gameProfile, isLoading, error } = useGameProfile()

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardContent className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (error || !gameProfile) {
    return null
  }

  const { profile, xpForNextLevel, progressPercentage, levelName } = gameProfile

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-600" />
            Seu Progresso
          </CardTitle>
          <LevelBadge level={profile.level} levelName={levelName} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <XPBar
          currentXp={profile.current_xp}
          totalXp={profile.total_xp}
          level={profile.level}
          xpForNextLevel={xpForNextLevel}
          progressPercentage={progressPercentage}
        />

        {profile.current_streak > 0 && (
          <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
            <Flame className="w-4 h-4" />
            <span className="font-semibold">
              {profile.current_streak} {profile.current_streak === 1 ? 'dia' : 'dias'} de sequência!
            </span>
            {profile.current_streak >= 7 && (
              <span className="ml-auto text-xs">🔥 Em chamas!</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <p className="text-muted-foreground text-xs mb-1">Total XP</p>
            <p className="font-bold text-lg">{profile.total_xp.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <p className="text-muted-foreground text-xs mb-1">Maior Sequência</p>
            <p className="font-bold text-lg">{profile.longest_streak} dias</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
