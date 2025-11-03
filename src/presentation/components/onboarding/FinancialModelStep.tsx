import { useState } from 'react'
import { MdHandshake, MdSwapHoriz, MdTune } from 'react-icons/md'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { cn } from '@/shared/utils'
import { FINANCIAL_MODEL_LABELS, FINANCIAL_MODEL_FEATURES } from '@/shared/constants/financial-model'
import type { FinancialModel } from '@/core/entities/Couple'

interface FinancialModelStepProps {
  onNext: (model: FinancialModel) => void
  onBack?: () => void
}

interface ModelOption {
  value: FinancialModel
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  features: string[]
  recommended?: boolean
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    value: 'TRANSPARENT',
    icon: MdHandshake,
    title: FINANCIAL_MODEL_LABELS.TRANSPARENT.toUpperCase(),
    subtitle: '"Compartilhamos tudo"',
    features: FINANCIAL_MODEL_FEATURES.TRANSPARENT.map(f => `✓ ${f}`),
  },
  {
    value: 'AUTONOMOUS',
    icon: MdSwapHoriz,
    title: FINANCIAL_MODEL_LABELS.AUTONOMOUS.toUpperCase(),
    subtitle: '"Nosso dinheiro + Meu dinheiro"',
    features: FINANCIAL_MODEL_FEATURES.AUTONOMOUS.map(f => `✓ ${f}`),
    recommended: true,
  },
  {
    value: 'CUSTOM',
    icon: MdTune,
    title: FINANCIAL_MODEL_LABELS.CUSTOM.toUpperCase(),
    subtitle: '"Queremos configurar depois"',
    features: FINANCIAL_MODEL_FEATURES.CUSTOM.map(f => `✓ ${f}`),
  },
]

export function FinancialModelStep({ onNext, onBack }: FinancialModelStepProps) {
  const [selectedModel, setSelectedModel] = useState<FinancialModel>('AUTONOMOUS')

  const handleContinue = () => {
    onNext(selectedModel)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Como vocês gerenciam o dinheiro?</h2>
        <p className="text-muted-foreground text-lg">
          Escolha o modelo que melhor representa o relacionamento financeiro de vocês
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODEL_OPTIONS.map((option) => (
          <Card
            key={option.value}
            className={cn(
              'cursor-pointer transition-all hover:shadow-lg relative',
              selectedModel === option.value
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            )}
            onClick={() => setSelectedModel(option.value)}
          >
            {option.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-2">
                <option.icon className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-lg">{option.title}</CardTitle>
              <CardDescription className="text-sm font-medium">
                {option.subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2 text-sm">
                {option.features.map((feature, index) => (
                  <li key={index} className="text-muted-foreground">
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        )}
        <Button onClick={handleContinue} className={!onBack ? 'ml-auto' : ''}>
          Continuar
        </Button>
      </div>
    </div>
  )
}
