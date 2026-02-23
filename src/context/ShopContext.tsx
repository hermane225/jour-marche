import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Shop } from '../types';
import { shopService } from '../services/api';
import type { CreateShopPayload, UpdateShopPayload } from '../services/api/shops.service';

interface ShopContextType {
  shops: Shop[];           // Toutes les boutiques (publiques)
  myShops: Shop[];         // Boutiques du vendeur connecté
  isShopsLoading: boolean;
  addShop: (payload: CreateShopPayload) => Promise<Shop>;
  updateShop: (id: string, updates: Partial<UpdateShopPayload>) => Promise<void>;
  deleteShop: (id: string) => Promise<void>;
  getShopsBySeller: (sellerId: string) => Shop[];
  getShopById: (id: string) => Shop | undefined;
  reloadMyShops: (sellerId: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const dedupeShopsById = (items: Shop[]): Shop[] => {
  const seen = new Set<string>();
  return items.filter((shop) => {
    if (!shop.id || seen.has(shop.id)) return false;
    seen.add(shop.id);
    return true;
  });
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [myShops, setMyShops] = useState<Shop[]>([]);
  const [isShopsLoading, setIsShopsLoading] = useState(false);

  // Charger toutes les boutiques publiques
  const loadShops = useCallback(async () => {
    try {
      const { shops: fetched } = await shopService.getShops({ limit: 100 });
      setShops(dedupeShopsById(fetched));
    } catch {
      // Ignorer les erreurs de chargement silencieusement
    }
  }, []);

  // Charger les boutiques du seller connecté
  const reloadMyShops = useCallback(async (sellerId: string) => {
    if (!sellerId) return;
    try {
      const sellerShops = await shopService.getShopsBySeller(sellerId);
      setMyShops(dedupeShopsById(sellerShops));
    } catch {
      setMyShops([]);
    }
  }, []);

  // Charger au montage
  useEffect(() => {
    loadShops();
  }, [loadShops]);

  // Réagir aux événements d'auth (sans restriction de rôle)
  useEffect(() => {
    const handleLogin = (e: Event) => {
      const user = (e as CustomEvent).detail;
      // ✅ Connexion sans exiger le rôle seller
      if (user?.id) {
        reloadMyShops(user.id);
      }
    };
    const handleLogout = () => {
      setMyShops([]);
    };

    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);
    
    // ✅ Nettoyage important pour éviter les fuites de mémoire
    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [reloadMyShops]);

  // ─── Créer une boutique via l'API ────────────────────────────────────────────
  const addShop = async (payload: CreateShopPayload): Promise<Shop> => {
    console.log('🏪 [SHOP CONTEXT] Début création boutique:', payload);
    
    try {
      const newShop = await shopService.createShop(payload);
      console.log('✅ [SHOP CONTEXT] Boutique créée avec succès:', newShop);
      
      // Mettre à jour l'état local immédiatement
      setShops((prev) => dedupeShopsById([...prev, newShop]));
      setMyShops((prev) => dedupeShopsById([...prev, newShop]));
      return newShop;
    } catch (error) {
      console.error('❌ [SHOP CONTEXT] Erreur création boutique:', error);
      throw error;
    }
  };

  // ─── Mettre à jour une boutique via l'API ────────────────────────────────────
  const updateShop = async (id: string, updates: Partial<UpdateShopPayload>) => {
    const updated = await shopService.updateShop(id, updates);
    setShops(prev => prev.map(s => s.id === id ? updated : s));
    setMyShops(prev => prev.map(s => s.id === id ? updated : s));
  };

  // ─── Supprimer une boutique via l'API ───────────────────────────────────────
  const deleteShop = async (id: string) => {
    await shopService.deleteShop(id);
    setShops(prev => prev.filter(s => s.id !== id));
    setMyShops(prev => prev.filter(s => s.id !== id));
  };

  const getShopsBySeller = (sellerId: string): Shop[] =>
    shops.filter(s => s.sellerId === sellerId);

  const getShopById = (id: string): Shop | undefined =>
    shops.find(s => s.id === id) || myShops.find(s => s.id === id);

  return (
    <ShopContext.Provider
      value={{
        shops,
        myShops,
        isShopsLoading,
        addShop,
        updateShop,
        deleteShop,
        getShopsBySeller,
        getShopById,
        reloadMyShops,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShops() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShops must be used within a ShopProvider');
  }
  return context;
}
