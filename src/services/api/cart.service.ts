// Service pour le panier - appels backend /api/carts
import { apiClient } from './client';
import type { ApiResponse } from './types';
import type { Cart, CartItem, Product } from '../../types';

// DTO retourné par l'API pour un item de panier
export interface CartItemDTO {
    _id?: string;
    id?: string;
    product: {
        _id?: string;
        id?: string;
        title: string;
        description: string;
        price: number;
        originalPrice?: number;
        stock: number;
        images: string[];
        category: string;
        shopId: string;
        shopName: string;
        variants?: { type: 'size' | 'color'; options: string[] }[];
        status: 'published' | 'draft' | 'low_stock';
        createdAt: string;
        isPerishable?: boolean;
        expirationDate?: string;
        weight?: number;
        unit?: 'kg' | 'g' | 'l' | 'ml' | 'piece' | 'lot';
    };
    quantity: number;
    selectedVariants?: { size?: string; color?: string };
}

// DTO du panier complet retourné par l'API
export interface CartDTO {
    _id?: string;
    id?: string;
    userId?: string;
    items: CartItemDTO[];
    total: number;
    deliveryFee?: number;
}

// Convertir un CartItemDTO en CartItem local
const mapCartItemFromApi = (dto: CartItemDTO): CartItem => {
    const product = dto.product as any;
    const productId = product._id || product.id || '';

    // L'API retourne "name" (MongoDB) mais le front utilise "title"
    const title: string = product.title || product.name || '';

    // L'API retourne shop comme objet populé { name, slug, logo } ou comme string
    const shopObj = product.shop as any;
    const shopId: string = product.shopId || (shopObj?._id || shopObj?.id || '');
    const shopName: string = product.shopName || shopObj?.name || '';

    const mappedProduct: Product = {
        id: productId,
        title,
        description: product.description || '',
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock ?? product.quantity ?? 0,
        images: product.images || [],
        category: product.category,
        shopId,
        shopName,
        variants: product.variants,
        status: product.status,
        createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
        isPerishable: product.isPerishable,
        expirationDate: product.expirationDate ? new Date(product.expirationDate) : undefined,
        weight: product.weight,
        unit: product.unit,
    };

    return {
        product: mappedProduct,
        quantity: dto.quantity,
        selectedVariants: dto.selectedVariants,
    };
};

// Convertir un CartDTO en Cart local
const mapCartFromApi = (dto: CartDTO): Cart => {
    const items = (dto.items || []).map(mapCartItemFromApi);
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return {
        items,
        total,
        deliveryFee: dto.deliveryFee,
    };
};

export const cartService = {
    /**
     * Récupérer le panier de l'utilisateur connecté
     */
    getCart: async (): Promise<Cart> => {
        try {
            const response = await apiClient.get<any>('/api/carts');
            // L'API peut retourner { success, data } ou directement les données
            const cartData = response?.data ?? response;
            if (!cartData || (!cartData.items && !Array.isArray(cartData))) {
                return { items: [], total: 0 };
            }
            // Si c'est un tableau d'items directement
            if (Array.isArray(cartData)) {
                const items = cartData.map(mapCartItemFromApi);
                const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                return { items, total };
            }
            return mapCartFromApi(cartData as CartDTO);
        } catch {
            return { items: [], total: 0 };
        }
    },

    /**
     * Ajouter un produit au panier
     */
    addItem: async (
        productId: string,
        quantity: number,
        selectedVariants?: { size?: string; color?: string }
    ): Promise<Cart> => {
        const response = await apiClient.post<any>('/api/carts/items', {
            productId,
            quantity,
            selectedVariants,
        });
        const cartData = response?.data ?? response;
        if (!cartData) return { items: [], total: 0 };
        if (Array.isArray(cartData)) {
            const items = cartData.map(mapCartItemFromApi);
            return { items, total: items.reduce((s, i) => s + i.product.price * i.quantity, 0) };
        }
        return mapCartFromApi(cartData as CartDTO);
    },

    /**
     * Mettre à jour la quantité d'un item
     * itemId = product._id dans le panier
     */
    updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
        const response = await apiClient.patch<any>(`/api/carts/items/${itemId}`, { quantity });
        const cartData = response?.data ?? response;
        if (!cartData) return { items: [], total: 0 };
        if (Array.isArray(cartData)) {
            const items = cartData.map(mapCartItemFromApi);
            return { items, total: items.reduce((s, i) => s + i.product.price * i.quantity, 0) };
        }
        return mapCartFromApi(cartData as CartDTO);
    },

    /**
     * Supprimer un item du panier
     */
    removeItem: async (itemId: string): Promise<Cart> => {
        const response = await apiClient.delete<any>(`/api/carts/items/${itemId}`);
        const cartData = response?.data ?? response;
        if (!cartData) return { items: [], total: 0 };
        if (Array.isArray(cartData)) {
            const items = cartData.map(mapCartItemFromApi);
            return { items, total: items.reduce((s, i) => s + i.product.price * i.quantity, 0) };
        }
        return mapCartFromApi(cartData as CartDTO);
    },

    /**
     * Vider le panier
     */
    clearCart: async (): Promise<void> => {
        try {
            await apiClient.delete('/api/carts');
        } catch {
            // Ignorer les erreurs de vidage
        }
    },
};

export default cartService;
