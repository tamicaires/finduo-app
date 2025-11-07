import { motion } from 'framer-motion'
import { InstallmentGroupCard } from './InstallmentGroupCard'
import { useInstallments } from '@application/hooks/use-installment-templates'
import type { InstallmentTemplate } from '@application/hooks/use-installment-templates'

interface InstallmentGroupCardWrapperProps {
  template: InstallmentTemplate
  index: number
  onActivateTemplate: (templateId: string) => void
  onDeactivateTemplate: (templateId: string) => void
  onDeleteTemplate: (templateId: string) => void
  isActivating?: boolean
  isDeactivating?: boolean
  isDeleting?: boolean
}

export function InstallmentGroupCardWrapper({
  template,
  index,
  onActivateTemplate,
  onDeactivateTemplate,
  onDeleteTemplate,
  isActivating,
  isDeactivating,
  isDeleting,
}: InstallmentGroupCardWrapperProps) {
  const {
    installments,
    payInstallment,
    skipInstallment,
    isPaying,
    isSkipping,
    getProgress,
  } = useInstallments(template.id)

  const progress = getProgress()

  const handlePayInstallment = (installmentId: string, transactionDate?: string) => {
    payInstallment({ installment_id: installmentId, transaction_date: transactionDate })
  }

  const handleSkipInstallment = (installmentId: string) => {
    skipInstallment(installmentId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <InstallmentGroupCard
        template={template}
        installments={installments}
        progress={progress}
        onPayInstallment={handlePayInstallment}
        onSkipInstallment={handleSkipInstallment}
        onActivateTemplate={onActivateTemplate}
        onDeactivateTemplate={onDeactivateTemplate}
        onDeleteTemplate={onDeleteTemplate}
        isPaying={isPaying}
        isSkipping={isSkipping}
        isActivating={isActivating}
        isDeactivating={isDeactivating}
        isDeleting={isDeleting}
      />
    </motion.div>
  )
}
