import { apiClient } from '@/infrastructure/http/api-client'
import { API_ROUTES } from '@/shared/constants/api-routes'

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'INCOME' | 'EXPENSE' | null
}

class CategoryService {
  async getAll(type?: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
    const params = type ? { type } : {}
    const response = await apiClient.get<{ categories: Category[] }>(API_ROUTES.LIST_CATEGORIES, { params })
    return response.data.categories
  }

  async create(data: Omit<Category, 'id'>): Promise<Category> {
    const response = await apiClient.post<Category>(API_ROUTES.CREATE_CATEGORY, data)
    return response.data
  }

  async update(id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category> {
    const response = await apiClient.put<Category>(API_ROUTES.UPDATE_CATEGORY(id), data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ROUTES.DELETE_CATEGORY(id))
  }
}

export const categoryService = new CategoryService()
