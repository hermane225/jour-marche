// Hooks pour les produits
import { useCallback } from 'react';
import { productService } from '../services/api';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import type { Product } from '../types';
import type { CreateProductPayload, UpdateProductPayload } from '../services/api/products.service';

// Hook pour récupérer un produit par ID
export function useProduct(productId: string) {
  return useApi(
    () => productService.getProduct(productId),
    [productId]
  );
}

// Hook pour récupérer les produits avec pagination
export function useProducts(params: {
  category?: string;
  shopId?: string;
  search?: string;
  limit?: number;
} = {}) {
  const { category, shopId, search, limit = 12 } = params;

  return usePaginatedApi(
    async (page, pageLimit) => {
      const result = await productService.getProducts({
        page,
        limit: pageLimit,
        category,
        shopId,
        search,
      });
      return {
        data: result.products,
        pagination: result.pagination,
      };
    },
    limit,
    [category, shopId, search]
  );
}

// Hook pour récupérer les produits d'une boutique
export function useShopProducts(shopId: string, limit: number = 12) {
  return usePaginatedApi(
    async (page, pageLimit) => {
      const result = await productService.getProductsByShop(shopId, { page, limit: pageLimit });
      return {
        data: result.products,
        pagination: result.pagination,
      };
    },
    limit,
    [shopId]
  );
}

// Hook pour rechercher des produits
export function useProductSearch(searchTerm: string, limit: number = 12) {
  return usePaginatedApi(
    async (page, pageLimit) => {
      const result = await productService.searchProducts(searchTerm, { page, limit: pageLimit });
      return {
        data: result.products,
        pagination: result.pagination,
      };
    },
    limit,
    [searchTerm]
  );
}

// Hook pour les produits populaires
export function usePopularProducts(limit: number = 10) {
  return useApi(
    () => productService.getPopularProducts(limit),
    [limit]
  );
}

// Hook pour les produits en promotion
export function usePromotionalProducts(limit: number = 10) {
  return useApi(
    async () => {
      const result = await productService.getPromotionalProducts({ limit });
      return result.products;
    },
    [limit]
  );
}

// Hook pour créer un produit
export function useCreateProduct() {
  return useMutation(
    (productData: CreateProductPayload) =>
      productService.createProduct(productData)
  );
}

// Hook pour mettre à jour un produit
export function useUpdateProduct() {
  return useMutation(
    ({ id, updates }: { id: string; updates: UpdateProductPayload }) =>
      productService.updateProduct(id, updates)
  );
}

// Hook pour supprimer un produit
export function useDeleteProduct() {
  const deleteFn = useCallback(
    (id: string) => productService.deleteProduct(id),
    []
  );
  return useMutation(deleteFn);
}
