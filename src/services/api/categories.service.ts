// Service pour les catégories
import { apiClient } from './client';
import type { CategoryDTO, ApiResponse } from './types';
import type { Category } from '../../types';

// Convertir un CategoryDTO en Category local
const mapCategoryFromApi = (dto: any): Category => {
  // L'API retourne _id au lieu de id
  const id = dto.id || dto._id;
  
  // Les subcategories peuvent être un tableau de strings ou d'objets
  let subcategories = undefined;
  if (dto.subcategories && Array.isArray(dto.subcategories)) {
    if (dto.subcategories.length > 0 && typeof dto.subcategories[0] === 'string') {
      // Si c'est un tableau de strings, convertir en objets
      subcategories = dto.subcategories.map((name: string, index: number) => ({
        id: `${id}-${index}`,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        icon: '',
      }));
    } else {
      // Si c'est déjà un tableau d'objets
      subcategories = dto.subcategories.map((sub: any) => ({
        id: sub.id || sub._id || `${id}-${sub.name}`,
        name: sub.name,
        slug: sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-'),
        icon: sub.icon || '',
      }));
    }
  }
  
  return {
    id: id,
    name: dto.name,
    slug: dto.slug,
    icon: dto.icon || '',
    description: dto.description,
    subcategories: subcategories,
  };
};

export const categoryService = {
  /**
   * Récupérer toutes les catégories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<any>('/api/categories');
    
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
      const response = await apiClient.get<ApiResponse<CategoryDTO>>(`/api/categories/${idOrSlug}`);
      
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
