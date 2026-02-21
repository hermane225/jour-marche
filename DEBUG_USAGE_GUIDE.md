# 🐛 Guide d'utilisation du système de débogage

## Vue d'ensemble

J'ai ajouté un système de débogage complet pour tracer l'erreur 500 sur la création de boutiques. Ce système affiche des logs détaillés dans la console du navigateur et propose un panneau visuel de diagnostic.

---

## 🎯 Fonctionnalités ajoutées

### 1. **Logs détaillés dans la console**

Tous les fichiers importants ont maintenant des logs de débogage :

#### **Service API Client** (`src/services/api/client.ts`)
- 🌐 Log de chaque requête HTTP (méthode, URL, headers, body)
- 📥 Log de chaque réponse (statut, message)
- ❌ Log détaillé de chaque erreur (message, code, détails JSON)

#### **Service Shops** (`src/services/api/shops.service.ts`)
- 📤 Log du payload de création de boutique
- ✅ Log de la réponse de l'API
- 🔑 Vérification de la présence du token JWT

#### **Composant CreateShop** (`src/pages/seller/CreateShop/CreateShop.tsx`)
- 🏪 Log des données du formulaire avant soumission
- 🎯 Log du payload final envoyé
- 💡 Messages d'erreur enrichis avec suggestions

#### **Context Shop** (`src/context/ShopContext.tsx`)
- 🏪 Log au début et à la fin de la création de boutique
- ❌ Log des erreurs avec contexte

---

## 📋 Comment utiliser le débogage

### **Étape 1 : Activer le panneau de débogage**

Appuyez sur **`Ctrl + Shift + D`** dans votre navigateur pour afficher le panneau de débogage visuel.

Le panneau affiche :
- ✅/❌ Statut d'authentification
- 🔑 Présence du token JWT
- 👤 Rôle de l'utilisateur
- 🌐 URL de l'API backend
- 🏗️ Environnement (dev/prod)
- 📋 Aperçu du token

### **Étape 2 : Ouvrir la console du navigateur**

1. Appuyez sur **`F12`** (ou clic droit > Inspecter)
2. Allez dans l'onglet **Console**
3. Assurez-vous que tous les niveaux de logs sont visibles (Info, Warnings, Errors)

### **Étape 3 : Essayer de créer une boutique**

1. Connectez-vous en tant que vendeur
2. Allez dans le formulaire de création de boutique
3. Remplissez tous les champs
4. Soumettez le formulaire

### **Étape 4 : Analyser les logs**

Dans la console, vous verrez une séquence de logs comme ceci :

```
🏪 [CREATE SHOP] Soumission formulaire
├─ Données formulaire: { name: "...", category: "...", ... }
├─ Payload final: { ... }
└─ Token présent: true/false

📤 [SHOP SERVICE] Création de boutique
├─ Payload original: { ... }
├─ Body envoyé à l'API: { ... }
└─ Token JWT: ✅ Présent / ❌ Absent

🌐 [API CLIENT] POST /api/shops
├─ URL complète: https://...
├─ Headers: { Authorization: "Bearer ...", ... }
└─ Body: { ... }

📥 [API CLIENT] Statut 500: Internal Server Error

❌ [API CLIENT] Erreur 500
├─ Message: "..."
├─ Code: "..."
├─ Détails: { ... }
└─ Réponse complète: { ... }

❌ [SHOP SERVICE] Échec création: ...
❌ [SHOP CONTEXT] Erreur création boutique: ...
❌ [CREATE SHOP] Erreur finale: ...
```

---

## 🔍 Diagnostiquer l'erreur 500

### **Cas 1 : Token JWT absent**

**Symptôme :**
```
Token JWT: ❌ Absent
```

**Solution :** L'utilisateur n'est pas connecté ou le token a expiré.
```typescript
// Se reconnecter
await authService.login('email@example.com', 'password');
```

---

### **Cas 2 : Catégorie invalide**

**Symptôme :**
```
Message: "Category not found" ou "Invalid category"
```

**Solution :** L'ID de catégorie n'existe pas dans la base de données.

```typescript
// Récupérer les catégories valides
import { categoriesService } from './services/api/categories.service';
const categories = await categoriesService.getCategories();
console.log('Catégories disponibles:', categories);

// Utiliser un ID valide
const payload = {
  name: 'Ma Boutique',
  category: categories[0].id, // ✅ ID valide
};
```

---

### **Cas 3 : Données de validation incorrectes**

**Symptôme :**
```
Détails: {
  "name": ["Name is required"],
  "category": ["Category must be a valid ObjectId"]
}
```

**Solution :** Vérifier que tous les champs requis sont présents et corrects.

Champs **obligatoires** :
- `name` : string (min 2 caractères)
- `category` : string (MongoID valide)

Champs **optionnels** mais validés :
- `phone` : format de téléphone valide
- `address.city` : string
- `deliveryOptions` : array de strings valides
- `deliveryFee` : number >= 0
- `minimumOrder` : number >= 0

---

### **Cas 4 : Erreur serveur backend**

**Symptôme :**
```
Statut 500: Internal Server Error
Réponse complète: "Database connection failed" ou erreur serveur
```

**Solution :** Problème côté backend (base de données, code serveur, etc.)

1. Vérifier que l'API est accessible :
```powershell
Invoke-WebRequest -Uri "https://jour-marche-api.onrender.com/api/shops" -UseBasicParsing
```

2. Contacter l'équipe backend avec les logs d'erreur
3. Vérifier les logs du serveur sur Render.com

---

## 🎨 Panneau de débogage visuel

Le panneau de débogage affiche un résumé visuel de l'état de l'application :

### **Mode mini** (par défaut)
Un badge flottant en bas à droite :
- 🟢 **Vert** = Connecté (token présent)
- 🔴 **Rouge** = Non connecté (pas de token)

### **Mode étendu** (clic sur le badge)
Affiche toutes les informations :
- Authentification
- Token JWT
- Rôle utilisateur
- URL de l'API
- Environnement
- Aperçu du token

### **Bouton "Copier les détails"**
Affiche toutes les informations dans la console pour un diagnostic complet.

---

## 💡 Conseils de débogage

### 1. **Toujours commencer par vérifier le token**
```typescript
console.log('Token:', localStorage.getItem('jour_marche_token'));
```

### 2. **Vérifier le rôle de l'utilisateur**
Seuls les utilisateurs avec le rôle `seller` peuvent créer des boutiques.

### 3. **Vérifier l'ID de catégorie**
Copier l'ID depuis la console après avoir chargé les catégories :
```typescript
const categories = await categoriesService.getCategories();
console.table(categories); // Affiche un tableau avec les IDs
```

### 4. **Tester l'API directement**
Utilisez PowerShell pour tester l'API :
```powershell
$token = "VOTRE_TOKEN_JWT"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$body = @{
    name = "Test Boutique"
    category = "ID_CATEGORIE_VALIDE"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://jour-marche-api.onrender.com/api/shops" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -UseBasicParsing
```

### 5. **Vérifier la configuration**
```typescript
import { config } from './config';
console.log('Configuration:', config);
```

---

## 🚀 Prochaines étapes

Une fois l'erreur identifiée dans les logs :

1. **Si c'est un problème d'authentification :**
   - Vérifier que l'utilisateur est connecté
   - Vérifier que le rôle est `seller`
   - Renouveler le token si expiré

2. **Si c'est un problème de données :**
   - Vérifier les champs obligatoires
   - Utiliser un ID de catégorie valide
   - Valider le format des données

3. **Si c'est un problème backend :**
   - Partager les logs avec l'équipe backend
   - Vérifier l'état du serveur
   - Vérifier la connectivité réseau

---

## 📝 Exemple de session de débogage réussie

```
1. Utilisateur ouvre le formulaire de création de boutique
2. Appuie sur Ctrl+Shift+D → Panneau affiche "✅ Connecté"
3. Remplit le formulaire et soumet
4. Ouvre F12 pour voir les logs
5. Trouve dans les logs :
   ❌ [API CLIENT] Erreur 500
   Message: "Category 123abc does not exist"
   
6. Récupère les catégories valides :
   const categories = await categoriesService.getCategories();
   → Trouve l'ID valide : "507f1f77bcf86cd799439011"
   
7. Modifie le formulaire avec l'ID valide
8. Resoummet
9. ✅ Boutique créée avec succès !
```

---

## 🔧 Désactiver le débogage

Pour désactiver les logs de débogage en production, commentez les lignes `console.log` dans les fichiers :
- `src/services/api/client.ts`
- `src/services/api/shops.service.ts`
- `src/context/ShopContext.tsx`
- `src/pages/seller/CreateShop/CreateShop.tsx`

Ou créez une fonction `isDevelopment()` pour activer les logs uniquement en dev :
```typescript
const debug = config.isDevelopment ? console.log : () => {};
debug('Message de débogage');
```

---

## 📞 Support

Si l'erreur persiste après avoir suivi ce guide :
1. Copiez tous les logs de la console
2. Prenez une capture d'écran du panneau de débogage
3. Notez les étapes exactes pour reproduire l'erreur
4. Contactez l'équipe de développement avec ces informations
