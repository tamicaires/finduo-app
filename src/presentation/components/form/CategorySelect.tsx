import { useState, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  MdSearch,
  MdAdd,
  MdCheck,
  MdExpandMore,
  MdClose,
  MdCategory,
} from 'react-icons/md'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@presentation/components/ui/form'
import { Button } from '@presentation/components/ui/button'
import { Input } from '@presentation/components/ui/input'
import { IconPickerDialog } from '@presentation/components/shared/IconPickerDialog'
import { getIconComponent } from '@/shared/utils/icon-mapper'
import { categoryService } from '@/application/services/category.service'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { cn } from '@shared/utils'
import { TbCategoryFilled } from 'react-icons/tb'

interface Category {
  id: string
  name: string
  icon: string
}

interface CategorySelectProps {
  name: string
  label?: string
  description?: string
  categories: Category[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  transactionType: 'INCOME' | 'EXPENSE'
  onCategoryCreated?: () => void
  isLoading?: boolean
}

export function CategorySelect({
  name,
  label,
  description,
  categories,
  placeholder = 'Selecione uma categoria',
  disabled,
  required,
  transactionType,
  onCategoryCreated,
  isLoading,
}: CategorySelectProps) {
  const form = useFormContext()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('MdCategory')
  const [showIconPicker, setShowIconPicker] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedValue = form.watch(name)
  const selectedCategory = categories.find((cat) => cat.id === selectedValue)

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsCreating(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Focus search when opened
  useEffect(() => {
    if (isOpen && !isCreating && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, isCreating])

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; icon: string; type: 'INCOME' | 'EXPENSE' | null; color: string }) => {
      return await categoryService.create(data)
    },
    onSuccess: (newCategory) => {
      toast.success('Categoria criada!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      form.setValue(name, newCategory.id)
      setNewCategoryName('')
      setSelectedIcon('MdCategory')
      setIsCreating(false)
      setIsOpen(false)
      setSearchTerm('')
      onCategoryCreated?.()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar categoria')
    },
  })

  const handleSelectCategory = (categoryId: string) => {
    form.setValue(name, categoryId)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Digite um nome para a categoria')
      return
    }

    createCategoryMutation.mutate({
      name: newCategoryName.trim(),
      icon: selectedIcon,
      type: transactionType,
      color: '#3B82F6', // Default blue color
    })
  }

  const handleStartCreating = () => {
    setIsCreating(true)
    setSearchTerm('')
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
    setNewCategoryName('')
    setSelectedIcon('MdCategory')
  }

  const IconComponent = selectedCategory
    ? getIconComponent(selectedCategory.icon)
    : null

  const NewIconComponent = getIconComponent(selectedIcon)

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="w-full">
          <FormControl>
            <div ref={containerRef} className="relative w-full">
              {/* Label */}
              {label && (
                <label
                  className={cn(
                    'absolute text-sm font-medium bg-background px-1 z-20 truncate cursor-pointer',
                    'top-[-6px] left-10'
                  )}
                  onClick={() => !disabled && setIsOpen((prev) => !prev)}
                >
                  {label}
                  {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
              )}

              {/* Trigger */}
              <div
                className={cn(
                  'flex items-center justify-between w-full h-12 px-3 pt-4 pb-2',
                  'bg-background rounded-md border-2 border-border',
                  'focus-within:border-primary transition-colors cursor-pointer',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {IconComponent ? (
                    <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <MdCategory className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      'truncate text-sm',
                      !selectedCategory && 'text-muted-foreground'
                    )}
                  >
                    {selectedCategory?.name || placeholder}
                  </span>
                </div>

                <MdExpandMore
                  className={cn(
                    'h-5 w-5 text-muted-foreground transition-transform flex-shrink-0',
                    isOpen && 'rotate-180'
                  )}
                />
              </div>

              {/* Dropdown */}
              {isOpen && !disabled && (
                <div className="absolute z-50 mt-2 w-full bg-card border border-border rounded-lg shadow-lg max-h-[400px] flex flex-col">
                  {!isCreating ? (
                    <>
                      {/* Search */}
                      <div className="p-3 border-b border-border">
                        <div className="relative">
                          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Buscar categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      {/* Categories List */}
                      <div className="overflow-y-auto flex-1">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                          </div>
                        ) : filteredCategories.length > 0 ? (
                          <div className="py-1">
                            {filteredCategories.map((category) => {
                              const Icon = getIconComponent(category.icon)
                              const isSelected = category.id === selectedValue

                              return (
                                <button
                                  key={category.id}
                                  type="button"
                                  onClick={() =>
                                    handleSelectCategory(category.id)
                                  }
                                  className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3",
                                    "hover:bg-accent transition-colors",
                                    isSelected && "bg-primary/10"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "p-2 rounded-lg",
                                      isSelected ? "bg-primary/20" : "bg-muted"
                                    )}
                                  >
                                    {Icon ? (
                                      <Icon
                                        className={cn(
                                          "h-5 w-5",
                                          isSelected
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                        )}
                                      />
                                    ) : (
                                      <TbCategoryFilled className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <span
                                    className={cn(
                                      "flex-1 text-left text-sm",
                                      isSelected && "font-semibold text-primary"
                                    )}
                                  >
                                    {category.name}
                                  </span>
                                  {isSelected && (
                                    <MdCheck className="h-5 w-5 text-primary" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <MdSearch className="h-12 w-12 mb-2" />
                            <p className="text-sm">Nenhuma categoria encontrada</p>
                          </div>
                        )}
                      </div>

                      {/* Create Button */}
                      <div className="p-2 border-t border-border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
                          onClick={handleStartCreating}
                        >
                          <MdAdd className="h-4 w-4 mr-2" />
                          Criar nova categoria
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* Create Form */
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Nova Categoria</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={handleCancelCreate}
                        >
                          <MdClose className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-12 w-12 p-0"
                          onClick={() => setShowIconPicker(true)}
                        >
                          {NewIconComponent ? (
                            <NewIconComponent className="h-6 w-6 text-primary" />
                          ) : (
                            <MdAdd className="h-6 w-6" />
                          )}
                        </Button>

                        <Input
                          type="text"
                          placeholder="Nome da categoria..."
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleCreateCategory()
                            } else if (e.key === 'Escape') {
                              handleCancelCreate()
                            }
                          }}
                          className="flex-1"
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCancelCreate}
                          disabled={createCategoryMutation.isPending}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleCreateCategory}
                          disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                          className="flex-1"
                        >
                          <MdCheck className="h-4 w-4 mr-1" />
                          {createCategoryMutation.isPending ? 'Criando...' : 'Criar'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />

          <IconPickerDialog
            isOpen={showIconPicker}
            onClose={() => setShowIconPicker(false)}
            selectedIcon={selectedIcon}
            onSelectIcon={setSelectedIcon}
          />
        </FormItem>
      )}
    />
  )
}
