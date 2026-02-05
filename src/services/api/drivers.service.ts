// Service pour les livreurs
import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse } from './types';

// Types pour les livraisons
export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  driverId?: string;
  driverName?: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  pickupAddress: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  estimatedTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryStatusUpdate {
  status: Delivery['status'];
  notes?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export const driverService = {
  /**
   * Récupérer toutes les livraisons (Admin/Driver)
   */
  getDeliveries: async (): Promise<Delivery[]> => {
    const response = await apiClient.get<ApiResponse<Delivery[]>>('/api/drivers/deliveries');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  /**
   * Récupérer mes livraisons (Driver)
   */
  getMyDeliveries: async (): Promise<Delivery[]> => {
    const response = await apiClient.get<ApiResponse<Delivery[]>>('/api/drivers/my-deliveries');
    
    if (!response.success || !response.data) {
      return [];
    }
    
    return response.data;
  },

  /**
   * Assigner une livraison à un livreur (Admin)
   */
  assignDelivery: async (orderId: string, driverId: string): Promise<Delivery> => {
    const response = await apiClient.post<ApiResponse<Delivery>>('/api/drivers/assign', {
      orderId,
      driverId,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || "Échec de l'assignation de la livraison");
    }
    
    return response.data;
  },

  /**
   * Mettre à jour le statut d'une livraison
   */
  updateDeliveryStatus: async (
    deliveryId: string,
    statusUpdate: DeliveryStatusUpdate
  ): Promise<Delivery> => {
    const response = await apiClient.put<ApiResponse<Delivery>>(
      `/api/drivers/deliveries/${deliveryId}/status`,
      statusUpdate
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la mise à jour du statut');
    }
    
    return response.data;
  },
};

export default driverService;
