// Export de tous les hooks
export { useApi, useMutation, usePaginatedApi } from './useApi';
export { 
  useProduct, 
  useProducts, 
  useShopProducts, 
  useProductSearch,
  usePopularProducts,
  usePromotionalProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './useProducts';
export { 
  useShop, 
  useShops, 
  useSellerShops,
  usePopularShops,
  useShopSearch,
  useCreateShop,
  useUpdateShop,
  useDeleteShop,
} from './useShops';
export {
  useOrder,
  useOrders,
  useMyOrders,
  useShopOrders,
  useCreateOrder,
  useUpdateOrderStatus,
  useCancelOrder,
  useAssignDriver,
  useOrderStats,
} from './useOrders';
export {
  useCategories,
  useCategory,
  useMainCategories,
} from './useCategories';
