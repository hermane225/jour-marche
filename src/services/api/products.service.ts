import { apiClient } from './client';
import type { ProductDTO, ApiResponse, PaginatedResponse } from './types';
import type { Product } from '../../types';
import { config } from '../../config';

interface ProductSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  shop?: string;
  shopId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'inactive' | 'discontinued' | 'published' | 'draft' | 'low_stock';
  sortBy?: 'price' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  shop: string;
  images: string[];
  tags?: string[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
  images?: string[];
  status?: 'active' | 'inactive' | 'discontinued';
  tags?: string[];
}

const resolveUploadUrl = (value?: string): string => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  const mediaBaseUrl = (import.meta.env.VITE_API_URL || config.apiUrl || 'https://jour-marche-api.onrender.com').replace(/\/$/, '');
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  if (normalizedPath.startsWith('/uploads/')) {
    if (import.meta.env.DEV) return normalizedPath;
    return `${mediaBaseUrl}${normalizedPath}`;
  }
  // Si l'API renvoie seulement un nom de fichier, le placer sous /uploads
  if (!value.includes('/')) {
    const uploadPath = `/uploads/${value}`;
    if (import.meta.env.DEV) return uploadPath;
    return `${mediaBaseUrl}${uploadPath}`;
  }
  return normalizedPath;
};

const normalizeImages = (dto: any): string[] => {
  const rawImages = dto.images ?? dto.imageUrls ?? dto.photos ?? dto.gallery ?? dto.media;
  if (Array.isArray(rawImages)) {
    return rawImages
      .map((img) => {
        if (typeof img === 'string') return img;
        if (img && typeof img === 'object') return img.url || img.path || img.src || '';
        return '';
      })
      .filter(Boolean)
      .map(resolveUploadUrl);
  }

  const singleImage = dto.image || dto.thumbnail || dto.cover;
  if (typeof singleImage === 'string') {
    return [resolveUploadUrl(singleImage)];
  }
  if (singleImage && typeof singleImage === 'object') {
    const imageUrl = singleImage.url || singleImage.path || singleImage.src || '';
    return imageUrl ? [resolveUploadUrl(imageUrl)] : [];
  }

  return [];
};

const mapProductFromApi = (dto: any): Product => {
  const id = dto.id || dto._id;
  const title = dto.title || dto.name || '';
  const stock = dto.stock !== undefined ? dto.stock : (dto.quantity !== undefined ? dto.quantity : 0);
  const normalizedImages = normalizeImages(dto);

  let shopId = dto.shopId;
  let shopName = dto.shopName;
  if (dto.shop) {
    if (typeof dto.shop === 'object') {
      shopId = dto.shop._id || dto.shop.id;
      shopName = dto.shop.name;
    } else {
      shopId = dto.shop;
    }
  }

  const category = typeof dto.category === 'object'
    ? (dto.category._id || dto.category.id || dto.category.slug || dto.category.name || '')
    : (dto.category || '');

  return {
    id,
    title,
    description: dto.description || dto.details || dto.shortDescription || '',
    price: dto.price || 0,
    originalPrice: dto.originalPrice,
    stock,
    images: normalizedImages.length ? normalizedImages : ['/jour_marcher.png'],
    category,
    shopId: shopId || '',
    shopName: shopName || '',
    variants: dto.variants,
    status: dto.status || 'active',
    createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
    isPerishable: dto.isPerishable,
    expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : undefined,
    weight: dto.weight,
    unit: dto.unit,
  };
};

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
  getProducts: async (params: ProductSearchParams = {}): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    const query = buildQueryString(params);
    const response = await apiClient.get<any>(`/api/products${query}`);

    const products = response.success && response.data
      ? response.data.map(mapProductFromApi)
      : [];

    return {
      products,
      pagination: response.pagination || { page: 1, totalPages: 1, total: 0 },
    };
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<ProductDTO>>(`/api/products/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Produit non trouve');
    }
    return mapProductFromApi(response.data);
  },

  getProductsByShop: async (
    shopId: string,
    params: Omit<ProductSearchParams, 'shopId' | 'shop'> = {}
  ): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    return productService.getProducts({ ...params, shop: shopId, shopId });
  },

  getProductsByCategory: async (
    category: string,
    params: Omit<ProductSearchParams, 'category'> = {}
  ): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    return productService.getProducts({ ...params, category });
  },

  searchProducts: async (
    searchTerm: string,
    params: Omit<ProductSearchParams, 'search'> = {}
  ): Promise<{
    products: Product[];
    pagination: PaginatedResponse<ProductDTO>['pagination'];
  }> => {
    return productService.getProducts({ ...params, search: searchTerm });
  },

  createProduct: async (productData: CreateProductPayload): Promise<Product> => {
    const description = (productData.description || '').trim();
    const body: CreateProductPayload = {
      name: productData.name.trim(),
      description,
      category: productData.category,
      price: Number(productData.price),
      quantity: Number(productData.quantity),
      shop: productData.shop,
      images: productData.images.filter(Boolean),
      tags: productData.tags?.filter(Boolean),
    };

    const response = await apiClient.post<ApiResponse<ProductDTO>>('/api/products', body);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Echec de la creation du produit');
    }

    return mapProductFromApi(response.data);
  },

  updateProduct: async (id: string, updates: UpdateProductPayload): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<ProductDTO>>(`/api/products/${id}`, updates);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Echec de la mise a jour du produit');
    }

    return mapProductFromApi(response.data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`);
  },

  updateProductStatus: async (
    id: string,
    status: 'active' | 'inactive' | 'discontinued'
  ): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<ProductDTO>>(`/api/products/${id}`, { status });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Echec de la mise a jour du statut');
    }
    return mapProductFromApi(response.data);
  },

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

  getPopularProducts: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<ProductDTO[]>>(`/api/products/popular?limit=${limit}`);

    if (!response.success || !response.data) {
      return [];
    }

    return response.data.map(mapProductFromApi);
  },
};

export default productService;
