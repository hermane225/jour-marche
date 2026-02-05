// Service pour l'administration
import { apiClient } from './client';
import type { ApiResponse } from './types';
import type { User, UserRole } from '../../types';

// Types pour l'admin
export interface PlatformSettings {
  siteName: string;
  siteDescription: string;
  currency: string;
  defaultDeliveryFee: number;
  freeDeliveryMinimum: number;
  commissionRate: number;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalShops: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeDrivers: number;
  newUsersToday: number;
  ordersToday: number;
  revenueToday: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const adminService = {
  /**
   * Récupérer les paramètres de la plateforme
   */
  getSettings: async (): Promise<PlatformSettings> => {
    const response = await apiClient.get<ApiResponse<PlatformSettings>>('/api/admin/settings');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la récupération des paramètres');
    }
    
    return response.data;
  },

  /**
   * Modifier les paramètres de la plateforme
   */
  updateSettings: async (settings: Partial<PlatformSettings>): Promise<PlatformSettings> => {
    const response = await apiClient.put<ApiResponse<PlatformSettings>>('/api/admin/settings', settings);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la mise à jour des paramètres');
    }
    
    return response.data;
  },

  /**
   * Récupérer les statistiques du dashboard
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/api/admin/stats');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la récupération des statistiques');
    }
    
    return response.data;
  },

  /**
   * Récupérer la liste des utilisateurs
   */
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get<ApiResponse<AdminUser[]>>('/api/admin/users');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  /**
   * Modifier le rôle d'un utilisateur
   */
  updateUserRole: async (userId: string, role: UserRole): Promise<AdminUser> => {
    const response = await apiClient.put<ApiResponse<AdminUser>>(`/api/admin/users/${userId}/role`, { role });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la modification du rôle');
    }
    
    return response.data;
  },

  /**
   * Supprimer un utilisateur
   */
  deleteUser: async (userId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/admin/users/${userId}`);
    
    if (!response.success) {
      throw new Error(response.message || "Échec de la suppression de l'utilisateur");
    }
  },
};

export default adminService;
