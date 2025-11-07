import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Trash2, Plus } from 'lucide-react'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Input } from '@presentation/components/ui/input'
import { Label } from '@presentation/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@presentation/components/ui/select'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'INCOME' | 'EXPENSE' | null
  is_default: boolean
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  // Form states
  const [formName, setFormName] = useState('')
  const [formColor, setFormColor] = useState('#f59e0b')
  const [formType, setFormType] = useState<'INCOME' | 'EXPENSE' | 'BOTH'>('EXPENSE')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(API_ROUTES.LIST_CATEGORIES)
      setCategories(response.data.categories)
    } catch {
      toast.error('Erro ao carregar categorias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.error('Nome da categoria é obrigatório')
      return
    }

    try {
      setIsCreating(true)
      await apiClient.post(API_ROUTES.CREATE_CATEGORY, {
        name: formName,
        color: formColor,
        icon: 'Circle',
        type: formType === 'BOTH' ? null : formType,
      })
      toast.success('Categoria criada com sucesso!')
      setFormName('')
      setFormColor('#f59e0b')
      setFormType('EXPENSE')
      await fetchCategories()
    } catch {
      toast.error('Erro ao criar categoria')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Não é possível excluir categorias padrão')
      return
    }

    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return
    }

    try {
      await apiClient.delete(API_ROUTES.DELETE_CATEGORY(id))
      toast.success('Categoria excluída com sucesso!')
      await fetchCategories()
    } catch {
      toast.error('Erro ao excluir categoria')
    }
  }

  const getTypeLabel = (type: 'INCOME' | 'EXPENSE' | null) => {
    if (type === 'INCOME') return 'Receita'
    if (type === 'EXPENSE') return 'Despesa'
    return 'Ambos'
  }

  const getTypeBadgeColor = (type: 'INCOME' | 'EXPENSE' | null) => {
    if (type === 'INCOME') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    if (type === 'EXPENSE') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
  }

  if (isLoading) {
    return <div className="text-center py-8">Carregando categorias...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias Personalizadas</CardTitle>
        <CardDescription>
          Crie e gerencie categorias personalizadas para suas transações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form para criar categoria */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <h3 className="font-semibold">Nova Categoria</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Nome</Label>
              <Input
                id="cat-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Alimentação"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-color">Cor</Label>
              <Input
                id="cat-color"
                type="color"
                value={formColor}
                onChange={(e) => setFormColor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-type">Tipo</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as 'INCOME' | 'EXPENSE' | 'BOTH')}>
                <SelectTrigger id="cat-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                  <SelectItem value="INCOME">Receita</SelectItem>
                  <SelectItem value="BOTH">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCreate} disabled={isCreating} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'Criando...' : 'Criar Categoria'}
          </Button>
        </div>

        {/* Lista de categorias */}
        <div className="space-y-2">
          <h3 className="font-semibold">Categorias Existentes</h3>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhuma categoria criada ainda</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getTypeLabel(cat.type)}
                        {cat.is_default && ' • Padrão'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(cat.type)}`}
                    >
                      {getTypeLabel(cat.type)}
                    </span>
                    {!cat.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cat.id, cat.is_default)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
