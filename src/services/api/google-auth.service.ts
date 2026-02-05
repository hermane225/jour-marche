// Service d'authentification Google
import { apiClient, tokenManager } from './client';
import type { AuthResponse } from './types';
import type { User, UserRole } from '../../types';

// Mapper la réponse API vers User
const mapUserFromApi = (apiUser: AuthResponse['data']): User | null => {
  if (!apiUser?.user) return null;
  
  const user = apiUser.user;
  
  // Gérer le nom
  let name = user.name;
  if (!name && (user.firstName || user.lastName)) {
    name = [user.firstName, user.lastName].filter(Boolean).join(' ');
  }
  
  // Mapper le rôle
  let role: UserRole = 'buyer';
  if (user.role === 'admin') role = 'admin';
  else if (user.role === 'seller' || user.role === 'vendor') role = 'seller';
  else if (user.role === 'driver') role = 'driver';
  
  return {
    id: user._id || user.id || '',
    email: user.email,
    name: name || user.email.split('@')[0],
    role,
    phone: user.phone,
    avatar: user.avatar,
    createdAt: new Date(user.createdAt),
  };
};

export interface GoogleAuthPayload {
  credential: string; // Le token ID de Google
  clientId: string;
}

export const googleAuthService = {
  /**
   * Connexion/inscription avec Google
   */
  loginWithGoogle: async (credential: string): Promise<User> => {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/google', {
        token: credential,
      }, { skipAuth: true });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Échec de la connexion Google');
      }

      // Sauvegarder le token
      tokenManager.setToken(response.data.token);

      const user = mapUserFromApi(response.data);
      if (!user) {
        throw new Error('Données utilisateur invalides');
      }

      return user;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          throw new Error('Impossible de se connecter au serveur.');
        }
        throw err;
      }
      throw new Error('Échec de la connexion Google');
    }
  },
};
