// Service pour les boutiques
import { apiClient } from './client';
import type { ShopDTO, ApiResponse, PaginatedResponse } from './types';
import type { Shop } from '../../types';

// Paramètres de recherche pour les boutiques
interface ShopSearchParams {
  page?: number;
  limit?: number;
  sellerId?: string;
  search?: string;
  sortBy?: 'rating' | 'createdAt' | 'name' | 'monthlySales';
  sortOrder?: 'asc' | 'desc';
}

// Convertir un ShopDTO en Shop local
const mapShopFromApi = (dto: ShopDTO): Shop => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  logo: dto.logo,
  phone: dto.phone,
  address: dto.address,
  sellerId: dto.sellerId,
  createdAt: new Date(dto.createdAt),
  totalProducts: dto.totalProducts,
  monthlySales: dto.monthlySales,
  rating: dto.rating,
  deliveryOptions: dto.deliveryOptions,
});

// Construire les query params
const buildQueryString = (params: ShopSearchParams): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const shopService = {
  /**
   * Récupérer toutes les boutiques avec pagination et filtres
   */
  getShops: async (params: ShopSearchParams = {}): Promise<{
    shops: Shop[];
    pagination?: PaginatedResponse<ShopDTO>['pagination'];
  }> => {
    const query = buildQueryString(params);
    const response = await apiClient.get<PaginatedResponse<ShopDTO>>(`/api/shops${query}`);
    
    return {
      shops: response.data.map(mapShopFromApi),
      pagination: response.pagination,
    };
  },

  /**
   * Récupérer une boutique par son ID
   */
  getShop: async (id: string): Promise<Shop> => {
    const response = await apiClient.get<ApiResponse<ShopDTO>>(`/api/shops/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Boutique non trouvée');
    }
    
    return mapShopFromApi(response.data);
  },

  /**
   * Récupérer les boutiques d'un vendeur
   */
  getShopsBySeller: async (sellerId: string): Promise<Shop[]> => {
    const { shops } = await shopService.getShops({ sellerId });
    return shops;
  },

  /**
   * Créer une nouvelle boutique (vendeur)
   */
  createShop: async (shopData: Omit<Shop, 'id' | 'createdAt' | 'totalProducts' | 'monthlySales' | 'rating'>): Promise<Shop> => {
    const response = await apiClient.post<ApiResponse<ShopDTO>>('/api/shops', shopData);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la création de la boutique');
    }
    
    return mapShopFromApi(response.data);
  },

  /**
   * Mettre à jour une boutique (vendeur)
   */
  updateShop: async (id: string, updates: Partial<Shop>): Promise<Shop> => {
    const response = await apiClient.patch<ApiResponse<ShopDTO>>(`/api/shops/${id}`, updates);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la mise à jour de la boutique');
    }
    
    return mapShopFromApi(response.data);
  },

  /**
   * Supprimer une boutique (vendeur)
   */
  deleteShop: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/shops/${id}`);
  },

  /**
   * Récupérer les boutiques populaires
   */
  getPopularShops: async (limit: number = 10): Promise<Shop[]> => {
    const response = await apiClient.get<ApiResponse<ShopDTO[]>>(`/api/shops/popular?limit=${limit}`);
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data.map(mapShopFromApi);
  },

  /**
   * Rechercher des boutiques
   */
  searchShops: async (searchTerm: string, params: Omit<ShopSearchParams, 'search'> = {}): Promise<{
    shops: Shop[];
    pagination?: PaginatedResponse<ShopDTO>['pagination'];
  }> => {
    return shopService.getShops({ ...params, search: searchTerm });
  },
};

export default shopService;
