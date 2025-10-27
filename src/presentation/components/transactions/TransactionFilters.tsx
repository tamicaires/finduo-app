import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@presentation/components/ui/button'
import { Input } from '@presentation/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui/select'
import { TransactionType } from '@core/enums/TransactionType'
import { TransactionCategory, TransactionCategoryLabels } from '@core/enums/TransactionCategory'
import { Badge } from '@presentation/components/ui/badge'

export interface TransactionFiltersState {
  type?: TransactionType
  category?: TransactionCategory
  search?: string
  startDate?: string
  endDate?: string
}

interface TransactionFiltersProps {
  filters: TransactionFiltersState
  onFiltersChange: (filters: TransactionFiltersState) => void
  accountsOptions?: Array<{ id: string; name: string }>
}

export function TransactionFilters({
  filters,
  onFiltersChange,
}: TransactionFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState<TransactionFiltersState>(filters)

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    const clearedFilters: TransactionFiltersState = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    setShowFilters(false)
  }

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof TransactionFiltersState] !== undefined
  ).length

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição..."
            value={localFilters.search || ''}
            onChange={(e) => {
              const newFilters = { ...localFilters, search: e.target.value || undefined }
              setLocalFilters(newFilters)
              onFiltersChange(newFilters)
            }}
            className="pl-9"
          />
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {filters.type === TransactionType.INCOME ? 'Receita' : 'Despesa'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, type: undefined })
                }
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Categoria: {TransactionCategoryLabels[filters.category]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, category: undefined })
                }
              />
            </Badge>
          )}
          {filters.startDate && (
            <Badge variant="secondary" className="gap-1">
              De: {new Date(filters.startDate).toLocaleDateString('pt-BR')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, startDate: undefined })
                }
              />
            </Badge>
          )}
          {filters.endDate && (
            <Badge variant="secondary" className="gap-1">
              Até: {new Date(filters.endDate).toLocaleDateString('pt-BR')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, endDate: undefined })
                }
              />
            </Badge>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={localFilters.type || 'all'}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    type: value === 'all' ? undefined : (value as TransactionType),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value={TransactionType.INCOME}>Receita</SelectItem>
                  <SelectItem value={TransactionType.EXPENSE}>Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={localFilters.category || 'all'}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    category: value === 'all' ? undefined : (value as TransactionCategory),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Object.entries(TransactionCategoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Inicial</label>
              <Input
                type="date"
                value={localFilters.startDate || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    startDate: e.target.value || undefined,
                  })
                }
              />
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Final</label>
              <Input
                type="date"
                value={localFilters.endDate || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    endDate: e.target.value || undefined,
                  })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar
            </Button>
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
          </div>
        </div>
      )}
    </div>
  )
}
