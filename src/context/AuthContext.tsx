import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Données de démonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'buyer@email.com',
    name: 'Amara Koné',
    role: 'buyer',
    phone: '+225 07 12 34 56',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    email: 'seller@email.com',
    name: 'Nom du Vendeur',
    role: 'seller',
    phone: '+225 05 98 76 54',
    createdAt: new Date('2023-02-20'),
  },
];

// Fonction d'initialisation paresseuse pour le user
const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem('jour_marche_user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('jour_marche_user', JSON.stringify(foundUser));
    } else {
      // Créer un utilisateur de démonstration
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'buyer',
        createdAt: new Date(),
      };
      setUser(newUser);
      localStorage.setItem('jour_marche_user', JSON.stringify(newUser));
    }
    
    setIsLoading(false);
  };

  const signup = async (email: string, _password: string, name: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('jour_marche_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jour_marche_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('jour_marche_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        signup, 
        logout,
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
