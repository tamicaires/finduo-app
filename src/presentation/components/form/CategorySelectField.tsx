import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { MdAdd, MdCheck } from 'react-icons/md'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@presentation/components/ui/form'
import { Button } from '@presentation/components/ui/button'
import { Input } from '@presentation/components/ui/input'
import { SelectField, type SelectOption } from './SelectField'
import { IconPickerDialog } from '@presentation/components/shared/IconPickerDialog'
import { getIconComponent } from '@/shared/utils/icon-mapper'
import { categoryService } from '@/application/services/category.service'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { cn } from '@shared/utils'

interface CategorySelectFieldProps {
  name: string
  label?: string
  description?: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  transactionType: 'INCOME' | 'EXPENSE'
  onCategoryCreated?: () => void
}

export function CategorySelectField({
  name,
  label,
  description,
  options,
  placeholder,
  disabled,
  required,
  transactionType,
  onCategoryCreated,
}: CategorySelectFieldProps) {
  const form = useFormContext()
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('MdCategory')
  const [showIconPicker, setShowIconPicker] = useState(false)

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; icon: string; type: 'INCOME' | 'EXPENSE' | null; color: string }) => {
      return await categoryService.create(data)
    },
    onSuccess: (newCategory) => {
      toast.success('Categoria criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })

      // Set the newly created category as selected
      form.setValue(name, newCategory.id)

      // Reset form
      setNewCategoryName('')
      setSelectedIcon('MdCategory')
      setIsCreating(false)

      onCategoryCreated?.()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar categoria')
    },
  })

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

  const handleCancelCreate = () => {
    setIsCreating(false)
    setNewCategoryName('')
    setSelectedIcon('MdCategory')
  }

  const IconComponent = getIconComponent(selectedIcon)

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="w-full">
          <FormControl>
            <div className="space-y-2">
              <SelectField
                name={name}
                label={label}
                placeholder={placeholder}
                options={options}
                searchable
                disabled={disabled}
                required={required}
              />

              {!disabled && (
                <div className={cn(
                  'border-2 border-dashed rounded-md transition-all',
                  isCreating ? 'border-primary p-3' : 'border-border p-2'
                )}>
                  {!isCreating ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => setIsCreating(true)}
                    >
                      <MdAdd className="h-4 w-4 mr-2" />
                      Criar nova categoria
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() => setShowIconPicker(true)}
                        >
                          {IconComponent ? (
                            <IconComponent className="h-5 w-5 text-primary" />
                          ) : (
                            <MdAdd className="h-5 w-5" />
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

                      <div className="flex items-center gap-2">
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
