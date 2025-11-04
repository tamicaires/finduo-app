import { useState } from 'react'
import { Users, Trophy, Settings } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@presentation/components/ui/tabs'
import { RippleWrapper } from '@presentation/components/ui/ripple'
import { CoupleInfoTab } from './tabs/CoupleInfoTab'
import { CoupleRankingTab } from './tabs/CoupleRankingTab'
import { CoupleSettingsTab } from './tabs/CoupleSettingsTab'
import { useCoupleRanking } from '@application/hooks/use-couple-ranking'
import { isNoCoupleError } from '@shared/utils/error-handler'
import { LoadingWithLogo } from '@presentation/components/shared/LoadingWithLogo'
import { NoCoupleCard } from '@presentation/components/couple/NoCoupleCard'

export function CoupleManagementPage() {
  const [activeTab, setActiveTab] = useState('ranking')
  const { isLoading, error } = useCoupleRanking()

  // Verifica se não há casal
  const hasNoCouple = error && isNoCoupleError(error)

  // Se ainda está carregando OU se não tem casal, não mostra tabs
  const shouldShowTabs = !isLoading && !hasNoCouple

  return (
    <div className="p-4 md:p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <RippleWrapper
              rippleProps={{
                size: 'sm',
                color: 'primary',
                intensity: 'light',
                rings: 3,
              }}
            >
              <Users className="h-8 w-8 text-primary" />
            </RippleWrapper>
            Gestão do Casal
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Informações, progresso e configurações do relacionamento financeiro
          </p>
        </div>

        {/* Loading state */}
        {isLoading && <LoadingWithLogo message="Carregando..." />}

        {/* No couple state - apenas o card, sem tabs */}
        {!isLoading && hasNoCouple && <NoCoupleCard />}

        {/* Tabs - apenas quando há casal */}
        {shouldShowTabs && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="ranking" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Progresso
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Informações
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ranking" className="mt-0">
              <CoupleRankingTab />
            </TabsContent>

            <TabsContent value="info" className="mt-0">
              <CoupleInfoTab />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <CoupleSettingsTab />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
