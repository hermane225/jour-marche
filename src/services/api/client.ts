// Client API centralisÃ© pour Jour de MarchÃ©
import { config } from '../../config';
import type { ApiError } from './types';

// ClÃ©s de stockage
const TOKEN_KEY = 'jour_marche_token';
const REFRESH_TOKEN_KEY = 'jour_marche_refresh_token';

// Types pour les options de requÃªte
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
  timeout?: number;
}

// Classe d'erreur personnalisÃ©e pour les erreurs API
export class ApiException extends Error {
  public status: number;
  public code?: string;
  public details?: Record<string, string[]>;
  public requestId?: string;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, string[]>,
    requestId?: string
  ) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
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

// Fonction pour crÃ©er les headers
const createHeaders = (options: RequestOptions = {}): Headers => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  // Ajouter le token d'authentification si disponible et non ignorÃ©
  if (!options.skipAuth) {
    const token = tokenManager.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Fusionner avec les headers personnalisÃ©s
  if (options.headers) {
    const customHeaders = new Headers(options.headers);
    customHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
};

// Fonction pour gÃ©rer les erreurs de rÃ©ponse avec parsing amÃ©liorÃ©
const handleResponseError = async (response: Response): Promise<never> => {
  let errorData: ApiError = {
    message: 'Une erreur est survenue',
    status: response.status,
  };

  const normalizeDetails = (value: unknown): Record<string, string[]> | undefined => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
    const normalized: Record<string, string[]> = {};
    for (const [key, rawMessages] of Object.entries(value)) {
      if (Array.isArray(rawMessages)) {
        normalized[key] = rawMessages.map((entry) => String(entry));
      } else if (rawMessages != null) {
        normalized[key] = [String(rawMessages)];
      }
    }
    return Object.keys(normalized).length ? normalized : undefined;
  };

  const detailsFromValidationErrors = (
    errors: unknown
  ): Record<string, string[]> | undefined => {
    if (!Array.isArray(errors)) return undefined;
    const grouped: Record<string, string[]> = {};
    for (const item of errors) {
      if (!item || typeof item !== 'object') continue;
      const maybeItem = item as Record<string, unknown>;
      const field = String(maybeItem.path ?? maybeItem.param ?? 'global');
      const message = maybeItem.msg != null ? String(maybeItem.msg) : 'Validation error';
      if (!grouped[field]) grouped[field] = [];
      grouped[field].push(message);
    }
    return Object.keys(grouped).length ? grouped : undefined;
  };

  try {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.toLowerCase().includes('application/json');

    let data: unknown;
    if (isJson) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text.trim() ? { message: text.trim() } : {};
    }

    const dataObject = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
    const messageRaw = dataObject.message;
    const errorRaw = dataObject.error;
    const messageString = messageRaw != null ? String(messageRaw) : undefined;
    const errorString = errorRaw != null ? String(errorRaw) : undefined;
    const isGenericServerMessage =
      response.status >= 500 &&
      messageString != null &&
      /^erreur lors de/i.test(messageString);
    const messageCandidate =
      (isGenericServerMessage && errorString ? `${messageString} (${errorString})` : undefined) ??
      messageString ??
      errorString ??
      (typeof data === 'string' ? data : undefined);
    const detailsCandidate =
      normalizeDetails(dataObject.details) ??
      detailsFromValidationErrors(dataObject.errors);

    errorData = {
      message: messageCandidate ? String(messageCandidate) : 'Une erreur est survenue',
      code: dataObject.code ? String(dataObject.code) : undefined,
      status: response.status,
      details: detailsCandidate,
      requestId: dataObject.requestId ? String(dataObject.requestId) : undefined,
    };

    // DEBUG: Log detaille de l'erreur
    console.group(`[API CLIENT] Erreur ${response.status}`);
    console.error('Message:', errorData.message);
    if (errorData.code) console.error('Code:', errorData.code);
    if (errorData.details) console.error('Details:', errorData.details);
    if (errorData.requestId) console.error('RequestId:', errorData.requestId);
    console.error('Reponse complete:', data);
    console.groupEnd();
  } catch {
    // La reponse n'est pas du JSON valide
    errorData.message = response.statusText || 'Erreur de connexion au serveur';
    console.error(`[API CLIENT] Reponse non-JSON:`, response.statusText);
  }

  throw new ApiException(
    errorData.message,
    errorData.status || response.status,
    errorData.code,
    errorData.details,
    errorData.requestId
  );
};

// Fonction principale pour les requÃªtes API
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

  // ðŸ› DEBUG: Log de la requÃªte (seulement si activÃ©)
  if (config.enableApiLogs) {
    const method = fetchOptions.method || 'GET';
    console.group(`ðŸŒ [API CLIENT] ${method} ${endpoint}`);
    console.log('URL complÃ¨te:', url);
    console.log('Headers:', Object.fromEntries(createHeaders(options)));
    if (body) console.log('Body:', body);
    console.groupEnd();
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: createHeaders(options),
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // ðŸ› DEBUG: Log de la rÃ©ponse (seulement si activÃ©)
    if (config.enableApiLogs) {
      console.log(`ðŸ“¥ [API CLIENT] Statut ${response.status}:`, response.statusText);
    }

    // GÃ©rer les erreurs HTTP
    if (!response.ok) {
      if (config.enableApiLogs) {
        console.error(`âŒ [API CLIENT] Erreur HTTP ${response.status}`);
      }
      
      // Si le token est expirÃ© (401), on dÃ©connecte l'utilisateur
      if (response.status === 401 && !options.skipAuth) {
        if (config.enableApiLogs) {
          console.warn('âš ï¸ [API CLIENT] Token expirÃ© - dÃ©connexion');
        }
        tokenManager.clearTokens();
        // Optionnel : rediriger vers la page de connexion
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      
      await handleResponseError(response);
    }

    // RÃ©ponse vide (204 No Content)
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
        throw new ApiException('La requÃªte a expirÃ©', 408, 'TIMEOUT');
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

// MÃ©thodes HTTP simplifiÃ©es
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

