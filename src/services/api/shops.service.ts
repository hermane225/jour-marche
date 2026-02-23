// Service pour les boutiques
import { apiClient } from './client';
import type { ShopDTO, ApiResponse, PaginatedResponse } from './types';
import type { Shop } from '../../types';
import { config } from '../../config';

// Payload exact attendu par l'API (correspond au validateur express-validator)
export interface CreateShopPayload {
  name: string;
  description?: string;
  category: string;           // MongoId obligatoire
  owner?: string;             // optionnel — le serveur lit req.user.id depuis le JWT
  logo?: string;              // URL seulement (pas base64)
  banner?: string;            // URL seulement (pas base64)
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  deliveryOptions?: string[]; // ex: ['retrait en magasin', 'livraison locale']
  deliveryFee?: number;
  minimumOrder?: number;
  deliveryRadius?: number;
}

export interface UpdateShopPayload {
  name?: string;
  description?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  deliveryOptions?: string[];
  deliveryFee?: number;
  minimumOrder?: number;
  deliveryRadius?: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    tiktok?: string;
  };
  businessHours?: string;
  slug?: string;
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const resolveUploadUrl = (value?: string): string => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  // En dev et en prod (Vercel), utiliser le chemin relatif pour passer par le proxy
  if (normalizedPath.startsWith('/uploads/')) {
    return normalizedPath;
  }

  // Si l'API renvoie seulement un nom de fichier, le placer sous /uploads
  if (!value.includes('/')) {
    return `/uploads/${value}`;
  }

  return normalizedPath;
};

const resolveShopImage = (dto: any, kind: 'logo' | 'banner'): string => {
  if (kind === 'logo') {
    const rawLogo =
      dto.logo ||
      dto.image ||
      dto.thumbnail ||
      (Array.isArray(dto.images) ? dto.images[0] : '') ||
      (dto.images && typeof dto.images === 'object' ? dto.images.url || dto.images.path : '');
    return resolveUploadUrl(typeof rawLogo === 'string' ? rawLogo : '');
  }

  const rawBanner =
    dto.banner ||
    dto.cover ||
    dto.coverImage ||
    dto.heroImage ||
    (Array.isArray(dto.banners) ? dto.banners[0] : '') ||
    (dto.banners && typeof dto.banners === 'object' ? dto.banners.url || dto.banners.path : '');
  return resolveUploadUrl(typeof rawBanner === 'string' ? rawBanner : '');
};

const dedupeShopsById = (shops: Shop[]): Shop[] => {
  const seen = new Set<string>();
  return shops.filter((shop) => {
    if (!shop.id || seen.has(shop.id)) return false;
    seen.add(shop.id);
    return true;
  });
};

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
const mapShopFromApi = (dto: any): Shop => {
  // L'API retourne _id au lieu de id
  const id = dto.id || dto._id;
  
  // Gérer l'adresse (peut être un objet ou une string)
  let address = dto.address;
  if (typeof dto.address === 'object' && dto.address.street) {
    address = `${dto.address.street}, ${dto.address.city} ${dto.address.zipCode || ''}`.trim();
  }
  
  // Gérer le téléphone (peut être dans contact)
  const phone = dto.phone || (dto.contact?.phone) || '';
  
  // Gérer le sellerId (peut être owner)
  const sellerId = (() => {
    if (typeof dto.sellerId === 'string') return dto.sellerId;
    if (dto.sellerId && typeof dto.sellerId === 'object') {
      return dto.sellerId._id || dto.sellerId.id || '';
    }
    if (typeof dto.owner === 'string') return dto.owner;
    if (dto.owner && typeof dto.owner === 'object') {
      return dto.owner._id || dto.owner.id || '';
    }
    return '';
  })();
  
  // Gérer les stats
  const totalProducts = dto.totalProducts !== undefined 
    ? dto.totalProducts 
    : (dto.stats?.totalProducts || 0);
  const monthlySales = dto.monthlySales !== undefined 
    ? dto.monthlySales 
    : (dto.stats?.totalRevenue || 0);
  
  // Gérer le rating
  const rating = dto.rating?.average !== undefined 
    ? dto.rating.average 
    : (dto.rating || 0);
  
  // Gérer les options de livraison
  let deliveryOptions = dto.deliveryOptions;
  if (Array.isArray(dto.deliveryOptions)) {
    deliveryOptions = {
      pickup: dto.deliveryOptions.includes('retrait en magasin'),
      delivery: dto.deliveryOptions.includes('livraison locale') || dto.deliveryOptions.includes('livraison nationale'),
      deliveryFee: dto.deliveryFee || 0,
      freeDeliveryMinimum: dto.minimumOrder || 0,
      deliveryZones: [],
    };
  }
  
  return {
    id: id,
    name: dto.name || dto.shopName || '',
    description: dto.description || '',
    logo: resolveShopImage(dto, 'logo'),
    banner: resolveShopImage(dto, 'banner'),
    phone: phone,
    address: address || '',
    sellerId: sellerId,
    createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
    totalProducts: totalProducts,
    monthlySales: monthlySales,
    rating: rating,
    deliveryOptions: deliveryOptions || {
      pickup: true,
      delivery: true,
      deliveryFee: 0,
      freeDeliveryMinimum: 0,
      deliveryZones: [],
    },
    socialMedia: dto.socialMedia,
    businessHours: dto.businessHours,
  };
};

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
    const response = await apiClient.get<any>(`/api/shops${query}`);
    
    // L'API retourne directement { success, data, pagination }
    const shops = response.success && response.data
      ? response.data.map(mapShopFromApi)
      : [];
    
    return {
      shops: dedupeShopsById(shops),
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
    return dedupeShopsById(shops);
  },

  /**
   * Créer une nouvelle boutique (vendeur)
   */
  createShop: async (payload: CreateShopPayload): Promise<Shop> => {
    // Envoyer uniquement les champs définis (ne pas envoyer null/undefined)
    const body: Record<string, unknown> = {
      name: payload.name,
      category: payload.category,
    };

    if (payload.description)     body.description     = payload.description;
    if (payload.phone)           body.phone           = payload.phone;
    if (payload.logo && !payload.logo.startsWith('data:')) body.logo = payload.logo;
    if (payload.banner && !payload.banner.startsWith('data:')) body.banner = payload.banner;
    if (payload.address)         body.address         = payload.address;
    if (payload.deliveryOptions) body.deliveryOptions = payload.deliveryOptions;
    if (payload.deliveryFee !== undefined)   body.deliveryFee   = payload.deliveryFee;
    if (payload.minimumOrder !== undefined)  body.minimumOrder  = payload.minimumOrder;
    if (payload.deliveryRadius !== undefined) body.deliveryRadius = payload.deliveryRadius;

    // 🐛 DEBUG: Log des données envoyées
    console.group('📤 [SHOP SERVICE] Création de boutique');
    console.log('Payload original:', payload);
    console.log('Body envoyé à l\'API:', JSON.stringify(body, null, 2));
    console.log('Token JWT:', localStorage.getItem('jour_marche_token') ? '✅ Présent' : '❌ Absent');
    console.groupEnd();

    const response = await apiClient.post<ApiResponse<ShopDTO>>('/api/shops', body);

    // 🐛 DEBUG: Log de la réponse
    console.log('✅ [SHOP SERVICE] Réponse API:', response);

    if (!response.success || !response.data) {
      console.error('❌ [SHOP SERVICE] Échec création:', response.message);
      throw new Error(response.message || 'Échec de la création de la boutique');
    }

    const shop = mapShopFromApi(response.data);
    console.log('✅ [SHOP SERVICE] Boutique créée:', shop);
    return shop;
  },

  /**
   * Mettre à jour une boutique (vendeur)
   */
  updateShop: async (id: string, updates: Partial<UpdateShopPayload>): Promise<Shop> => {
    const body: Record<string, unknown> = {};

    if (updates.name !== undefined) {
      const name = updates.name.trim();
      body.name = name;
      if (name) {
        body.slug = slugify(name);
      }
    }
    if (updates.description !== undefined) body.description = updates.description;
    if (updates.phone !== undefined) body.phone = updates.phone;
    if (updates.logo !== undefined && !updates.logo.startsWith('data:')) body.logo = updates.logo;
    if (updates.banner !== undefined && !updates.banner.startsWith('data:')) body.banner = updates.banner;
    if (updates.address !== undefined) body.address = updates.address;
    if (updates.deliveryOptions !== undefined) body.deliveryOptions = updates.deliveryOptions;
    if (updates.deliveryFee !== undefined) body.deliveryFee = updates.deliveryFee;
    if (updates.minimumOrder !== undefined) body.minimumOrder = updates.minimumOrder;
    if (updates.deliveryRadius !== undefined) body.deliveryRadius = updates.deliveryRadius;
    if (updates.socialMedia !== undefined) body.socialMedia = updates.socialMedia;
    if (updates.businessHours !== undefined) body.businessHours = updates.businessHours;
    if (updates.slug !== undefined) body.slug = updates.slug;

    const response = await apiClient.put<ApiResponse<ShopDTO>>(`/api/shops/${id}`, body);
    
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
