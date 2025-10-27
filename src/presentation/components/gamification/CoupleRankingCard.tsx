import { useCoupleRanking } from '@application/hooks/use-couple-ranking'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@presentation/components/ui/card'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { LevelBadge } from './LevelBadge'
import { Crown, Trophy, Flame, TrendingUp } from 'lucide-react'
import { Badge } from '@presentation/components/ui/badge'

export function CoupleRankingCard() {
  const { ranking, isLoading, error } = useCoupleRanking()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (error || !ranking) {
    return null
  }

  const { currentUser, partner, winner } = ranking

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          <CardTitle>Ranking do Casal</CardTitle>
        </div>
        <CardDescription>Quem está indo melhor nas finanças?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Current User */}
          <div
            className={`relative p-4 rounded-lg border-2 transition-all ${
              currentUser.isWinner
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            {currentUser.isWinner && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground flex items-center gap-1 px-3">
                  <Crown className="h-3 w-3" />
                  {winner === 'tie' ? 'Empate' : 'Rei/Rainha'}
                </Badge>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{currentUser.userName}</p>
                  <p className="text-xs text-muted-foreground">Você</p>
                </div>
                <LevelBadge
                  level={currentUser.level}
                  levelName={currentUser.levelName}
                  size="sm"
                  showName={false}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>XP Total</span>
                  </div>
                  <span className="font-semibold">{currentUser.totalXp.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Flame className="h-4 w-4" />
                    <span>Sequência</span>
                  </div>
                  <span className="font-semibold">{currentUser.currentStreak} dias</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partner */}
          <div
            className={`relative p-4 rounded-lg border-2 transition-all ${
              partner.isWinner
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            {partner.isWinner && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground flex items-center gap-1 px-3">
                  <Crown className="h-3 w-3" />
                  {winner === 'tie' ? 'Empate' : 'Rei/Rainha'}
                </Badge>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{partner.userName}</p>
                  <p className="text-xs text-muted-foreground">Parceiro(a)</p>
                </div>
                <LevelBadge
                  level={partner.level}
                  levelName={partner.levelName}
                  size="sm"
                  showName={false}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>XP Total</span>
                  </div>
                  <span className="font-semibold">{partner.totalXp.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Flame className="h-4 w-4" />
                    <span>Sequência</span>
                  </div>
                  <span className="font-semibold">{partner.currentStreak} dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Message */}
        {winner !== 'tie' && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-center">
            <p className="text-muted-foreground">
              {currentUser.isWinner
                ? `Você está ${Math.abs(ranking.comparison.xpDifference)} XP à frente! Continue assim! 🎉`
                : `Seu parceiro(a) está ${Math.abs(ranking.comparison.xpDifference)} XP à frente. Você consegue alcançar! 💪`}
            </p>
          </div>
        )}

        {winner === 'tie' && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-center">
            <p className="text-muted-foreground">
              Vocês estão empatados! Que dupla equilibrada! 🤝
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
