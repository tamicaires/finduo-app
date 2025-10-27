import { useGameProfile } from '@application/hooks/use-game-profile'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@presentation/components/ui/card'
import { XPBar } from '@presentation/components/gamification/XPBar'
import { LevelBadge } from '@presentation/components/gamification/LevelBadge'
import { Trophy, Flame, TrendingUp, CheckCircle2, Calendar, Award, Sparkles } from 'lucide-react'
import { CoupleRankingCard } from '@presentation/components/gamification/CoupleRankingCard'

export function GamificationPage() {
  const { gameProfile, isLoading, error } = useGameProfile()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive/50">
            <CardContent className="p-6">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!gameProfile) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Nenhum perfil de gamificação encontrado.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { profile, xpForNextLevel, progressPercentage, levelName } = gameProfile

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progresso</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu nível, experiência e conquistas
        </div>

        {/* Couple Ranking */}
        <CoupleRankingCard />
          </p>
        </div>

        {/* Level & XP Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Nível {profile.level}</CardTitle>
                <CardDescription>{levelName}</CardDescription>
              </div>
              <LevelBadge level={profile.level} levelName={levelName} size="lg" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso para o próximo nível</span>
                <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
              </div>
              <XPBar
                currentXp={profile.current_xp}
                totalXp={profile.total_xp}
                level={profile.level}
                xpForNextLevel={xpForNextLevel}
                progressPercentage={progressPercentage}
                showDetails={false}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{profile.current_xp} XP</span>
                <span>{xpForNextLevel} XP</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">XP Atual</p>
                <p className="text-2xl font-bold">{profile.current_xp}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">{profile.total_xp.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Próximo Nível</p>
                <p className="text-2xl font-bold">{xpForNextLevel - profile.total_xp}</p>
                <p className="text-xs text-muted-foreground">XP restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Streak Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                <CardTitle>Sequência</CardTitle>
              </div>
              <CardDescription>Dias consecutivos de atividade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{profile.current_streak}</span>
                <span className="text-muted-foreground">{profile.current_streak === 1 ? 'dia' : 'dias'}</span>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Recorde:</span>
                  <span className="font-semibold">{profile.longest_streak} dias</span>
                </div>
              </div>

              {profile.current_streak >= 7 && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Sequência incrível! Continue assim 🔥</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Estatísticas</CardTitle>
              </div>
              <CardDescription>Resumo da sua jornada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nível atual</span>
                  <span className="text-sm font-semibold">{profile.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total de XP ganho</span>
                  <span className="text-sm font-semibold">{profile.total_xp.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Maior sequência</span>
                  <span className="text-sm font-semibold">{profile.longest_streak} dias</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Última atividade</span>
                  <span className="text-sm font-semibold">
                    {new Date(profile.last_activity_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Earn XP */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle>Como Ganhar XP</CardTitle>
            </div>
            <CardDescription>Complete ações para subir de nível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Registrar transação</p>
                  <p className="text-xs text-muted-foreground">Adicione receitas e despesas</p>
                </div>
                <span className="text-sm font-semibold">+10 XP</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Award className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ficar dentro do orçamento</p>
                  <p className="text-xs text-muted-foreground">Não ultrapasse seus limites mensais</p>
                </div>
                <span className="text-sm font-semibold">+50 XP</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Flame className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Manter sequência de 7 dias</p>
                  <p className="text-xs text-muted-foreground">Use o app por uma semana consecutiva</p>
                </div>
                <span className="text-sm font-semibold">+200 XP</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Economizar mais que o mês anterior</p>
                  <p className="text-xs text-muted-foreground">Aumente suas reservas</p>
                </div>
                <span className="text-sm font-semibold">+100 XP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level System */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <CardTitle>Sistema de Níveis</CardTitle>
            </div>
            <CardDescription>Evolua através dos níveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { level: 1, name: 'Casal Iniciante', xp: '0 XP' },
                { level: 2, name: 'Casal Organizado', xp: '100 XP' },
                { level: 3, name: 'Casal Poupador', xp: '400 XP' },
                { level: 4, name: 'Casal Investidor', xp: '900 XP' },
                { level: 5, name: 'Casal Estrategista', xp: '1.600 XP' },
                { level: 6, name: 'Casal Milionário', xp: '2.500+ XP' },
              ].map((item) => (
                <div
                  key={item.level}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    profile.level === item.level ? 'bg-muted border-primary' : 'bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LevelBadge level={item.level} levelName={item.name} showName={false} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.xp}</p>
                    </div>
                  </div>
                  {profile.level === item.level && (
                    <span className="text-xs font-medium text-primary">Nível Atual</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
