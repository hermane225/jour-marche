// Hooks pour les catégories
import { categoryService } from '../services/api';
import { useApi } from './useApi';

// Hook pour récupérer toutes les catégories
export function useCategories() {
  return useApi(
    () => categoryService.getCategories(),
    []
  );
}

// Hook pour récupérer une catégorie par ID ou slug
export function useCategory(idOrSlug: string) {
  return useApi(
    () => categoryService.getCategory(idOrSlug),
    [idOrSlug]
  );
}

// Hook pour récupérer les catégories principales
export function useMainCategories() {
  return useApi(
    () => categoryService.getMainCategories(),
    []
  );
}
