// Service d'authentification
import { apiClient, tokenManager } from './client';
import type { AuthResponse, LoginRequest, SignupRequest } from './types';
import type { User, UserRole } from '../../types';

// Convertir la réponse API en objet User local
const mapUserFromApi = (apiUser: AuthResponse['data']): User | null => {
  if (!apiUser?.user) return null;
  
  const user = apiUser.user;
  
  // Gérer le nom: utiliser firstName/lastName ou name
  let name = user.name;
  if (!name && (user.firstName || user.lastName)) {
    name = [user.firstName, user.lastName].filter(Boolean).join(' ');
  }
  
  return {
    id: user._id || user.id || '',
    email: user.email,
    name: name || user.email.split('@')[0],
    role: user.role as UserRole,
    phone: user.phone,
    avatar: user.avatar,
    createdAt: new Date(user.createdAt),
  };
};

export const authService = {
  /**
   * Connexion d'un utilisateur
   */
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', {
        email,
        password,
      } as LoginRequest, { skipAuth: true });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Email ou mot de passe incorrect');
      }

      // Sauvegarder le token
      tokenManager.setToken(response.data.token);

      const user = mapUserFromApi(response.data);
      if (!user) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return user;
    } catch (err) {
      // Convertir les erreurs réseau en messages lisibles
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        }
        throw err;
      }
      throw new Error('Email ou mot de passe incorrect');
    }
  },

  /**
   * Inscription d'un nouvel utilisateur
   */
  signup: async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string
  ): Promise<User> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      name,
      role: role === 'buyer' || role === 'seller' ? role : 'buyer',
      phone,
    } as SignupRequest, { skipAuth: true });

    if (!response.success || !response.data) {
      throw new Error(response.message || "Échec de l'inscription");
    }

    // Sauvegarder le token
    tokenManager.setToken(response.data.token);

    const user = mapUserFromApi(response.data);
    if (!user) {
      throw new Error('Données utilisateur invalides');
    }

    return user;
  },

  /**
   * Déconnexion
   */
  logout: async (): Promise<void> => {
    try {
      // Notifier le serveur de la déconnexion
      await apiClient.post('/api/auth/logout', {});
    } catch {
      // Ignorer les erreurs de déconnexion côté serveur
    } finally {
      tokenManager.clearTokens();
    }
  },

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      if (!tokenManager.hasToken()) {
        return null;
      }

      const response = await apiClient.get<AuthResponse>('/api/auth/me');

      if (!response.success || !response.data) {
        return null;
      }

      return mapUserFromApi(response.data);
    } catch {
      // Token invalide ou expiré
      tokenManager.clearTokens();
      return null;
    }
  },

  /**
   * Mettre à jour le profil utilisateur
   */
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await apiClient.put<AuthResponse>('/api/users/profile', updates);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Échec de la mise à jour du profil');
    }

    const user = mapUserFromApi(response.data);
    if (!user) {
      throw new Error('Données utilisateur invalides');
    }

    return user;
  },

  /**
   * Changer le mot de passe
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await apiClient.put<{ success: boolean; message?: string }>('/api/users/profile', {
      currentPassword,
      newPassword,
    });

    if (!response.success) {
      throw new Error(response.message || 'Échec du changement de mot de passe');
    }
  },

  /**
   * Demander la réinitialisation du mot de passe
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    const response = await apiClient.post<{ success: boolean; message?: string }>(
      '/api/auth/forgot-password',
      { email },
      { skipAuth: true }
    );

    if (!response.success) {
      throw new Error(response.message || 'Échec de la demande de réinitialisation');
    }
  },

  /**
   * Réinitialiser le mot de passe avec un token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    const response = await apiClient.post<{ success: boolean; message?: string }>(
      '/api/auth/reset-password',
      { token, newPassword },
      { skipAuth: true }
    );

    if (!response.success) {
      throw new Error(response.message || 'Échec de la réinitialisation du mot de passe');
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated: (): boolean => {
    return tokenManager.hasToken();
  },
};

export default authService;
