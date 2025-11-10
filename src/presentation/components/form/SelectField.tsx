import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDown, Check, Search, X, type LucideProps } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@presentation/components/ui/form'
import { Badge } from '@presentation/components/ui/badge'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { ErrorMessage } from '@presentation/components/shared/ErrorMessage'
import { useSelectState, type SelectOption } from '@application/hooks/useSelectState'
import { useMediaQuery } from '@application/hooks/useMediaQuery'
import { cn } from '@shared/utils'

export type { SelectOption }

interface SelectFieldProps {
  name: string
  label?: string
  description?: string
  options: SelectOption[]
  placeholder?: string
  emptyText?: string
  isLoading?: boolean
  searchable?: boolean
  disabled?: boolean
  className?: string
  selectClassName?: string
  required?: boolean
  multiple?: boolean
  clearable?: boolean
  icon?: React.ComponentType<LucideProps>
}

/**
 * Enhanced select field component with search, multi-select, and keyboard navigation
 * Integrates with React Hook Form and supports both single and multiple selection
 */
export function SelectField({
  name,
  label,
  description,
  options,
  placeholder = 'Selecione uma opção',
  emptyText = 'Nenhuma opção encontrada',
  isLoading = false,
  searchable = false,
  disabled = false,
  className,
  selectClassName,
  required = false,
  multiple = false,
  clearable = true,
  icon: Icon,
}: SelectFieldProps) {
  const form = useFormContext()
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          <FormControl>
            <SelectComponent
              options={options}
              placeholder={placeholder}
              emptyText={emptyText}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isLoading={isLoading}
              searchable={searchable}
              disabled={disabled}
              className={selectClassName}
              multiple={multiple}
              clearable={clearable}
              label={label}
              required={required}
              icon={Icon}
              isMobile={isMobile}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface SelectComponentProps {
  options: SelectOption[]
  placeholder?: string
  emptyText?: string
  value?: string | string[]
  onChange: (value: string | string[] | undefined) => void
  onBlur?: () => void
  isLoading?: boolean
  searchable?: boolean
  disabled?: boolean
  className?: string
  multiple?: boolean
  clearable?: boolean
  label?: string
  required?: boolean
  icon?: React.ComponentType<LucideProps>
  isMobile: boolean
}

function SelectComponent({
  options,
  placeholder = 'Selecione uma opção',
  emptyText = 'Nenhuma opção encontrada',
  value,
  onChange,
  onBlur,
  isLoading = false,
  searchable = false,
  disabled = false,
  className,
  multiple = false,
  clearable = true,
  label,
  required,
  icon: Icon,
  isMobile,
}: SelectComponentProps) {
  const {
    isOpen,
    searchTerm,
    selectedOptions,
    filteredOptions,
    isPositionTop,
    containerRef,
    searchInputRef,
    setIsOpen,
    setSearchTerm,
    setIsPositionTop,
    handleOptionSelect,
    handleClear,
    handleKeyDown,
    handleOptionKeyDown,
    isOptionSelected,
  } = useSelectState({
    options,
    value,
    multiple,
    disabled,
    onChange,
    onBlur,
  })

  // Update dropdown position on mobile
  useEffect(() => {
    if (isOpen && isMobile && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      setIsPositionTop(rect.bottom + 250 > viewportHeight)
    } else {
      setIsPositionTop(false)
    }
  }, [isOpen, isMobile, setIsPositionTop])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const renderSelectedValue = () => {
    if (selectedOptions.length === 0) {
      return <div className="text-muted-foreground">{placeholder}</div>
    }

    if (multiple) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="flex items-center gap-1 max-w-[200px] truncate rounded-sm"
            >
              {option.icon && <option.icon className="h-4 w-4 flex-shrink-0" />}
              <span className="truncate">{option.label}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOptionSelect(option)
                }}
              />
            </Badge>
          ))}
        </div>
      )
    }

    const selected = selectedOptions[0]
    return (
      <div className="flex items-center gap-2 truncate">
        {selected.icon && <selected.icon className="h-5 w-5 text-primary flex-shrink-0" />}
        <span className="truncate">{selected.label}</span>
      </div>
    )
  }

  const renderOption = (option: SelectOption) => {
    const isSelected = isOptionSelected(option)

    return (
      <li
        key={option.value}
        role="option"
        tabIndex={-1}
        aria-selected={isSelected}
        className={cn(
          'flex items-center gap-3 px-3 py-2 justify-between cursor-pointer',
          'hover:bg-accent focus:bg-accent focus:outline-none',
          isSelected && 'bg-primary/5 text-primary'
        )}
        onClick={() => handleOptionSelect(option)}
        onKeyDown={(e) => handleOptionKeyDown(e, option)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {option.icon && <option.icon className="h-5 w-5 text-primary flex-shrink-0" />}
          <div className="flex flex-col leading-none min-w-0">
            <span className={cn('text-base sm:text-sm truncate', isSelected && 'font-semibold')}>
              {option.label}
            </span>
            {option.description && (
              <span className="text-muted-foreground sm:text-xs truncate">
                {option.description}
              </span>
            )}
          </div>
        </div>
        {isSelected && (
          <div className="bg-primary/20 p-1 rounded-full flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-primary" />
          </div>
        )}
      </li>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Floating Label */}
      {label && (
        <label
          className={cn(
            'absolute text-sm sm:text-xs font-medium bg-background px-1 z-20 truncate cursor-pointer',
            'top-[-6px]',
            Icon ? 'left-10' : 'left-3'
          )}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Icon */}
      {Icon && (
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4 cursor-pointer z-10"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
        />
      )}

      {/* Trigger */}
      <div
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="select-options"
        aria-label={label}
        className={cn(
          'flex items-center justify-between w-full h-12 px-3 pt-4 pb-2 text-base sm:text-sm',
          'bg-background rounded-md border-2 border-border',
          'focus:outline-none focus:ring-0 focus:border-primary',
          Icon && 'pl-10',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'cursor-pointer'
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-wrap gap-1 items-center flex-1 overflow-hidden min-w-0">
          {renderSelectedValue()}
        </div>

        <div className="flex items-center gap-1 ml-1 flex-shrink-0">
          {clearable && selectedOptions.length > 0 && (
            <X
              className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-foreground cursor-pointer transition-colors"
              onClick={handleClear}
              aria-label="Limpar seleção"
            />
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          id="select-options"
          role="listbox"
          aria-label={`${label} opções`}
          className={cn(
            'absolute z-30 mt-2 bg-card border border-input rounded-md shadow-lg w-full',
            isPositionTop && 'bottom-full mb-2 mt-0'
          )}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-1 border-b border-input">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full pl-10 pr-3 py-2 text-base sm:text-sm rounded-md focus:outline-none bg-card"
                  placeholder="Procurar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Buscar opções"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : filteredOptions.length > 0 ? (
            <ul className="py-1 max-h-60 overflow-auto">{filteredOptions.map(renderOption)}</ul>
          ) : (
            <div className="py-8 px-4">
              <ErrorMessage message={emptyText} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
