# 🔄 Instructions de redémarrage

## Les corrections ont été appliquées ! Maintenant, vous devez redémarrer le serveur.

### Étapes pour redémarrer :

#### **Option 1 : Terminer le serveur actuel**

Dans le terminal où le serveur tourne (celui qui affiche `Local: http://localhost:5173/`) :

1. Appuyez sur **`Ctrl + C`** pour arrêter le serveur
2. Tapez **`Y`** si demandé
3. Relancez avec : **`npm run dev`**

#### **Option 2 : Forcer l'arrêt depuis PowerShell**

Si vous ne trouvez pas le terminal, exécutez :

```powershell
# Arrêter tous les processus Node
Get-Process node | Stop-Process -Force

# Puis relancer le serveur
npm run dev
```

---

## ✅ Ce qui a été corrigé :

### 1. **Avertissement Google Sign-In** ✅
- SDK Google ajouté dans `index.html`
- Gestion asynchrone du chargement dans Login/Signup
- **Résultat attendu :** Plus d'avertissement `[GSI_LOGGER]`

### 2. **Erreur 404 sur `/api/auth/logout`** ✅
- Déjà géré gracieusement dans le code
- Le token est nettoyé localement même si le serveur ne répond pas
- **Impact :** Aucun (ignoré automatiquement)

### 3. **Erreur 500 sur `/api/shops`** 🔍
- Système de débogage complet installé
- Appuyez sur **`Ctrl + Shift + D`** pour voir le panneau
- Ouvrez **F12** pour voir les logs détaillés
- **Résultat attendu :** Logs détaillés pour identifier la cause

---

## 🧪 Tester les corrections

### Après le redémarrage :

1. **Ouvrez l'application** : http://localhost:5173
2. **Appuyez sur F12** pour ouvrir la console
3. **Appuyez sur Ctrl+Shift+D** pour activer le panneau de débogage
4. **Allez sur la page de connexion**
5. **Vérifiez** : Le bouton Google devrait s'afficher sans erreur

### Pour l'erreur 500 sur les boutiques :

1. **Connectez-vous** en tant que vendeur
2. **Ouvrez F12** pour voir la console
3. **Essayez de créer une boutique**
4. **Examinez les logs** qui s'affichent :
   - 🔑 Token présent ?
   - 📤 Données envoyées ?
   - ❌ Message d'erreur détaillé ?

---

## 📋 Checklist post-redémarrage

- [ ] Serveur redémarré
- [ ] Page rechargée (Ctrl+F5 pour vider le cache)
- [ ] Console ouverte (F12)
- [ ] Plus d'avertissement `[GSI_LOGGER]` sur la page de connexion
- [ ] Panneau de débogage activable (Ctrl+Shift+D)
- [ ] Logs détaillés visibles lors de la création de boutique

---

## ❓ Si les erreurs persistent

### Vider le cache du navigateur :

1. **Appuyez sur Ctrl+Shift+Delete**
2. Cochez "Images et fichiers en cache"
3. Cliquez sur "Effacer les données"
4. **Rechargez avec Ctrl+F5**

### Vérifier la configuration :

```powershell
# Dans le terminal
npm run dev
```

Devrait afficher :
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🐛 En cas de problème

Si après redémarrage les erreurs persistent :

1. **Copiez tous les logs de la console** (F12)
2. **Prenez une capture d'écran** des erreurs
3. **Vérifiez les fichiers modifiés** :
   - [ ] `index.html` contient le script Google ?
   - [ ] `src/App.tsx` importe DebugPanel ?
   - [ ] `src/pages/auth/Login/Login.tsx` attend le chargement du SDK ?

4. **Consultez la documentation** :
   - [DEBUG_USAGE_GUIDE.md](DEBUG_USAGE_GUIDE.md) - Guide de débogage
   - [API_ERROR_GUIDE.md](API_ERROR_GUIDE.md) - Solutions aux erreurs API

---

## 🎯 Résultat attendu

Après redémarrage, vous devriez voir dans la console :

```
✅ Plus d'avertissement [GSI_LOGGER]
🐛 Panneau de débogage disponible (Ctrl+Shift+D)
📊 Logs détaillés lors de la création de boutique
```

Et dans l'interface :

```
✅ Bouton "Continuer avec Google" s'affiche correctement
🟢 Badge de débogage en bas à droite (si activé)
📱 Application fonctionne normalement
```
