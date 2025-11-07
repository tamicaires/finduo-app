import { MdSearch, MdFilterList } from 'react-icons/md'
import { Button } from '@presentation/components/ui/button'
import { Input } from '@presentation/components/ui/input'

export type FilterType = 'all' | 'pending' | 'paid' | 'overdue'

interface OccurrenceFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
}

const filterLabels: Record<FilterType, string> = {
  all: 'Todos',
  pending: 'Pendentes',
  paid: 'Pagos',
  overdue: 'Vencidos',
}

export function OccurrenceFilters({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}: OccurrenceFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por descrição..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <MdFilterList className="h-4 w-4 text-muted-foreground" />
        {(['all', 'pending', 'paid', 'overdue'] as FilterType[]).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => onFilterChange(f)}
            className="text-xs"
          >
            {filterLabels[f]}
          </Button>
        ))}
      </div>
    </div>
  )
}
