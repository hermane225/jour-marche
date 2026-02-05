// Types pour les réponses API

// Réponse générique de l'API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Réponse paginée
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Types pour l'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: 'buyer' | 'seller';
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      _id: string;
      id?: string;
      email: string;
      firstName?: string;
      lastName?: string;
      name?: string;
      role: string;
      phone?: string;
      avatar?: string;
      status?: string;
      isVerified?: boolean;
      createdAt: string;
      updatedAt?: string;
      lastLogin?: string;
    };
    token: string;
  };
  message?: string;
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data?: {
    token: string;
  };
  error?: string;
}

// Types pour les produits
export interface ProductsResponse {
  success: boolean;
  data: ProductDTO[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  category: string;
  shopId: string;
  shopName: string;
  variants?: {
    type: 'size' | 'color';
    options: string[];
  }[];
  status: 'published' | 'draft' | 'low_stock';
  createdAt: string;
  isPerishable?: boolean;
  expirationDate?: string;
  weight?: number;
  unit?: 'kg' | 'g' | 'l' | 'ml' | 'piece' | 'lot';
}

// Types pour les boutiques
export interface ShopDTO {
  id: string;
  name: string;
  description: string;
  logo?: string;
  phone: string;
  address: string;
  sellerId: string;
  createdAt: string;
  totalProducts: number;
  monthlySales: number;
  rating: number;
  deliveryOptions?: {
    pickup: boolean;
    delivery: boolean;
    deliveryFee: number;
    freeDeliveryMinimum?: number;
    deliveryZones?: string[];
  };
}

// Types pour les commandes
export interface OrderDTO {
  id: string;
  orderNumber: string;
  items: {
    productId: string;
    productTitle: string;
    price: number;
    quantity: number;
    selectedVariants?: {
      size?: string;
      color?: string;
    };
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'in_delivery' | 'delivered' | 'cancelled';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'mobile_money' | 'cash' | 'card';
  shopId: string;
  shopName: string;
  createdAt: string;
  updatedAt: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryFee?: number;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  estimatedDeliveryTime?: string;
  deliveryNotes?: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    selectedVariants?: {
      size?: string;
      color?: string;
    };
  }[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'mobile_money' | 'cash' | 'card';
  shopId: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryNotes?: string;
}

// Types pour les catégories
export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  subcategories?: {
    id: string;
    name: string;
    slug: string;
    icon?: string;
  }[];
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, string[]>;
}
