import { MdSchedule, MdWarning } from 'react-icons/md'

interface RecurringStatsProps {
  pendingCount: number
  overdueCount: number
}

export function RecurringStats({ pendingCount, overdueCount }: RecurringStatsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
          <MdSchedule className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
        </div>
      </div>

      {overdueCount > 0 && (
        <>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
              <MdWarning className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
