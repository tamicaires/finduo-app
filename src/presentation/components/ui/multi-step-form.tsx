import type { ReactNode } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '@shared/utils'
import { useHaptics } from '@presentation/hooks/use-haptics'

interface Step {
  title: string
  description?: string
  content: ReactNode
  validate?: () => boolean | Promise<boolean>
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: () => void
  onCancel?: () => void
  currentStep?: number
  onStepChange?: (step: number) => void
}

/**
 * Multi-Step Form Component
 * UX inspirada em: Nubank, Uber, Airbnb
 * 
 * Features:
 * - Progress indicator visual
 * - Validação por step
 * - Animações suaves entre steps
 * - Botões adaptativos (Next/Previous/Submit)
 * - Haptic feedback
 */
export function MultiStepForm({
  steps,
  onComplete,
  onCancel,
  currentStep: controlledStep,
  onStepChange,
}: MultiStepFormProps) {
  const [internalStep, setInternalStep] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const haptics = useHaptics()

  // Controlled or uncontrolled
  const currentStep = controlledStep ?? internalStep
  const setCurrentStep = (step: number) => {
    setInternalStep(step)
    onStepChange?.(step)
  }

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const step = steps[currentStep]

  const handleNext = async () => {
    // Validate current step
    if (step.validate) {
      const isValid = await step.validate()
      if (!isValid) {
        haptics.error()
        return
      }
    }

    if (isLastStep) {
      haptics.success()
      onComplete()
    } else {
      haptics.light()
      setDirection(1)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      haptics.light()
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCancel = () => {
    haptics.light()
    onCancel?.()
  }

  // Slide animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div className="flex flex-col">
      {/* Progress Indicator */}
      <StepIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
      />

      {/* Step Content with Animation */}
      <div className="relative min-h-[300px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 overflow-y-auto px-4 py-6"
          >
            {/* Step Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">{step.title}</h3>
              {step.description && (
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>

            {/* Step Content */}
            <div>{step.content}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="border-t bg-background p-4 space-y-3">
        <Button
          type="button"
          onClick={handleNext}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          {isLastStep ? (
            'Concluir'
          ) : (
            <>
              Continuar
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <div className="flex gap-2">
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 h-11"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          )}
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className={cn('h-11', !isFirstStep && 'flex-1')}
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Step Progress Indicator
 * Mostra progresso visual com dots ou progress bar
 */
function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="border-b bg-background px-4 py-4">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Passo {currentStep + 1} de {totalSteps}
        </span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}
