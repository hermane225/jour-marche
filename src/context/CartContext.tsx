import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Cart, CartItem, Product } from '../types';
import { cartService } from '../services/api/cart.service';
import { productService, tokenManager } from '../services/api';

interface CartContextType {
  cart: Cart;
  isCartLoading: boolean;
  addToCart: (product: Product, quantity?: number, variants?: { size?: string; color?: string }) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  setDeliveryFee: (fee: number) => void;
  clearCart: () => Promise<void>;
  reloadCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const EMPTY_CART: Cart = { items: [], total: 0 };
const GUEST_CART_KEY = 'jour_marche_cart_guest';

const getGuestCart = (): Cart => {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return EMPTY_CART;
};

const saveGuestCart = (cart: Cart) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
};

const calculateTotal = (items: CartItem[], deliveryFee = 0): number =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + deliveryFee;

const isUnavailable = (product: Product): boolean => {
  const status = product.status;
  return product.stock <= 0 || status === 'discontinued';
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const migrateGuestCartToApi = useCallback(async () => {
    if (!tokenManager.hasToken()) return;

    const guestCart = getGuestCart();
    if (!guestCart.items.length) return;

    for (const item of guestCart.items) {
      try {
        await cartService.addItem(item.product.id, item.quantity, item.selectedVariants);
      } catch {
        // ignore migration errors for individual items
      }
    }

    localStorage.removeItem(GUEST_CART_KEY);
  }, []);

  const syncCartWithLiveProducts = useCallback(async (currentCart: Cart, authenticated: boolean): Promise<Cart> => {
    if (!currentCart.items.length) return currentCart;

    const liveProducts = await Promise.allSettled(
      currentCart.items.map((item) => productService.getProduct(item.product.id))
    );

    let changed = false;
    const syncedItems: CartItem[] = [];

    for (let index = 0; index < currentCart.items.length; index += 1) {
      const localItem = currentCart.items[index];
      const liveResult = liveProducts[index];

      if (liveResult.status === 'rejected') {
        // Ne pas retirer l'article localement sur une erreur reseau/API ponctuelle.
        syncedItems.push(localItem);
        continue;
      }

      const liveProduct = liveResult.value;
      if (isUnavailable(liveProduct)) {
        changed = true;
        // Pour les comptes connectes, on nettoie le backend; pour l'UI on garde l'article
        // afin d'eviter l'effet "apparait puis disparait" sur les produits recents.
        if (authenticated) {
          try { await cartService.removeItem(localItem.product.id); } catch { /* ignore */ }
        }
        syncedItems.push(localItem);
        continue;
      }

      const safeQty = Math.min(localItem.quantity, liveProduct.stock);
      if (safeQty !== localItem.quantity) {
        changed = true;
        if (authenticated) {
          try { await cartService.updateItem(localItem.product.id, safeQty); } catch { /* ignore */ }
        }
      }

      if (
        localItem.product.price !== liveProduct.price ||
        localItem.product.stock !== liveProduct.stock ||
        localItem.product.status !== liveProduct.status
      ) {
        changed = true;
      }

      syncedItems.push({
        ...localItem,
        quantity: safeQty,
        product: { ...liveProduct },
      });
    }

    const syncedCart: Cart = {
      ...currentCart,
      items: syncedItems,
      total: calculateTotal(syncedItems, currentCart.deliveryFee),
    };

    if (!authenticated) {
      saveGuestCart(syncedCart);
    }

    return changed ? syncedCart : currentCart;
  }, []);

  const reloadCart = useCallback(async () => {
    const authenticated = tokenManager.hasToken();

    if (authenticated) {
      setIsCartLoading(true);
      try {
        await migrateGuestCartToApi();
        const apiCart = await cartService.getCart();
        const synced = await syncCartWithLiveProducts(apiCart, true);
        setCart(synced);
      } catch {
        setCart(EMPTY_CART);
      } finally {
        setIsCartLoading(false);
      }
      return;
    }

    const guestCart = getGuestCart();
    const syncedGuestCart = await syncCartWithLiveProducts(guestCart, false);
    setCart(syncedGuestCart);
  }, [migrateGuestCartToApi, syncCartWithLiveProducts]);

  useEffect(() => {
    reloadCart();

    const handleLogout = () => setCart(EMPTY_CART);
    const handleLogin = () => reloadCart();
    const handleFocus = () => reloadCart();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') reloadCart();
    };

    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    const intervalId = window.setInterval(() => {
      reloadCart();
    }, 30000);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(intervalId);
    };
  }, [reloadCart]);

  const addToCart = async (
    product: Product,
    quantity = 1,
    variants?: { size?: string; color?: string }
  ) => {
    if (tokenManager.hasToken()) {
      setCart((prev) => {
        const existingIndex = prev.items.findIndex((i) => i.product.id === product.id);
        const newItems = existingIndex > -1
          ? prev.items.map((item, idx) => (idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item))
          : [...prev.items, { product, quantity, selectedVariants: variants }];
        return { ...prev, items: newItems, total: calculateTotal(newItems, prev.deliveryFee) };
      });

      try {
        const updated = await cartService.addItem(product.id, quantity, variants);
        const synced = await syncCartWithLiveProducts(updated, true);
        setCart((prev) => ({ ...synced, deliveryFee: prev.deliveryFee }));
      } catch {
        await reloadCart();
      }
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.product.id === product.id);
      const newItems = existingIndex > -1
        ? prev.items.map((item, idx) => (idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item))
        : [...prev.items, { product, quantity, selectedVariants: variants }];
      const updated = { ...prev, items: newItems, total: calculateTotal(newItems, prev.deliveryFee) };
      saveGuestCart(updated);
      return updated;
    });
  };

  const removeFromCart = async (productId: string) => {
    if (tokenManager.hasToken()) {
      setCart((prev) => {
        const newItems = prev.items.filter((i) => i.product.id !== productId);
        return { ...prev, items: newItems, total: calculateTotal(newItems, prev.deliveryFee) };
      });

      try {
        const updated = await cartService.removeItem(productId);
        const synced = await syncCartWithLiveProducts(updated, true);
        setCart((prev) => ({ ...synced, deliveryFee: prev.deliveryFee }));
      } catch {
        await reloadCart();
      }
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.filter((i) => i.product.id !== productId);
      const updated = { ...prev, items: newItems, total: calculateTotal(newItems, prev.deliveryFee) };
      saveGuestCart(updated);
      return updated;
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (tokenManager.hasToken()) {
      setCart((prev) => {
        const newItems = prev.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
        return { ...prev, items: newItems, total: calculateTotal(newItems, prev.deliveryFee) };
      });

      try {
        const updated = await cartService.updateItem(productId, quantity);
        const synced = await syncCartWithLiveProducts(updated, true);
        setCart((prev) => ({ ...synced, deliveryFee: prev.deliveryFee }));
      } catch {
        await reloadCart();
      }
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
      const updated = { ...prev, items: newItems, total: calculateTotal(newItems, prev.deliveryFee) };
      saveGuestCart(updated);
      return updated;
    });
  };

  const setDeliveryFee = (fee: number) => {
    setCart((prev) => ({
      ...prev,
      deliveryFee: fee,
      total: calculateTotal(prev.items, fee),
    }));
  };

  const clearCart = async () => {
    if (tokenManager.hasToken()) {
      try {
        await cartService.clearCart();
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
    }
    setCart(EMPTY_CART);
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        setDeliveryFee,
        clearCart,
        reloadCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
