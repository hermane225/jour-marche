# 🔐 Guide Admin - Jour Marché

## 📍 Route d'accès Admin

### **Page d'accueil Admin**
```
http://localhost:5174/admin-login-guide
```

### **Tableau de bord Admin (après connexion)**
```
http://localhost:5174/admin/dashboard
```

### **Toutes les routes Admin**
```
/admin/dashboard        → Tableau de bord principal
/admin/sellers          → Gestion des vendeurs
/admin/orders           → Gestion des commandes
/admin/users            → Gestion des utilisateurs
/admin/reports          → Rapports et statistiques
```

---

## 🔓 Identifiants de Connexion Admin

### **Email:**
```
admin@jourmarche.com
```

### **Mot de passe:**
```
admin123
```

---

## 📝 Étapes pour Se Connecter en tant qu'Admin

### **Méthode 1: Accès direct au guide admin**
1. Allez à `/admin-login-guide`
2. Vous verrez les identifiants affichés
3. Cliquez sur "Aller à la page de connexion"

### **Méthode 2: Connexion classique**
1. Allez à `/login`
2. Entrez: `admin@jourmarche.com`
3. Entrez le mot de passe: `admin123`
4. Cliquez sur "Se connecter"
5. Vous serez redirigé vers `/admin/dashboard`

---

## 🎯 Fonctionnalités du Tableau de Bord Admin

### **1. Tableau de Bord (Dashboard)**
- 📊 Statistiques en temps réel
- 💰 Revenus totaux
- 📦 Nombre de commandes
- 🏪 Nombre de vendeurs
- 👥 Nombre d'utilisateurs
- 📈 Commandes récentes
- ⭐ Meilleurs vendeurs
- ⚡ Actions rapides

### **2. Gestion des Vendeurs**
- 📋 Liste complète des vendeurs
- 🏪 Nom de la boutique
- 👤 Propriétaire
- ✅ Statut (Actif/Suspendu)
- 📦 Nombre de produits
- ⭐ Évaluation
- 🔧 Actions: Voir, Éditer, Supprimer

### **3. Gestion des Commandes**
- 🔍 Recherche et filtrage
- 📦 ID de commande
- 👤 Nom du client
- 📅 Date de commande
- 💵 Montant total
- 📊 Nombre d'articles
- 🚚 Statut: Livré, En cours, Attente
- 🔧 Actions: Détails, Éditer

### **4. Gestion des Utilisateurs**
- 👥 Liste de tous les utilisateurs
- 📧 Email
- 🏷️ Rôle (Buyer, Seller, Admin)
- ✅ Statut (Actif, Inactif)
- 📅 Date d'inscription
- 🔧 Actions: Voir, Éditer, Supprimer

### **5. Rapports & Statistiques**
- 📊 Revenus mensuels
- 📈 Commandes par jour
- 🍎 Distribution par catégorie
- ⭐ Métriques clés:
  - Rating moyen
  - Taux de livraison
  - Satisfaction clients
  - Délai moyen

---

## 🔐 Sécurité & Notes Importantes

### ⚠️ **Ceci est une démonstration**

Ces identifiants admin sont uniquement pour tester l'application. En production, vous DEVEZ:

✅ **Implémenter:**
- [ ] Authentification OAuth / SSO
- [ ] Authentification à deux facteurs (2FA)
- [ ] Mots de passe chiffrés avec bcrypt
- [ ] JWT tokens avec expiration
- [ ] Logs de sécurité détaillés
- [ ] Audit trail complet
- [ ] HTTPS obligatoire
- [ ] CORS configuré
- [ ] Rate limiting
- [ ] Protection CSRF

### 📊 **Données de Démonstration**

Toutes les données affichées sont simulées. En production:
- Les données proviendraient d'une vraie base de données
- Les statistiques seraient calculées en temps réel
- Les actions seraient persistantes

---

## 🛠️ Comment Modifier les Identifiants Admin

### **Pour changer l'email ou le mot de passe:**

1. Ouvrez: `src/context/AuthContext.tsx`
2. Trouvez le tableau `mockUsers`
3. Modifiez l'utilisateur avec `role: 'admin'`:

```typescript
{
  id: '3',
  email: 'admin@jourmarche.com',  // ← Changer ici
  name: 'Admin Jour Marché',
  role: 'admin',
  phone: '+225 07 00 00 00',
  createdAt: new Date('2023-01-01'),
},
```

4. Le mot de passe est vérifié dans la fonction `login()` de AuthContext

---

## 🗺️ Navigation Admin

### **Depuis le header de l'application:**
- Une fois connecté en admin, vous verrez le layout admin
- Cliquez sur le logo "Jour Marché" pour revenir au dashboard
- Cliquez sur "Déconnexion" pour vous déconnecter

### **Via le Sidebar:**
- 📊 Dashboard → Statistiques
- 📦 Commandes → Gestion des commandes
- 🏪 Vendeurs → Gestion des vendeurs
- 👥 Utilisateurs → Gestion des utilisateurs
- 📈 Rapports → Statistiques détaillées

---

## 🐛 Dépannage

### **"Je n'arrive pas à accéder à /admin/dashboard"**
- Assurez-vous d'être connecté en tant qu'admin
- Vérifiez que votre email est `admin@jourmarche.com`
- Vérifiez que le mot de passe est `admin123`
- Rafraîchissez la page (Ctrl+F5)

### **"Le layout admin ne s'affiche pas"**
- Vérifiez que vous êtes bien connecté (vérifiez localStorage)
- Vérifiez que le rôle est `admin`
- Consultez la console (F12) pour les erreurs

### **"Les données ne se chargent pas"**
- Les données sont simulées, elles devraient s'afficher immédiatement
- Vérifiez votre connexion internet
- Rafraîchissez la page

---

## 📞 Support & Questions

Pour configurer une vraie authentification ou une base de données:
- Intégrez avec Firebase, Auth0, ou un serveur personnalisé
- Configurez une API REST
- Utilisez une vraie base de données (MongoDB, PostgreSQL, etc.)

---

**Créé pour Jour Marché - Janvier 2026** 🚀
