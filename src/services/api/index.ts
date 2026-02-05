// Export de tous les services API
export { apiClient, tokenManager, ApiException } from './client';
export { authService } from './auth.service';
export { googleAuthService } from './google-auth.service';
export { productService } from './products.service';
export { shopService } from './shops.service';
export { orderService } from './orders.service';
export { categoryService } from './categories.service';
export { paymentService } from './payments.service';
export { driverService } from './drivers.service';
export { adminService } from './admin.service';
export { uploadService } from './uploads.service';

// Export des types
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ProductDTO,
  ProductsResponse,
  ShopDTO,
  OrderDTO,
  CreateOrderRequest,
  CategoryDTO,
} from './types';

export type { Transaction, PaymentRequest } from './payments.service';
export type { Delivery, DeliveryStatusUpdate } from './drivers.service';
export type { PlatformSettings, DashboardStats, AdminUser } from './admin.service';
export type { UploadedFile } from './uploads.service';
