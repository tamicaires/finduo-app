import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdPayment,
  MdMoreVert,
  MdWarning
} from 'react-icons/md'
import { Card, CardContent } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Badge } from '@presentation/components/ui/badge'
import { PaymentModal } from '@presentation/components/shared/PaymentModal'
import { formatCurrency } from '@shared/utils/format-currency'
import { cn } from '@shared/utils'
import type { RecurringOccurrence } from '@application/hooks/use-recurring-occurrences'

interface OccurrenceCardProps {
  occurrence: RecurringOccurrence
  templateDescription: string
  amount: number
  onPay: (occurrenceId: string, transactionDate?: string) => void
  onSkip: (occurrenceId: string) => void
  isPaying?: boolean
  isSkipping?: boolean
  isOverdue?: boolean
  isPastDue?: boolean
}

export function OccurrenceCard({
  occurrence,
  templateDescription,
  amount,
  onPay,
  onSkip,
  isPaying,
  isSkipping,
  isOverdue,
  isPastDue,
}: OccurrenceCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const isPending = occurrence.status === 'PENDING'
  const isPaid = occurrence.status === 'PAID'
  const isSkippedStatus = occurrence.status === 'SKIPPED'

  const dueDate = new Date(occurrence.due_date)
  const formattedDate = dueDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const getStatusConfig = () => {
    if (isPaid) {
      return {
        icon: MdCheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-500/15',
        borderColor: 'border-green-500/25',
        label: 'Pago',
        badgeVariant: 'default' as const,
      }
    }
    if (isSkippedStatus) {
      return {
        icon: MdCancel,
        color: 'text-gray-600',
        bgColor: 'bg-gray-500/15',
        borderColor: 'border-gray-500/25',
        label: 'Pulado',
        badgeVariant: 'secondary' as const,
      }
    }
    if (isOverdue) {
      return {
        icon: MdWarning,
        color: 'text-red-600',
        bgColor: 'bg-red-500/15',
        borderColor: 'border-red-200',
        label: 'Vencido há +30 dias',
        badgeVariant: 'destructive' as const,
      }
    }
    if (isPastDue) {
      return {
        icon: MdWarning,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/15',
        borderColor: 'border-yellow-500/25',
        label: 'Atrasado',
        badgeVariant: 'destructive' as const,
      }
    }
    return {
      icon: MdSchedule,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/15',
      borderColor: 'border-blue-500/25',
      label: 'Pendente',
      badgeVariant: 'outline' as const,
    }
  }

  const status = getStatusConfig()
  const StatusIcon = status.icon

  const handlePay = () => {
    if (!isOverdue && isPending) {
      setShowPaymentModal(true)
      setShowActions(false)
    }
  }

  const handleConfirmPayment = (transactionDate?: string) => {
    onPay(occurrence.id, transactionDate)
    setShowPaymentModal(false)
  }

  const handleSkip = () => {
    if (isPending) {
      onSkip(occurrence.id)
      setShowActions(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={cn(
            'relative overflow-hidden transition-all duration-300 hover:shadow-md',
            status.borderColor,
            'border-l-4'
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              {/* Left: Icon and Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={cn('p-2 rounded-lg', status.bgColor)}>
                  <StatusIcon className={cn('h-5 w-5', status.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {templateDescription || 'Sem descrição'}
                    </h4>
                    <Badge variant={status.badgeVariant} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MdSchedule className="h-3.5 w-3.5" />
                      {formattedDate}
                    </span>
                    <span className="font-semibold text-sm text-foreground">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {showActions && isPending && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-2"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSkip}
                        disabled={isSkipping}
                        className="h-8 text-xs"
                      >
                        <MdCancel className="h-3.5 w-3.5 mr-1" />
                        Pular
                      </Button>

                      {!isOverdue && (
                        <Button
                          size="sm"
                          onClick={handlePay}
                          disabled={isPaying}
                          className="h-8 text-xs"
                        >
                          <MdPayment className="h-3.5 w-3.5 mr-1" />
                          Pagar
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {isPending && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowActions(!showActions)}
                    className="h-8 w-8 p-0"
                  >
                    <MdMoreVert className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Warning message for overdue */}
            {isOverdue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-red-200"
              >
                <p className="text-xs text-red-600 flex items-start gap-2">
                  <MdWarning className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Esta ocorrência está vencida há mais de 30 dias e não pode ser paga automaticamente.
                    Entre em contato com o suporte se necessário.
                  </span>
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleConfirmPayment}
        title="Pagar Ocorrência"
        description={templateDescription || 'Sem descrição'}
        amount={amount}
        dueDate={occurrence.due_date}
        isPaying={isPaying}
      />
    </>
  )
}
