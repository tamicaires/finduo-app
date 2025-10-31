import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { GeneralSettingsSection } from './components/GeneralSettingsSection'
import { useCoupleSettings } from '@application/hooks/use-couple-settings'
import { FinancialModelSection } from './components/FinancialModelSection'

export function CoupleSettingsTab() {
  const {
    settings,
    isLoading,
    isSaving,
    fetchSettings,
    updateSettings,
    updateFinancialModel,
  } = useCoupleSettings()

  const [localSettings, setLocalSettings] = useState({
    free_spending_a_monthly: 0,
    free_spending_b_monthly: 0,
    reset_day: 1,
  })

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    // Atualiza os valores locais quando os settings do servidor chegarem
    setLocalSettings({
      free_spending_a_monthly: settings.free_spending_a_monthly,
      free_spending_b_monthly: settings.free_spending_b_monthly,
      reset_day: settings.reset_day,
    })
  }, [settings])
  console.log("settings", settings);
  
  const handleSave = async () => {
    await updateSettings(localSettings)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FinancialModelSection
        currentModel={settings.financial_model}
        allowPersonalAccounts={settings.allow_personal_accounts}
        allowPrivateTransactions={settings.allow_private_transactions}
        onUpdateModel={(model, reason) => updateFinancialModel({ financial_model: model, reason })}
      />

      <GeneralSettingsSection
        freeSpendingA={localSettings.free_spending_a_monthly}
        freeSpendingB={localSettings.free_spending_b_monthly}
        resetDay={localSettings.reset_day}
        isSaving={isSaving}
        onFreeSpendingAChange={(value) =>
          setLocalSettings(prev => ({ ...prev, free_spending_a_monthly: value }))
        }
        onFreeSpendingBChange={(value) =>
          setLocalSettings(prev => ({ ...prev, free_spending_b_monthly: value }))
        }
        onResetDayChange={(value) =>
          setLocalSettings(prev => ({ ...prev, reset_day: value }))
        }
        onSave={handleSave}
      />
    </div>
  )
}
