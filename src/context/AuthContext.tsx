import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { authService, tokenManager } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonction d'initialisation paresseuse pour le user
const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem('jour_marche_user');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      // Convertir la date string en objet Date
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
      };
    } catch {
      return null;
    }
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Écouter l'événement de déconnexion forcée (token expiré)
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('jour_marche_user');
      tokenManager.clearTokens();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Vérifier le token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (tokenManager.hasToken() && !user) {
        try {
          setIsLoading(true);
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem('jour_marche_user', JSON.stringify(currentUser));
          }
        } catch {
          // Token invalide, on le supprime
          tokenManager.clearTokens();
          localStorage.removeItem('jour_marche_user');
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Appeler l'API d'authentification
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem('jour_marche_user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Échec de la connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Appeler l'API d'inscription
      const registeredUser = await authService.signup(email, password, name, role);
      setUser(registeredUser);
      localStorage.setItem('jour_marche_user', JSON.stringify(registeredUser));
      return registeredUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Échec de l'inscription";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignorer les erreurs de déconnexion
    } finally {
      setUser(null);
      localStorage.removeItem('jour_marche_user');
      tokenManager.clearTokens();
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
      localStorage.setItem('jour_marche_user', JSON.stringify(updatedUser));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Échec de la mise à jour du profil';
      setError(errorMessage);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        error,
        login, 
        signup, 
        logout,
        updateUser,
        clearError,
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
