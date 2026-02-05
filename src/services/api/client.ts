// Client API centralisé pour Jour de Marché
import { config } from '../../config';
import type { ApiError } from './types';

// Clés de stockage
const TOKEN_KEY = 'jour_marche_token';
const REFRESH_TOKEN_KEY = 'jour_marche_refresh_token';

// Types pour les options de requête
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
  timeout?: number;
}

// Classe d'erreur personnalisée pour les erreurs API
export class ApiException extends Error {
  public status: number;
  public code?: string;
  public details?: Record<string, string[]>;

  constructor(message: string, status: number, code?: string, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Gestionnaire de tokens
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

// Fonction pour créer les headers
const createHeaders = (options: RequestOptions = {}): Headers => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  // Ajouter le token d'authentification si disponible et non ignoré
  if (!options.skipAuth) {
    const token = tokenManager.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Fusionner avec les headers personnalisés
  if (options.headers) {
    const customHeaders = new Headers(options.headers);
    customHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
};

// Fonction pour gérer les erreurs de réponse
const handleResponseError = async (response: Response): Promise<never> => {
  let errorData: ApiError = {
    message: 'Une erreur est survenue',
    status: response.status,
  };

  try {
    const data = await response.json();
    errorData = {
      message: data.message || data.error || 'Une erreur est survenue',
      code: data.code,
      status: response.status,
      details: data.details,
    };
  } catch {
    // La réponse n'est pas du JSON valide
    errorData.message = response.statusText || 'Erreur de connexion au serveur';
  }

  throw new ApiException(
    errorData.message,
    errorData.status || response.status,
    errorData.code,
    errorData.details
  );
};

// Fonction principale pour les requêtes API
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, timeout = 30000, ...fetchOptions } = options;

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${config.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: createHeaders(options),
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Gérer les erreurs HTTP
    if (!response.ok) {
      // Si le token est expiré (401), on déconnecte l'utilisateur
      if (response.status === 401 && !options.skipAuth) {
        tokenManager.clearTokens();
        // Optionnel : rediriger vers la page de connexion
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      
      await handleResponseError(response);
    }

    // Réponse vide (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiException) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiException('La requête a expiré', 408, 'TIMEOUT');
      }
      throw new ApiException(
        error.message || 'Erreur de connexion au serveur',
        0,
        'NETWORK_ERROR'
      );
    }

    throw new ApiException('Une erreur inattendue est survenue', 500);
  }
}

// Méthodes HTTP simplifiées
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

export default apiClient;
