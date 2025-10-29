# 🧪 Test Rapide : Localisation GPS

## 🎯 Objectif
Vérifier que la **vraie localisation GPS** fonctionne sur l'émulateur.

---

## ⚡ Test en 3 Minutes

### Étape 1 : Définir la Position GPS (30 secondes)

#### Android
```bash
# Lancer l'émulateur (si pas déjà fait)
npm run android

# Ouvrir un nouveau terminal et exécuter :
./set-gps-location.sh
# Sélectionner : 1 (Nice)
```

#### iOS
```bash
# Lancer l'émulateur (si pas déjà fait)
npm run ios

# Dans le Simulator :
# Debug → Location → Custom Location...
# Entrer : 43.7102, 7.2620
```

### Étape 2 : Tester dans l'App (1 minute)
1. **Ouvrir l'app** Vaseline Smart Refill
2. **Se connecter** (ou créer un compte)
3. **Aller sur "Bornes de Recharge"** (icône carte)
4. **Autoriser la localisation** quand demandé

### Étape 3 : Vérifier le Résultat (30 secondes)

#### ✅ Succès attendu
- Logs dans Metro :
  ```
  📍 Demande de localisation GPS...
  🖥️  Mode: Émulateur
  ✅ Permission accordée - récupération de la position GPS...
  ✅ Position GPS obtenue: 43.7102, 7.2620
  ```
- Carte centrée sur **Nice, France**
- **Point bleu** (votre position) visible sur la carte
- **5 bornes de recharge** autour de Nice visibles

#### ❌ Si erreur
- Message : "Localisation GPS indisponible - utilisation de Nice"
- Logs dans Metro :
  ```
  ⚠️ Erreur de localisation: [message]
  📍 Utilisation de Nice comme position par défaut
  ```
- **Solution** : Vérifier que la position GPS est définie (voir Étape 1)

---

## 🔍 Vérifications Détaillées

### 1. Vérifier les Logs Metro
Dans le terminal Metro Bundler, chercher :
```
📍 Demande de localisation GPS...
```

Si vous voyez :
- ✅ `✅ Position GPS obtenue: 43.7102, 7.2620` → **OK**
- ⚠️ `⚠️ Permission de localisation refusée` → Réessayer et autoriser
- ⚠️ `⚠️ Erreur de localisation: Timeout` → Redéfinir la position GPS

### 2. Vérifier la Carte
- [ ] Carte centrée sur Nice (Place Masséna visible)
- [ ] Point bleu (user location) visible
- [ ] 5 marqueurs rouges (bornes de recharge) visibles
- [ ] Bouton "Générer mon QR Code" visible en bas

### 3. Tester les Marqueurs
- Cliquer sur un marqueur (ex: "Borne Eco-Refill - Place Masséna")
- Callout doit afficher :
  - Nom de la borne
  - "Appuyez pour générer votre QR Code"
  - Nombre de produits sélectionnés

---

## 🚨 Troubleshooting Rapide

### Problème : Position GPS non définie
```bash
# Android - Redéfinir la position
adb emu geo fix 7.2620 43.7102

# iOS - Redéfinir dans Simulator
# Debug → Location → Custom Location... → 43.7102, 7.2620
```

### Problème : Permission refusée
**Android** :
1. Désinstaller l'app : longue pression → Désinstaller
2. Relancer : `npm run android`
3. Autoriser la localisation

**iOS** :
1. Settings → Privacy → Location Services
2. Activer pour l'app

### Problème : Timeout
Augmenter le timeout dans `RefillMapScreen.js` :
```javascript
const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    timeout: 20000, // 20 secondes au lieu de 10
});
```

### Problème : Carte vide
```bash
# Redémarrer avec cache nettoyé
npm start -- --reset-cache
```

---

## 📱 Test sur Appareil Physique

### Prérequis
- Appareil iOS/Android avec GPS activé
- App installée avec `expo` ou build

### Procédure
1. **Activer le GPS** sur l'appareil
2. **Ouvrir l'app** Vaseline Smart Refill
3. **Aller sur "Bornes de Recharge"**
4. **Autoriser la localisation**
5. **Vérifier** : carte centrée sur votre position réelle

### ✅ Succès attendu
- Logs : `✅ Position GPS obtenue: [votre latitude], [votre longitude]`
- Carte centrée sur **votre position réelle**
- Point bleu à votre emplacement
- Bornes de recharge autour de Nice (même si vous êtes ailleurs)

**Note** : Les bornes sont mockées autour de Nice. Sur un vrai projet, elles seraient chargées depuis une API en fonction de votre position.

---

## 🎯 Résultat Final

Si tout fonctionne :
- ✅ GPS réel utilisé sur émulateur
- ✅ GPS réel utilisé sur appareil physique
- ✅ Fallback sur Nice si GPS échoue
- ✅ Logs détaillés pour debug
- ✅ UX fluide avec loader et messages d'erreur

---

## 📊 Checklist de Test

- [ ] Position GPS définie sur l'émulateur (Nice)
- [ ] App lancée et connectée
- [ ] Écran "Bornes de Recharge" ouvert
- [ ] Permission de localisation autorisée
- [ ] Logs Metro affichent `✅ Position GPS obtenue: 43.7102, 7.2620`
- [ ] Carte centrée sur Nice avec point bleu
- [ ] 5 bornes de recharge visibles
- [ ] Clique sur marqueur → Callout s'affiche
- [ ] Bouton "Générer mon QR Code" fonctionne

---

**✅ Test effectué** : ☐ Oui / ☐ Non  
**📅 Date** : ___________  
**📍 Position GPS** : Émulateur (Nice) / Appareil Physique  
**🎯 Résultat** : ☐ Succès / ☐ Échec  
**📝 Notes** : ___________
