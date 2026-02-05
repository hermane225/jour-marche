// Service pour les produits
import { apiClient } from './client';
import type { ProductDTO, ApiResponse, PaginatedResponse } from './types';
import type { Product } from '../../types';

// Paramètres de recherche pour les produits
interface ProductSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  shopId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'published' | 'draft' | 'low_stock';
  sortBy?: 'price' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Convertir un ProductDTO en Product local
const mapProductFromApi = (dto: ProductDTO): Product => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  price: dto.price,
  originalPrice: dto.originalPrice,
  stock: dto.stock,
  images: dto.images,
  category: dto.category,
  shopId: dto.shopId,
  shopName: dto.shopName,
  variants: dto.variants,
  status: dto.status,
  createdAt: new Date(dto.createdAt),
  isPerishable: dto.isPerishable,
  expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : undefined,
  weight: dto.weight,
  unit: dto.unit,
});

// Construire les query params
const buildQueryString = (params: ProductSearchParams): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const productService = {
  /**
   * Récupérer tous les produits avec pagination et filtres
   */
  getProducts: async (params: ProductSearchParams = {}): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    const query = buildQueryString(params);
    const response = await apiClient.get<PaginatedResponse<ProductDTO>>(`/api/products${query}`);
    
    return {
      products: response.data.map(mapProductFromApi),
      pagination: response.pagination,
    };
  },

  /**
   * Récupérer un produit par son ID
   */
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<ProductDTO>>(`/api/products/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Produit non trouvé');
    }
    
    return mapProductFromApi(response.data);
  },

  /**
   * Récupérer les produits d'une boutique
   */
  getProductsByShop: async (shopId: string, params: Omit<ProductSearchParams, 'shopId'> = {}): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    return productService.getProducts({ ...params, shopId });
  },

  /**
   * Récupérer les produits d'une catégorie
   */
  getProductsByCategory: async (category: string, params: Omit<ProductSearchParams, 'category'> = {}): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    return productService.getProducts({ ...params, category });
  },

  /**
   * Rechercher des produits
   */
  searchProducts: async (searchTerm: string, params: Omit<ProductSearchParams, 'search'> = {}): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    return productService.getProducts({ ...params, search: searchTerm });
  },

  /**
   * Créer un nouveau produit (vendeur)
   */
  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'status'>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<ProductDTO>>('/api/products', productData);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la création du produit');
    }
    
    return mapProductFromApi(response.data);
  },

  /**
   * Mettre à jour un produit (vendeur)
   */
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<ProductDTO>>(`/api/products/${id}`, updates);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la mise à jour du produit');
    }
    
    return mapProductFromApi(response.data);
  },

  /**
   * Supprimer un produit (vendeur)
   */
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`);
  },

  /**
   * Récupérer les produits en promotion
   */
  getPromotionalProducts: async (params: ProductSearchParams = {}): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    const query = buildQueryString(params);
    const response = await apiClient.get<PaginatedResponse<ProductDTO>>(`/api/products/promotions${query}`);
    
    return {
      products: response.data.map(mapProductFromApi),
      pagination: response.pagination,
    };
  },

  /**
   * Récupérer les produits populaires
   */
  getPopularProducts: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<ProductDTO[]>>(`/api/products/popular?limit=${limit}`);
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data.map(mapProductFromApi);
  },
};

export default productService;
