import { useGameProfile } from '@application/hooks/use-game-profile'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { XPBar } from '@presentation/components/gamification/XPBar'
import { LevelBadge } from '@presentation/components/gamification/LevelBadge'
import { Gamepad2, Flame, Trophy, Target, Zap } from 'lucide-react'

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
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-6">
              <p className="text-red-600">Erro ao carregar perfil de gamificação: {error}</p>
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
              <p>Nenhum perfil de gamificação encontrado.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { profile, xpForNextLevel, progressPercentage, levelName } = gameProfile

  return (
    <div className="p-6 md:p-8 space-y-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-purple-600" />
            Seu Progresso no FindUO
          </h2>
          <p className="text-muted-foreground">
            Acompanhe seu nível, XP e conquistas enquanto gerencia suas finanças
          </p>
        </div>

        {/* Main Stats Card */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {/* Level & XP Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  Nível & Experiência
                </CardTitle>
                <LevelBadge level={profile.level} levelName={levelName} size="lg" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <XPBar
                currentXp={profile.current_xp}
                totalXp={profile.total_xp}
                level={profile.level}
                xpForNextLevel={xpForNextLevel}
                progressPercentage={progressPercentage}
              />

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-background/50 rounded-lg border">
                  <p className="text-muted-foreground text-xs mb-2">XP Atual</p>
                  <p className="font-bold text-2xl text-purple-600">{profile.current_xp}</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border">
                  <p className="text-muted-foreground text-xs mb-2">Total XP</p>
                  <p className="font-bold text-2xl text-blue-600">{profile.total_xp.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Sequência de Atividade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Flame className="w-12 h-12 text-orange-500" />
                    <span className="text-6xl font-bold text-orange-600">{profile.current_streak}</span>
                  </div>
                  <p className="text-muted-foreground">
                    {profile.current_streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-background/50 rounded-lg border">
                  <p className="text-muted-foreground text-xs mb-2">Sequência Atual</p>
                  <p className="font-bold text-2xl text-orange-600">{profile.current_streak}</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border">
                  <p className="text-muted-foreground text-xs mb-2">Recorde</p>
                  <p className="font-bold text-2xl text-orange-600">{profile.longest_streak}</p>
                </div>
              </div>

              {profile.current_streak >= 7 && (
                <div className="bg-orange-100 dark:bg-orange-950/30 p-4 rounded-lg text-center">
                  <p className="text-orange-600 font-semibold">🔥 Você está em chamas!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* XP Rewards Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Como Ganhar XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Target className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold mb-1">+10 XP</p>
                  <p className="text-sm text-muted-foreground">Registrar uma transação</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Trophy className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold mb-1">+50 XP</p>
                  <p className="text-sm text-muted-foreground">Ficar dentro do orçamento mensal</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Flame className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <p className="font-semibold mb-1">+200 XP</p>
                  <p className="text-sm text-muted-foreground">Manter streak de 7 dias</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Dica:</strong> Continue usando o FindUO diariamente para aumentar sua sequência e ganhar mais XP!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Level System Info */}
        <Card>
          <CardHeader>
            <CardTitle>Sistema de Níveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <LevelBadge level={1} levelName="Casal Iniciante" showName={true} />
                <span className="text-sm text-muted-foreground">0 XP</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <LevelBadge level={2} levelName="Casal Organizado" showName={true} />
                <span className="text-sm text-muted-foreground">100 XP</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <LevelBadge level={3} levelName="Casal Poupador" showName={true} />
                <span className="text-sm text-muted-foreground">400 XP</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <LevelBadge level={4} levelName="Casal Investidor" showName={true} />
                <span className="text-sm text-muted-foreground">900 XP</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <LevelBadge level={5} levelName="Casal Estrategista" showName={true} />
                <span className="text-sm text-muted-foreground">1.600 XP</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <LevelBadge level={6} levelName="Casal Milionário" showName={true} />
                <span className="text-sm text-muted-foreground">2.500+ XP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
