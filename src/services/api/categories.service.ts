// Service pour les catégories
import { apiClient } from './client';
import type { CategoryDTO, ApiResponse } from './types';
import type { Category } from '../../types';

// Convertir un CategoryDTO en Category local
const mapCategoryFromApi = (dto: CategoryDTO): Category => ({
  id: dto.id,
  name: dto.name,
  slug: dto.slug,
  icon: dto.icon,
  description: dto.description,
  subcategories: dto.subcategories,
});

export const categoryService = {
  /**
   * Récupérer toutes les catégories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<CategoryDTO[]>>('/categories');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data.map(mapCategoryFromApi);
  },

  /**
   * Récupérer une catégorie par son ID ou slug
   */
  getCategory: async (idOrSlug: string): Promise<Category | null> => {
    try {
      const response = await apiClient.get<ApiResponse<CategoryDTO>>(`/categories/${idOrSlug}`);
      
      if (!response.success || !response.data) {
        return null;
      }
      
      return mapCategoryFromApi(response.data);
    } catch {
      return null;
    }
  },

  /**
   * Récupérer les catégories principales (sans les sous-catégories)
   */
  getMainCategories: async (): Promise<Category[]> => {
    const categories = await categoryService.getCategories();
    return categories.map(cat => ({
      ...cat,
      subcategories: undefined,
    }));
  },
};

export default categoryService;
