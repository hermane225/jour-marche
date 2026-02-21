# Guide de résolution des erreurs API

> 🎯 **Nouveau !** Un système de débogage complet a été ajouté. Consultez [DEBUG_USAGE_GUIDE.md](DEBUG_USAGE_GUIDE.md) pour des instructions détaillées.
> 
> **Raccourci rapide :** Appuyez sur `Ctrl + Shift + D` pour afficher le panneau de débogage visuel.

---

## Erreurs identifiées

### 1. ❌ Erreur 404 sur `/api/auth/logout`

**Problème :** L'endpoint de déconnexion n'existe pas sur l'API backend.

**Statut :** ✅ **Résolu** - Le code gère déjà cette erreur gracieusement dans `src/services/api/auth.service.ts` :

```typescript
logout: async (): Promise<void> => {
  try {
    await apiClient.post('/api/auth/logout', {});
  } catch {
    // Ignore les erreurs - nettoie les tokens localement
  } finally {
    tokenManager.clearTokens();
  }
}
```

**Impact :** Aucun - Les tokens sont nettoyés côté client même si le serveur ne répond pas.

---

### 2. ⚠️ Erreur 500 sur `/api/shops` (Internal Server Error)

**Problème :** Le serveur renvoie une erreur 500 lors de certaines opérations sur les boutiques.

**Causes possibles :**

1. **Authentification manquante**
   - L'utilisateur n'est pas connecté
   - Le token JWT est expiré ou invalide
   - Le header `Authorization` n'est pas envoyé correctement

2. **Validation des données**
   - Champs requis manquants (ex: `name`, `category`)
   - Format de données incorrect
   - L'ID de catégorie (`category`) n'existe pas dans la base de données

3. **Problème côté serveur**
   - Base de données MongoDB non accessible
   - Erreur dans le code backend
   - Connexion réseau instable

**Solutions :**

#### A. Vérifier l'authentification

```typescript
// Dans la console du navigateur (F12 > Console)
console.log('Token JWT:', localStorage.getItem('jour_marche_token'));
console.log('User authentifié:', tokenManager.hasToken());
```

Si le token est `null`, l'utilisateur doit se connecter :
```typescript
// Se connecter d'abord
await authService.login('email@example.com', 'password');
```

#### B. Vérifier les données envoyées

Lors de la création d'une boutique, assurez-vous que :

```typescript
const payload = {
  name: 'Ma Boutique',           // ✅ Requis
  category: '507f1f77bcf86cd799439011', // ✅ Requis - MongoID valide
  description: 'Description...',  // ❌ Optionnel
  phone: '+33612345678',          // ❌ Optionnel
  address: {                      // ❌ Optionnel
    street: '12 rue...',
    city: 'Paris',
    zipCode: '75001',
    country: 'France'
  }
};
```

#### C. Obtenir les catégories valides

Avant de créer une boutique, récupérez les catégories disponibles :

```typescript
import { categoriesService } from './services/api/categories.service';

// Récupérer toutes les catégories
const categories = await categoriesService.getCategories();
console.log('Catégories disponibles:', categories);

// Utiliser l'ID d'une catégorie existante
const categoryId = categories[0].id;
```

#### D. Déboguer les erreurs

**🆕 Système de débogage automatique activé !**

Le système log automatiquement tous les détails dans la console du navigateur :

1. Ouvrez la console (F12)
2. Appuyez sur `Ctrl + Shift + D` pour le panneau de débogage visuel
3. Essayez de créer une boutique
4. Examinez les logs détaillés qui s'affichent

Les logs incluent :
- 📤 Données envoyées à l'API
- 🔑 Présence et validité du token
- 📥 Réponse complète du serveur
- ❌ Détails des erreurs (message, code, données)

Pour plus d'informations, consultez [DEBUG_USAGE_GUIDE.md](DEBUG_USAGE_GUIDE.md).

**Méthode manuelle (si nécessaire) :**

Ajoutez des logs dans `src/services/api/shops.service.ts` :

```typescript
createShop: async (payload: CreateShopPayload): Promise<Shop> => {
  console.log('📤 Création boutique - Payload:', payload);
  
  try {
    const response = await apiClient.post<ApiResponse<ShopDTO>>('/api/shops', body);
    console.log('✅ Réponse API:', response);
    // ...
  } catch (error) {
    console.error('❌ Erreur création boutique:', error);
    throw error;
  }
}
```

---

### 3. ✅ Avertissement GSI_LOGGER (Google Sign-In) - RÉSOLU

**Problème :** `[GSI_LOGGER]: Failed to render button before calling initialize()`

**Cause :** Le SDK Google Sign-In n'était pas chargé avant que le composant tente de rendre le bouton.

**Solution appliquée :**

1. **Ajout du SDK dans `index.html` :**
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

2. **Attente du chargement dans les composants Login/Signup :**
```typescript
useEffect(() => {
  const initializeGoogleButton = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(container, {...});
    }
  };

  // Attendre que le SDK soit chargé
  if (window.google?.accounts?.id) {
    initializeGoogleButton();
  } else {
    const checkGoogleLoaded = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogleLoaded);
        initializeGoogleButton();
      }
    }, 100);
    
    setTimeout(() => clearInterval(checkGoogleLoaded), 5000);
    return () => clearInterval(checkGoogleLoaded);
  }
}, []);
```

---

## Configuration du proxy (Vite)

Le fichier `vite.config.ts` redirige les requêtes `/api/*` vers l'API backend :

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://jour-marche-api.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
```

**En développement :** Les requêtes passent par le proxy Vite  
**En production :** Les requêtes vont directement vers `https://jour-marche-api.onrender.com`

---

## Tests de l'API

Testez directement l'API avec PowerShell :

```powershell
# Test de l'endpoint /api/shops (GET)
Invoke-WebRequest -Uri "https://jour-marche-api.onrender.com/api/shops" -UseBasicParsing

# Test avec authentification (POST)
$headers = @{
  "Authorization" = "Bearer VOTRE_TOKEN_JWT"
  "Content-Type" = "application/json"
}
$body = @{
  name = "Ma Boutique"
  category = "ID_CATEGORIE_VALIDE"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://jour-marche-api.onrender.com/api/shops" `
  -Method POST `
  -Headers $headers `
  -Body $body `
  -UseBasicParsing
```

---

## Checklist de débogage

- [ ] L'utilisateur est connecté (token JWT présent)
- [ ] Le token n'est pas expiré
- [ ] Les catégories sont chargées et un ID valide est utilisé
- [ ] Les champs requis (`name`, `category`) sont fournis
- [ ] Le backend est accessible (`https://jour-marche-api.onrender.com`)
- [ ] Les logs de la console montrent les données envoyées
- [ ] Le SDK Google Sign-In est chargé (plus d'avertissement GSI)

---

## Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de l'API backend (optionnel en dev grâce au proxy)
VITE_API_URL=https://jour-marche-api.onrender.com

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com

# Mode de l'application
VITE_APP_MODE=development

# Utiliser les données mockées (false pour utiliser l'API réelle)
VITE_USE_MOCK_DATA=false
```

Redémarrez le serveur dev après modification du `.env` :

```bash
npm run dev
```
