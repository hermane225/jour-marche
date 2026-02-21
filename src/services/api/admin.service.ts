import { apiClient } from './client';
import type { ApiResponse } from './types';
import type { UserRole } from '../../types';

export interface PlatformSettings {
  siteName?: string;
  siteDescription?: string;
  currency?: string;
  defaultDeliveryFee?: number;
  freeDeliveryMinimum?: number;
  commissionRate?: number;
  maintenanceMode?: boolean;
  allowNewRegistrations?: boolean;
  [key: string]: unknown;
}

export interface DashboardStats {
  totalUsers?: number;
  totalShops?: number;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  pendingOrders?: number;
  activeDrivers?: number;
  newUsersToday?: number;
  ordersToday?: number;
  revenueToday?: number;
  [key: string]: unknown;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole | string;
  phone?: string;
  avatar?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface AdminShop {
  id: string;
  name: string;
  ownerName?: string;
  ownerId?: string;
  status?: string;
  totalProducts?: number;
  createdAt?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber?: string;
  customerName?: string;
  total?: number;
  status?: string;
  createdAt?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  shopId?: string;
  shopName?: string;
  price?: number;
  quantity?: number;
  status?: string;
  createdAt?: string;
}

export interface NotifyPayload {
  title: string;
  message: string;
  userIds?: string[];
  role?: string;
}

const mapUser = (raw: any): AdminUser => ({
  id: raw.id || raw._id,
  email: raw.email,
  name: raw.name || `${raw.firstName || ''} ${raw.lastName || ''}`.trim() || 'Unknown',
  role: raw.role,
  phone: raw.phone,
  avatar: raw.avatar,
  status: raw.status,
  isActive: raw.isActive,
  createdAt: raw.createdAt,
  lastLogin: raw.lastLogin,
});

const mapShop = (raw: any): AdminShop => ({
  id: raw.id || raw._id,
  name: raw.name,
  ownerName: raw.owner?.name,
  ownerId: raw.owner?._id || raw.owner?.id,
  status: raw.status,
  totalProducts: raw.totalProducts || raw.stats?.totalProducts,
  createdAt: raw.createdAt,
});

const mapOrder = (raw: any): AdminOrder => ({
  id: raw.id || raw._id,
  orderNumber: raw.orderNumber,
  customerName: raw.customerName || raw.customer?.name,
  total: raw.total,
  status: raw.status,
  createdAt: raw.createdAt,
});

const mapProduct = (raw: any): AdminProduct => ({
  id: raw.id || raw._id,
  name: raw.name || raw.title,
  shopId: raw.shop?._id || raw.shop?.id || raw.shop,
  shopName: raw.shop?.name || raw.shopName,
  price: raw.price,
  quantity: raw.quantity ?? raw.stock,
  status: raw.status,
  createdAt: raw.createdAt,
});

const extractData = <T>(response: any, fallback: T): T => {
  if (response?.success && response.data !== undefined) {
    return response.data as T;
  }
  if (response?.data !== undefined) {
    return response.data as T;
  }
  return fallback;
};

export const adminService = {
  getSettings: async (): Promise<PlatformSettings> => {
    const response = await apiClient.get<ApiResponse<PlatformSettings>>('/api/admin/settings');
    return extractData(response, {} as PlatformSettings);
  },

  updateSettings: async (settings: Partial<PlatformSettings>): Promise<PlatformSettings> => {
    const response = await apiClient.put<ApiResponse<PlatformSettings>>('/api/admin/settings', settings);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Echec de la mise a jour des parametres');
    }
    return response.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/api/admin/stats');
    return extractData(response, {} as DashboardStats);
  },

  getUsers: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/admin/users');
    const users = extractData(response, [] as any[]);
    return users.map(mapUser);
  },

  updateUserRole: async (userId: string, role: UserRole | string): Promise<AdminUser> => {
    const response = await apiClient.put<ApiResponse<any>>(`/api/admin/users/${userId}/role`, { role });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Echec de la modification du role');
    }
    return mapUser(response.data);
  },

  updateUserStatus: async (userId: string, status: string): Promise<AdminUser> => {
    const response = await apiClient.put<ApiResponse<any>>(`/api/admin/users/${userId}/status`, { status });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Echec de la mise a jour du statut utilisateur');
    }
    return mapUser(response.data);
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/admin/users/${userId}`);
    if (!response.success) {
      throw new Error(response.message || 'Echec de la suppression utilisateur');
    }
  },

  sendNotification: async (payload: NotifyPayload): Promise<void> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/admin/notify', payload);
    if (!response.success) {
      throw new Error(response.message || 'Echec envoi notification');
    }
  },

  getShops: async (): Promise<AdminShop[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/admin/shops');
    const shops = extractData(response, [] as any[]);
    return shops.map(mapShop);
  },

  deleteShop: async (shopId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/admin/shops/${shopId}`);
    if (!response.success) {
      throw new Error(response.message || 'Echec suppression boutique');
    }
  },

  updateShopStatus: async (shopId: string, status: string): Promise<AdminShop> => {
    const response = await apiClient.put<ApiResponse<any>>(`/api/admin/shops/${shopId}/status`, { status });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Echec MAJ statut boutique');
    }
    return mapShop(response.data);
  },

  getOrders: async (): Promise<AdminOrder[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/admin/orders');
    const orders = extractData(response, [] as any[]);
    return orders.map(mapOrder);
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<AdminOrder> => {
    const response = await apiClient.put<ApiResponse<any>>(`/api/admin/orders/${orderId}/status`, { status });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Echec MAJ statut commande');
    }
    return mapOrder(response.data);
  },

  getProducts: async (): Promise<AdminProduct[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/admin/products');
    const products = extractData(response, [] as any[]);
    return products.map(mapProduct);
  },

  deleteProduct: async (productId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/admin/products/${productId}`);
    if (!response.success) {
      throw new Error(response.message || 'Echec suppression produit');
    }
  },
};

export default adminService;
