// Service pour les commandes
import { apiClient } from './client';
import type { OrderDTO, ApiResponse, PaginatedResponse, CreateOrderRequest } from './types';
import type { Order, OrderStatus, CartItem } from '../../types';

// Paramètres de recherche pour les commandes
interface OrderSearchParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  shopId?: string;
  buyerId?: string;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Convertir un OrderDTO en Order local
const mapOrderFromApi = (dto: OrderDTO): Order => ({
  id: dto.id,
  orderNumber: dto.orderNumber,
  items: dto.items.map(item => ({
    product: {
      id: item.productId,
      title: item.productTitle,
      price: item.price,
      description: '',
      stock: 0,
      images: [],
      category: '',
      shopId: dto.shopId,
      shopName: dto.shopName,
      status: 'published' as const,
      createdAt: new Date(),
    },
    quantity: item.quantity,
    selectedVariants: item.selectedVariants,
  })),
  total: dto.total,
  status: dto.status,
  customerName: dto.customerName,
  customerPhone: dto.customerPhone,
  customerAddress: dto.customerAddress,
  paymentMethod: dto.paymentMethod,
  shopId: dto.shopId,
  shopName: dto.shopName,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
  deliveryType: dto.deliveryType,
  deliveryFee: dto.deliveryFee,
  driverId: dto.driverId,
  driverName: dto.driverName,
  driverPhone: dto.driverPhone,
  estimatedDeliveryTime: dto.estimatedDeliveryTime ? new Date(dto.estimatedDeliveryTime) : undefined,
  deliveryNotes: dto.deliveryNotes,
});

// Construire les query params
const buildQueryString = (params: OrderSearchParams): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const orderService = {
  /**
   * Récupérer toutes les commandes avec pagination et filtres
   */
  getOrders: async (params: OrderSearchParams = {}): Promise<{
    orders: Order[];
    pagination?: PaginatedResponse<OrderDTO>['pagination'];
  }> => {
    const query = buildQueryString(params);
    const response = await apiClient.get<PaginatedResponse<OrderDTO>>(`/api/orders${query}`);
    
    return {
      orders: response.data.map(mapOrderFromApi),
      pagination: response.pagination,
    };
  },

  /**
   * Récupérer une commande par son ID
   */
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<OrderDTO>>(`/api/orders/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Commande non trouvée');
    }
    
    return mapOrderFromApi(response.data);
  },

  /**
   * Récupérer les commandes d'un client (mes commandes)
   */
  getMyOrders: async (params: Omit<OrderSearchParams, 'buyerId'> = {}): Promise<{
    orders: Order[];
    pagination?: PaginatedResponse<OrderDTO>['pagination'];
  }> => {
    const response = await apiClient.get<PaginatedResponse<OrderDTO>>(`/api/orders${buildQueryString(params)}`);
    
    return {
      orders: response.data.map(mapOrderFromApi),
      pagination: response.pagination,
    };
  },

  /**
   * Recuperer les commandes d'un acheteur
   */
  getBuyerOrders: async (buyerId: string, params: Omit<OrderSearchParams, 'buyerId'> = {}): Promise<{
    orders: Order[];
    pagination?: PaginatedResponse<OrderDTO>['pagination'];
  }> => {
    const query = buildQueryString(params);
    const response = await apiClient.get<PaginatedResponse<OrderDTO>>(`/api/orders/buyer/${buyerId}${query}`);
    
    return {
      orders: response.data.map(mapOrderFromApi),
      pagination: response.pagination,
    };
  },

  /**
   * Récupérer les commandes d'une boutique (vendeur)
   */
  getShopOrders: async (shopId: string, params: Omit<OrderSearchParams, 'shopId'> = {}): Promise<{
    orders: Order[];
    pagination?: PaginatedResponse<OrderDTO>['pagination'];
  }> => {
    const query = buildQueryString(params);
    const response = await apiClient.get<PaginatedResponse<OrderDTO>>(`/api/orders/shop/${shopId}${query}`);
    
    return {
      orders: response.data.map(mapOrderFromApi),
      pagination: response.pagination,
    };
  },

  /**
   * Créer une nouvelle commande
   */
  createOrder: async (
    items: CartItem[],
    orderData: {
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      paymentMethod: 'mobile_money' | 'cash' | 'card';
      shopId: string;
      deliveryType: 'pickup' | 'delivery';
      deliveryNotes?: string;
    }
  ): Promise<Order> => {
    const requestData: CreateOrderRequest = {
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
      })),
      ...orderData,
    };

    const response = await apiClient.post<ApiResponse<OrderDTO>>('/api/orders', requestData);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la création de la commande');
    }
    
    return mapOrderFromApi(response.data);
  },

  /**
   * Mettre à jour le statut d'une commande (vendeur)
   */
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<OrderDTO>>(`/api/orders/${id}/status`, { status });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la mise à jour du statut');
    }
    
    return mapOrderFromApi(response.data);
  },

  /**
   * Annuler une commande
   */
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<OrderDTO>>(`/api/orders/${id}/cancel`, { reason });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || "Échec de l'annulation de la commande");
    }
    
    return mapOrderFromApi(response.data);
  },

  /**
   * Assigner un livreur à une commande (Admin)
   */
  assignDriver: async (orderId: string, driverId: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<OrderDTO>>('/api/drivers/assign', { orderId, driverId });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || "Échec de l'assignation du livreur");
    }
    
    return mapOrderFromApi(response.data);
  },

  /**
   * Récupérer les statistiques des commandes (Admin)
   */
  getOrderStats: async (shopId?: string): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  }> => {
    const endpoint = shopId ? `/api/admin/stats?shopId=${shopId}` : '/api/admin/stats';
    const response = await apiClient.get<ApiResponse<{
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
      cancelledOrders: number;
      totalRevenue: number;
    }>>(endpoint);
    
    if (!response.success || !response.data) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
      };
    }
    
    return response.data;
  },
};

export default orderService;
