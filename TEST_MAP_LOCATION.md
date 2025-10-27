# 🧪 Test Rapide - Localisation Nice sur Carte

## Objectif
Vérifier que la carte affiche **Nice** (et non San Francisco) sur émulateur.

---

## Test 1 : Émulateur Android (Rapide - 2 min)

### Étapes
1. **Lancez l'émulateur** :
   ```bash
   npm start
   # Appuyez sur 'a' pour Android
   ```

2. **Naviguez vers la carte** :
   - Lancez l'app
   - Complétez le questionnaire (ou naviguez directement si déjà fait)
   - Allez sur l'écran **"Bornes de Recharge"** (RefillMapScreen)

3. **Vérifiez visuellement** :
   - ✅ La carte doit afficher la **Côte d'Azur** (Nice, France)
   - ✅ 5 marqueurs roses/verts doivent apparaître
   - ✅ Les noms des bornes doivent être en français :
     - "Borne Eco-Refill - Place Masséna"
     - "Borne Eco-Refill - Gare Nice-Ville"
     - "Borne Eco-Refill - Nice Étoile"
     - "Borne Eco-Refill - Université"
     - "Borne Eco-Refill - Promenade des Anglais"

4. **Vérifiez la console** :
   ```bash
   # Vous devriez voir :
   📍 Émulateur détecté - utilisation de Nice comme position par défaut
   ```

5. **Testez les marqueurs** :
   - Cliquez sur un marqueur
   - ✅ Une bulle doit s'afficher avec le nom de la borne
   - ✅ "Appuyez pour générer votre QR Code"
   - ✅ Cliquez sur la bulle → Génération QR Code

---

## Test 2 : iOS Simulator (Rapide - 2 min)

### Étapes
```bash
npm start
# Appuyez sur 'i' pour iOS
```

Suivez les mêmes étapes que pour Android.

**Résultat attendu** : Identique à Android (Nice, 5 bornes, texte français).

---

## Test 3 : Appareil Physique (Optionnel)

### Prérequis
- iPhone ou Android physique
- Expo Go installé

### Étapes
1. Scannez le QR code Expo
2. Acceptez les permissions de localisation
3. Naviguez vers "Bornes de Recharge"

**Résultat attendu** :
- ✅ La carte doit afficher **votre position réelle** (GPS)
- ✅ Les 5 bornes de Nice sont toujours visibles (mais loin si vous n'êtes pas à Nice)
- ✅ Le bouton "Ma position" fonctionne

---

## ❌ Cas d'Échec Attendus

### Échec 1 : San Francisco s'affiche
**Cause** : `expo-device` ne détecte pas l'émulateur  
**Solution** : Vérifiez que `expo-device` est bien installé :
```bash
npm install expo-device
npm start -- --reset-cache
```

### Échec 2 : Carte vide
**Cause** : Problème de permissions ou de connectivité  
**Solution** : 
- Vérifiez votre connexion internet
- Redémarrez l'émulateur
- Vérifiez les logs console pour les erreurs

### Échec 3 : "Permission de localisation refusée"
**Cause** : Vous avez refusé les permissions sur émulateur (ne devrait pas arriver)  
**Solution** : 
- L'app devrait quand même afficher Nice (fallback)
- Si pas de carte, réinstallez l'app sur l'émulateur

---

## ✅ Checklist de Validation

- [ ] **Émulateur Android** : Affiche Nice + 5 bornes
- [ ] **iOS Simulator** : Affiche Nice + 5 bornes
- [ ] **Console** : Message "Émulateur détecté" visible
- [ ] **Marqueurs** : Cliquables + bulle d'info
- [ ] **QR Code** : Génération depuis la bulle fonctionne
- [ ] **Pas de crash** : Aucun crash, aucune erreur console
- [ ] **Appareil physique** (optionnel) : GPS réel fonctionne

---

## 📍 Coordonnées de Référence

Si vous voulez vérifier manuellement dans Google Maps :

**Nice (centre)** : `43.7102, 7.2620`

Collez ces coordonnées dans Google Maps pour voir la région affichée par défaut.

---

## 🐛 Debug Rapide

Si la carte ne s'affiche pas correctement, ajoutez des logs :

```javascript
// Dans RefillMapScreen.js, ligne ~65
console.log('🗺️ Region:', region);
console.log('📍 Location:', location);
console.log('🤖 Is Emulator:', !Device.isDevice);
```

---

**Temps de test** : 2-5 minutes  
**Critère de succès** : Nice visible sur émulateur  
**Status** : ✅ À tester
