// Configuration de l'application
// Les variables d'environnement Vite sont préfixées par VITE_

// En développement et production avec proxy, on utilise une URL vide
// Le proxy (Vite en dev, Vercel en prod) redirigera /api vers l'API
const getApiUrl = () => {
  // Si une URL est explicitement définie (non vide), l'utiliser
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl;
  }
  // Sinon, utiliser une chaîne vide pour que le proxy gère les requêtes
  // En dev: proxy Vite, en prod: rewrites Vercel
  return '';
};

export const config = {
  // URL de l'API backend
  apiUrl: getApiUrl(),
  
  // Mode de l'application
  appMode: import.meta.env.VITE_APP_MODE || 'development',
  
  // Utiliser les données mockées au lieu de l'API
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  
  // Est-ce qu'on est en production ?
  isProduction: import.meta.env.PROD,
  
  // Est-ce qu'on est en développement ?
  isDevelopment: import.meta.env.DEV,
  
  // Google OAuth Client ID
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
} as const;

// Type pour les variables d'environnement Vite
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_MODE: string;
    readonly VITE_USE_MOCK_DATA: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export default config;
