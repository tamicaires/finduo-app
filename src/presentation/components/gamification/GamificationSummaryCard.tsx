import { useCoupleRanking } from '@application/hooks/use-couple-ranking'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { Crown, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@presentation/components/ui/button'
import { Link } from 'react-router-dom'

export function GamificationSummaryCard() {
  const { ranking, isLoading, error } = useCoupleRanking()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (error || !ranking) {
    return null
  }

  const { currentUser, partner, winner } = ranking
  const leader = currentUser.isWinner ? currentUser : partner
  const leaderName = currentUser.isWinner ? 'Você' : partner.userName

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Ranking do Casal
          </CardTitle>
          <Link to="/gamification">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              Ver mais
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {winner !== 'tie' ? (
            <>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Crown className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{leaderName} está liderando!</p>
                  <p className="text-xs text-muted-foreground">
                    {leader.totalXp.toLocaleString()} XP • Nível {leader.level}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-3 rounded-lg border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Você</p>
                  <p className="font-bold">{currentUser.totalXp.toLocaleString()} XP</p>
                </div>
                <div className="text-center p-3 rounded-lg border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Parceiro(a)</p>
                  <p className="font-bold">{partner.totalXp.toLocaleString()} XP</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <TrendingUp className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Vocês estão empatados!</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.totalXp.toLocaleString()} XP cada
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
