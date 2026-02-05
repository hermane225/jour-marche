// Configuration de l'application
// Les variables d'environnement Vite sont préfixées par VITE_

// En développement, on utilise une URL vide pour que le proxy Vite gère les requêtes
// En production, on utilise l'URL de l'API
const getApiUrl = () => {
  // Si une URL est explicitement définie, l'utiliser
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // En développement, utiliser une chaîne vide (le proxy Vite redirigera /api vers l'API)
  if (import.meta.env.DEV) {
    return '';
  }
  // En production, utiliser l'URL par défaut
  return 'https://jour-marche-api.onrender.com';
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
} as const;

// Type pour les variables d'environnement Vite
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_MODE: string;
    readonly VITE_USE_MOCK_DATA: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export default config;
