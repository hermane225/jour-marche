// Types pour l'application Jour de Marché

export type UserRole = 'guest' | 'buyer' | 'seller' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

// Interface pour les livreurs
export interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: 'moto' | 'voiture' | 'velo';
  licensePlate?: string;
  isAvailable: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  rating: number;
  totalDeliveries: number;
  createdAt: Date;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo?: string;
  phone: string;
  address: string;
  sellerId: string;
  createdAt: Date;
  totalProducts: number;
  monthlySales: number;
  rating: number;
  // Options de livraison
  deliveryOptions?: {
    pickup: boolean; // Retrait en boutique
    delivery: boolean; // Livraison à domicile
    deliveryFee: number; // Frais de livraison
    freeDeliveryMinimum?: number; // Livraison gratuite à partir de X FCFA
    deliveryZones?: string[]; // Zones de livraison
  };
}

export interface ProductVariant {
  type: 'size' | 'color';
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number; // Prix barré (avant promo)
  stock: number;
  images: string[];
  category: string;
  shopId: string;
  shopName: string;
  variants?: ProductVariant[];
  status: 'published' | 'draft' | 'low_stock';
  createdAt: Date;
  // Options spécifiques aux produits alimentaires
  isPerishable?: boolean; // Produit périssable
  expirationDate?: Date;
  weight?: number; // Poids en grammes
  unit?: 'kg' | 'g' | 'l' | 'ml' | 'piece' | 'lot'; // Unité de vente
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: {
    size?: string;
    color?: string;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'in_delivery' | 'delivered' | 'cancelled';

export type DeliveryType = 'pickup' | 'delivery';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'mobile_money' | 'cash' | 'card';
  shopId: string;
  shopName: string;
  createdAt: Date;
  updatedAt: Date;
  // Informations de livraison
  deliveryType: DeliveryType;
  deliveryFee?: number;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  estimatedDeliveryTime?: Date;
  deliveryNotes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string; // Icône pour la catégorie
  description?: string;
}

export interface SellerStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  productViews: number;
  viewsChange: number;
  newClients: number;
  clientsChange: number;
}

// Stats pour les livreurs
export interface DriverStats {
  totalDeliveries: number;
  deliveriesChange: number;
  totalEarnings: number;
  earningsChange: number;
  averageRating: number;
  ratingChange: number;
  completionRate: number;
}

// Livraison en cours
export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  driverId: string;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  pickupAddress: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  shopName: string;
  estimatedTime: number; // en minutes
  fee: number;
  distance: number; // en km
  createdAt: Date;
}
