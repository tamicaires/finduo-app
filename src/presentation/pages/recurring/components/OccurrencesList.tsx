import { motion, AnimatePresence } from 'framer-motion'
import { MdRepeat } from 'react-icons/md'
import { Card, CardContent } from '@presentation/components/ui/card'
import { OccurrenceCard } from '@presentation/components/recurring/OccurrenceCard'
import type { RecurringOccurrence } from '@application/hooks/use-recurring-occurrences'

interface OccurrenceWithMeta extends RecurringOccurrence {
  description: string
  amount: number
}

interface OccurrencesListProps {
  occurrences: OccurrenceWithMeta[]
  searchTerm: string
  onPay: (occurrenceId: string, transactionDate?: string) => void
  onSkip: (occurrenceId: string) => void
  isPaying: boolean
  isSkipping: boolean
  isPastDue: (date: string) => boolean
  isOverdue: (date: string) => boolean
}

export function OccurrencesList({
  occurrences,
  searchTerm,
  onPay,
  onSkip,
  isPaying,
  isSkipping,
  isPastDue,
  isOverdue,
}: OccurrencesListProps) {
  if (occurrences.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MdRepeat className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {searchTerm ? 'Nenhuma ocorrência encontrada' : 'Nenhuma transação recorrente agendada'}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              {searchTerm
                ? 'Tente ajustar os filtros ou termo de busca'
                : 'Crie uma nova transação recorrente na página de transações'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="grid gap-4">
        {occurrences.map((occ, index) => (
          <motion.div
            key={occ.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
          >
            <OccurrenceCard
              occurrence={occ}
              templateDescription={occ.description}
              amount={occ.amount}
              onPay={onPay}
              onSkip={onSkip}
              isPaying={isPaying}
              isSkipping={isSkipping}
              isOverdue={isOverdue(occ.due_date)}
              isPastDue={isPastDue(occ.due_date)}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
