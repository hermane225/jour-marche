// Hooks pour les boutiques
import { useCallback } from 'react';
import { shopService } from '../services/api';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import type { Shop } from '../types';

// Hook pour récupérer une boutique par ID
export function useShop(shopId: string) {
  return useApi(
    () => shopService.getShop(shopId),
    [shopId]
  );
}

// Hook pour récupérer les boutiques avec pagination
export function useShops(params: {
  search?: string;
  sellerId?: string;
  limit?: number;
} = {}) {
  const { search, sellerId, limit = 12 } = params;

  return usePaginatedApi(
    async (page, pageLimit) => {
      const result = await shopService.getShops({
        page,
        limit: pageLimit,
        search,
        sellerId,
      });
      return {
        data: result.shops,
        pagination: result.pagination || { page: 1, totalPages: 1, total: result.shops.length },
      };
    },
    limit,
    [search, sellerId]
  );
}

// Hook pour récupérer les boutiques d'un vendeur
export function useSellerShops(sellerId: string) {
  return useApi(
    () => shopService.getShopsBySeller(sellerId),
    [sellerId]
  );
}

// Hook pour les boutiques populaires
export function usePopularShops(limit: number = 10) {
  return useApi(
    () => shopService.getPopularShops(limit),
    [limit]
  );
}

// Hook pour rechercher des boutiques
export function useShopSearch(searchTerm: string, limit: number = 12) {
  return usePaginatedApi(
    async (page, pageLimit) => {
      const result = await shopService.searchShops(searchTerm, { page, limit: pageLimit });
      return {
        data: result.shops,
        pagination: result.pagination || { page: 1, totalPages: 1, total: result.shops.length },
      };
    },
    limit,
    [searchTerm]
  );
}

// Hook pour créer une boutique
export function useCreateShop() {
  return useMutation(
    (shopData: Omit<Shop, 'id' | 'createdAt' | 'totalProducts' | 'monthlySales' | 'rating'>) => 
      shopService.createShop(shopData)
  );
}

// Hook pour mettre à jour une boutique
export function useUpdateShop() {
  return useMutation(
    ({ id, updates }: { id: string; updates: Partial<Shop> }) => 
      shopService.updateShop(id, updates)
  );
}

// Hook pour supprimer une boutique
export function useDeleteShop() {
  const deleteFn = useCallback(
    (id: string) => shopService.deleteShop(id),
    []
  );
  return useMutation(deleteFn);
}
