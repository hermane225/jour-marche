// Configuration de l'application
// Les variables d'environnement Vite sont prefixees par VITE_

// Configuration de l'URL de l'API
const getApiUrl = () => {
  // En dev: passer par le proxy Vite (/api -> onrender) pour eviter CORS
  if (import.meta.env.DEV) {
    return '';
  }

  // Si une URL est explicitement definie (non vide), l'utiliser
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl;
  }

  // En production: API reelle par defaut
  return 'https://jour-marche-api.onrender.com';
};

export const config = {
  // URL de l'API backend
  apiUrl: getApiUrl(),

  // Mode de l'application
  appMode: import.meta.env.VITE_APP_MODE || 'development',

  // Utiliser les donnees mockees au lieu de l'API
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',

  // Est-ce qu'on est en production ?
  isProduction: import.meta.env.PROD,

  // Est-ce qu'on est en developpement ?
  isDevelopment: import.meta.env.DEV,

  // Activer les logs detailles de l'API (seulement en dev)
  enableApiLogs: import.meta.env.DEV && import.meta.env.VITE_ENABLE_API_LOGS !== 'false',

  // Google OAuth Client ID
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
} as const;

// Type pour les variables d'environnement Vite
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_MODE: string;
    readonly VITE_USE_MOCK_DATA: string;
    readonly VITE_ENABLE_API_LOGS: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export default config;
