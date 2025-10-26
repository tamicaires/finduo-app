import { useState, useEffect, useCallback, useRef } from 'react'

export interface SelectOption {
  value: string
  label: string
  description?: string | null
  icon?: React.ElementType<{ className?: string }>
}

interface UseSelectStateProps {
  options: SelectOption[]
  value?: string | string[]
  multiple?: boolean
  disabled?: boolean
  onChange: (value: string | string[] | undefined) => void
  onBlur?: () => void
}

interface UseSelectStateReturn {
  isOpen: boolean
  searchTerm: string
  selectedOptions: SelectOption[]
  filteredOptions: SelectOption[]
  isPositionTop: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
  searchInputRef: React.RefObject<HTMLInputElement | null>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSearchTerm: (value: string) => void
  setIsPositionTop: (value: boolean) => void
  handleOptionSelect: (option: SelectOption) => void
  handleClear: (e: React.MouseEvent) => void
  handleKeyDown: (event: React.KeyboardEvent) => void
  handleOptionKeyDown: (event: React.KeyboardEvent, option: SelectOption) => void
  isOptionSelected: (option: SelectOption) => boolean
}

/**
 * Custom hook for managing select component state and behavior
 * Handles single/multiple selection, keyboard navigation, and search filtering
 */
export function useSelectState({
  options,
  value,
  multiple = false,
  disabled = false,
  onChange,
  onBlur,
}: UseSelectStateProps): UseSelectStateReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([])
  const [isPositionTop, setIsPositionTop] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Sync selected options with form value
  useEffect(() => {
    if (value === undefined) {
      setSelectedOptions([])
      return
    }

    if (multiple) {
      const values = Array.isArray(value) ? value : [value]
      const selected = options.filter((option) => values.includes(option.value))
      setSelectedOptions(selected)
    } else {
      const selected = options.find((option) => option.value === value)
      setSelectedOptions(selected ? [selected] : [])
    }
  }, [value, options, multiple])

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle option selection
  const handleOptionSelect = useCallback(
    (option: SelectOption) => {
      if (disabled) return

      if (multiple) {
        const isSelected = selectedOptions.some((item) => item.value === option.value)
        const newSelectedOptions = isSelected
          ? selectedOptions.filter((item) => item.value !== option.value)
          : [...selectedOptions, option]

        setSelectedOptions(newSelectedOptions)
        onChange(newSelectedOptions.map((opt) => opt.value))
        setSearchTerm('')
      } else {
        setSelectedOptions([option])
        onChange(option.value)
        setIsOpen(false)
        setSearchTerm('')
      }
    },
    [disabled, multiple, selectedOptions, onChange]
  )

  // Clear selection
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedOptions([])
      onChange(multiple ? [] : undefined)
    },
    [multiple, onChange]
  )

  // Keyboard navigation for trigger
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return

      if (event.key === ' ') {
        event.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (event.key === 'Escape') {
        setIsOpen(false)
      } else if (event.key === 'ArrowDown' && isOpen) {
        event.preventDefault()
        const firstOption = containerRef.current?.querySelector('[role="option"]') as HTMLElement
        firstOption?.focus()
      }
    },
    [disabled, isOpen]
  )

  // Keyboard navigation for options
  const handleOptionKeyDown = useCallback(
    (event: React.KeyboardEvent, option: SelectOption) => {
      if (disabled) return

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleOptionSelect(option)
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const options = containerRef.current?.querySelectorAll('[role="option"]')
        const currentIndex = Array.from(options || []).indexOf(event.target as HTMLElement)
        const nextIndex =
          event.key === 'ArrowDown'
            ? (currentIndex + 1) % options!.length
            : (currentIndex - 1 + options!.length) % options!.length
        ;(options![nextIndex] as HTMLElement).focus()
      }
    },
    [disabled, handleOptionSelect]
  )

  // Check if option is selected
  const isOptionSelected = useCallback(
    (option: SelectOption) => {
      return selectedOptions.some((item) => item.value === option.value)
    },
    [selectedOptions]
  )

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
        onBlur?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  return {
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
  }
}
