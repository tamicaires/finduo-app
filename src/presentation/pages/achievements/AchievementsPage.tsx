import { useQuery } from '@tanstack/react-query'
import { Trophy, Lock, Star, TrendingUp, Flame, Target, Coins } from 'lucide-react'
import { achievementService, type Achievement } from '@/application/services/achievement.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Progress } from '@/presentation/components/ui/progress'
import { Badge } from '@/presentation/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { getIconComponent } from '@/shared/utils/icon-mapper'

const categoryIcons: Record<string, typeof Trophy> = {
  TRANSACTIONS: TrendingUp,
  STREAK: Flame,
  BUDGET: Target,
  LEVEL: Star,
  SAVINGS: Coins,
}

const categoryColors: Record<string, string> = {
  TRANSACTIONS: 'bg-blue-500',
  STREAK: 'bg-orange-500',
  BUDGET: 'bg-green-500',
  LEVEL: 'bg-purple-500',
  SAVINGS: 'bg-yellow-500',
}

function AchievementCard({ achievement, isLocked }: { achievement: Achievement; isLocked: boolean }) {
  const AchievementIcon = getIconComponent(achievement.icon)

  return (
    <Card className={`${isLocked ? 'opacity-60' : ''} transition-all hover:shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isLocked ? 'bg-gray-200' : categoryColors[achievement.category]
            }`}
          >
            {isLocked ? (
              <Lock className="h-6 w-6 text-gray-500" />
            ) : AchievementIcon ? (
              <AchievementIcon className="h-6 w-6 text-white" />
            ) : (
              <span className="text-2xl">{achievement.icon}</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${isLocked ? 'text-gray-500' : ''}`}>
                {achievement.name}
              </h3>
              <Badge variant={isLocked ? 'secondary' : 'default'}>
                +{achievement.xp_reward} XP
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>

            {!isLocked && achievement.achieved_at && (
              <p className="mt-2 text-xs text-green-600">
                Desbloqueada em {new Date(achievement.achieved_at).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AchievementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementService.getUserAchievements(),
  })

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Carregando conquistas...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = data ? Math.round((data.unlocked.length / data.total) * 100) : 0

  const groupedUnlocked = data?.unlocked.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) acc[achievement.category] = []
      acc[achievement.category].push(achievement)
      return acc
    },
    {} as Record<string, Achievement[]>,
  )

  const groupedLocked = data?.locked.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) acc[achievement.category] = []
      acc[achievement.category].push(achievement)
      return acc
    },
    {} as Record<string, Achievement[]>,
  )

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-3 text-2xl font-bold md:text-3xl">
          <Trophy className="h-8 w-8 text-primary" />
          Conquistas
        </h1>
        <p className="text-muted-foreground">
          Desbloqueie conquistas e ganhe XP bônus!
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progresso Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {data?.unlocked.length} / {data?.total} conquistas desbloqueadas
              </span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Todas ({data?.total})
          </TabsTrigger>
          <TabsTrigger value="unlocked">
            Desbloqueadas ({data?.unlocked.length})
          </TabsTrigger>
          <TabsTrigger value="locked">
            Bloqueadas ({data?.locked.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries({ ...groupedUnlocked, ...groupedLocked }).map(([category, achievements]) => {
            const CategoryIcon = categoryIcons[category] || Trophy
            return (
              <div key={category}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <CategoryIcon className="h-5 w-5" />
                  {category}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {achievements?.map((achievement) => {
                    const isLocked = !data?.unlocked.find((a) => a.id === achievement.id)
                    return (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        isLocked={isLocked}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </TabsContent>

        <TabsContent value="unlocked" className="space-y-6">
          {groupedUnlocked && Object.entries(groupedUnlocked).map(([category, achievements]) => {
            const CategoryIcon = categoryIcons[category] || Trophy
            return (
              <div key={category}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <CategoryIcon className="h-5 w-5" />
                  {category}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {achievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      isLocked={false}
                    />
                  ))}
                </div>
              </div>
            )
          })}
          {!groupedUnlocked && (
            <p className="py-8 text-center text-muted-foreground">
              Nenhuma conquista desbloqueada ainda. Continue usando o app!
            </p>
          )}
        </TabsContent>

        <TabsContent value="locked" className="space-y-6">
          {groupedLocked && Object.entries(groupedLocked).map(([category, achievements]) => {
            const CategoryIcon = categoryIcons[category] || Trophy
            return (
              <div key={category}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <CategoryIcon className="h-5 w-5" />
                  {category}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {achievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      isLocked={true}
                    />
                  ))}
                </div>
              </div>
            )
          })}
          {!groupedLocked && (
            <p className="py-8 text-center text-muted-foreground">
              Parabéns! Você desbloqueou todas as conquistas!
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
