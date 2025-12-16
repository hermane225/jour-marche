import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Order, CartItem, OrderStatus } from '../types';

interface OrderContextType {
  orders: Order[];
  sellerOrders: Order[]; // Commandes pour le vendeur connecté
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByShop: (shopId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  newOrdersCount: number; // Nombre de nouvelles commandes (pending)
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'jour_marche_orders';

// Générer un numéro de commande unique
const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `JDM${year}${month}${day}-${random}`;
};

// Fonction d'initialisation paresseuse pour les commandes
const getInitialOrders = (): Order[] => {
  const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (storedOrders) {
    try {
      const parsed = JSON.parse(storedOrders);
      // Convertir les dates string en objets Date
      return parsed.map((order: Order) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        estimatedDeliveryTime: order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime) : undefined,
      }));
    } catch {
      console.error('Erreur lors du chargement des commandes');
    }
  }
  return [];
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);

  // Sauvegarder les commandes dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: generateOrderNumber(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
  };

  const getOrdersByShop = (shopId: string): Order[] => {
    return orders.filter(order => order.shopId === shopId);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  // Pour l'instant, on considère toutes les commandes comme appartenant au vendeur connecté
  // Dans une vraie app, on filtrerait par shopId du vendeur
  const sellerOrders = orders;
  
  const newOrdersCount = orders.filter(order => order.status === 'pending').length;

  return (
    <OrderContext.Provider
      value={{
        orders,
        sellerOrders,
        createOrder,
        updateOrderStatus,
        getOrdersByShop,
        getOrderById,
        newOrdersCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
