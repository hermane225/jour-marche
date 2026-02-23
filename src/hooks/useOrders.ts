// Hooks pour les commandes
import { orderService } from '../services/api';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import type { Order, OrderStatus, CartItem } from '../types';

// Hook pour récupérer une commande par ID
export function useOrder(orderId: string) {
  return useApi(
    () => orderService.getOrder(orderId),
    [orderId]
  );
}

// Hook pour récupérer les commandes avec pagination
export function useOrders(params: {
  status?: OrderStatus;
  shopId?: string;
  limit?: number;
} = {}) {
  const { status, shopId, limit = 10 } = params;

  return usePaginatedApi(
    async (page, pageLimit) => {
      const result = await orderService.getOrders({
        page,
        limit: pageLimit,
        status,
        shopId,
      });
      return {
        data: result.orders,
        pagination: result.pagination || { page: 1, totalPages: 1, total: result.orders.length },
      };
    },
    limit,
    [status, shopId]
  );
}

// Hook pour récupérer mes commandes (client)
export function useMyOrders(params: {
  buyerId: string;
  status?: OrderStatus;
  limit?: number;
}) {
  const { buyerId, status, limit = 10 } = params;

  return usePaginatedApi(
    async (page, pageLimit) => {
      const result = await orderService.getBuyerOrders(buyerId, {
        page,
        limit: pageLimit,
        status,
      });
      return {
        data: result.orders,
        pagination: result.pagination || { page: 1, totalPages: 1, total: result.orders.length },
      };
    },
    limit,
    [buyerId, status]
  );
}

// Hook pour récupérer les commandes d'une boutique (vendeur)
export function useShopOrders(shopId: string, params: {
  status?: OrderStatus;
  limit?: number;
} = {}) {
  const { status, limit = 10 } = params;

  return usePaginatedApi(
    async (page, pageLimit) => {
      const result = await orderService.getShopOrders(shopId, {
        page,
        limit: pageLimit,
        status,
      });
      return {
        data: result.orders,
        pagination: result.pagination || { page: 1, totalPages: 1, total: result.orders.length },
      };
    },
    limit,
    [shopId, status]
  );
}

// Hook pour créer une commande
export function useCreateOrder() {
  return useMutation(
    (data: {
      items: CartItem[];
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      paymentMethod: 'mobile_money' | 'cash' | 'card';
      shopId: string;
      deliveryType: 'pickup' | 'delivery';
      deliveryNotes?: string;
    }) => orderService.createOrder(data.items, {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      paymentMethod: data.paymentMethod,
      shopId: data.shopId,
      deliveryType: data.deliveryType,
      deliveryNotes: data.deliveryNotes,
    })
  );
}

// Hook pour mettre à jour le statut d'une commande
export function useUpdateOrderStatus() {
  return useMutation(
    ({ orderId, status }: { orderId: string; status: OrderStatus }) => 
      orderService.updateOrderStatus(orderId, status)
  );
}

// Hook pour annuler une commande
export function useCancelOrder() {
  return useMutation(
    ({ orderId, reason }: { orderId: string; reason?: string }) => 
      orderService.cancelOrder(orderId, reason)
  );
}

// Hook pour assigner un livreur
export function useAssignDriver() {
  return useMutation(
    ({ orderId, driverId }: { orderId: string; driverId: string }) => 
      orderService.assignDriver(orderId, driverId)
  );
}

// Hook pour les statistiques des commandes
export function useOrderStats(shopId?: string) {
  return useApi(
    () => orderService.getOrderStats(shopId),
    [shopId]
  );
}
