import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Shop } from '../types';
import { shops as mockShops } from '../data/mockData';

interface ShopContextType {
  shops: Shop[];
  addShop: (shop: Omit<Shop, 'id' | 'createdAt' | 'totalProducts' | 'monthlySales' | 'rating'>) => Shop;
  updateShop: (id: string, updates: Partial<Shop>) => void;
  deleteShop: (id: string) => void;
  getShopsBySeller: (sellerId: string) => Shop[];
  getShopById: (id: string) => Shop | undefined;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEY = 'jour_marche_shops';

// Fonction d'initialisation paresseuse pour les boutiques
const getInitialShops = (): Shop[] => {
  const storedShops = localStorage.getItem(STORAGE_KEY);
  if (storedShops) {
    try {
      const parsed = JSON.parse(storedShops);
      // Convertir les dates string en objets Date
      return parsed.map((shop: Shop) => ({
        ...shop,
        createdAt: new Date(shop.createdAt)
      }));
    } catch {
      return mockShops;
    }
  }
  return mockShops;
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<Shop[]>(getInitialShops);

  // Sauvegarder dans localStorage à chaque modification
  const saveToStorage = (newShops: Shop[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newShops));
  };

  const addShop = (shopData: Omit<Shop, 'id' | 'createdAt' | 'totalProducts' | 'monthlySales' | 'rating'>): Shop => {
    const newShop: Shop = {
      ...shopData,
      id: `shop_${Date.now()}`,
      createdAt: new Date(),
      totalProducts: 0,
      monthlySales: 0,
      rating: 5.0, // Nouvelle boutique commence avec 5 étoiles
    };

    const updatedShops = [...shops, newShop];
    setShops(updatedShops);
    saveToStorage(updatedShops);
    
    return newShop;
  };

  const updateShop = (id: string, updates: Partial<Shop>) => {
    const updatedShops = shops.map(shop => 
      shop.id === id ? { ...shop, ...updates } : shop
    );
    setShops(updatedShops);
    saveToStorage(updatedShops);
  };

  const deleteShop = (id: string) => {
    const updatedShops = shops.filter(shop => shop.id !== id);
    setShops(updatedShops);
    saveToStorage(updatedShops);
  };

  const getShopsBySeller = (sellerId: string): Shop[] => {
    return shops.filter(shop => shop.sellerId === sellerId);
  };

  const getShopById = (id: string): Shop | undefined => {
    return shops.find(shop => shop.id === id);
  };

  return (
    <ShopContext.Provider value={{ 
      shops, 
      addShop, 
      updateShop, 
      deleteShop, 
      getShopsBySeller,
      getShopById 
    }}>
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
