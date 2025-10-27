# 📍 Guide Localisation GPS Réelle

## 🎯 Objectif
Ce guide explique comment utiliser la **vraie localisation GPS** sur l'émulateur Android et iOS, et comment configurer une position personnalisée (Nice, Paris, etc.).

---

## ✅ Modifications Apportées

### Avant
- ❌ Détection d'émulateur qui bloquait le GPS
- ❌ Fallback automatique sur Nice sans essayer le GPS
- ❌ Impossible d'utiliser la position définie dans l'émulateur

### Après
- ✅ Demande **toujours** la permission de localisation GPS
- ✅ Utilise la position GPS de l'émulateur/appareil
- ✅ Fallback sur Nice **uniquement** si GPS échoue
- ✅ Logs détaillés pour débugger la localisation

---

## 🖥️ Configurer la Localisation sur l'Émulateur Android

### Méthode 1 : Interface Graphique (Plus Simple)
1. **Lancer l'émulateur Android** (via Android Studio ou `npm run android`)
2. **Ouvrir les Extended Controls** :
   - Cliquer sur les `...` (3 points) dans le panneau latéral de l'émulateur
   - OU appuyer sur `Cmd + Shift + A` (macOS) / `Ctrl + Shift + A` (Windows/Linux)
3. **Aller dans l'onglet "Location"**
4. **Entrer les coordonnées GPS** :
   - **Nice, France** : `43.7102, 7.2620`
   - **Paris, France** : `48.8566, 2.3522`
   - **Marseille, France** : `43.2965, 5.3698`
5. **Cliquer sur "Send"** pour définir la position

### Méthode 2 : Ligne de Commande (Plus Rapide)
```bash
# Nice, France
adb emu geo fix 7.2620 43.7102

# Paris, France
adb emu geo fix 2.3522 48.8566

# Marseille, France
adb emu geo fix 5.3698 43.2965
```

**⚠️ Note**: Le format est `longitude latitude` (inversé !).

### Méthode 3 : Script Automatique
Créer un fichier `set-gps-nice.sh` :
```bash
#!/bin/bash
echo "📍 Configuration GPS: Nice, France (43.7102, 7.2620)"
adb emu geo fix 7.2620 43.7102
echo "✅ Position GPS définie sur Nice"
```

Rendre exécutable et lancer :
```bash
chmod +x set-gps-nice.sh
./set-gps-nice.sh
```

---

## 📱 Configurer la Localisation sur l'Émulateur iOS

### Méthode 1 : Xcode Simulator
1. **Lancer l'émulateur iOS** (via Xcode ou `npm run ios`)
2. **Ouvrir le menu "Debug"** dans le Simulator
3. **Aller dans "Location" → "Custom Location..."**
4. **Entrer les coordonnées GPS** :
   - **Latitude** : `43.7102` (Nice)
   - **Longitude** : `7.2620`
5. **Cliquer sur "OK"**

### Méthode 2 : Positions Prédéfinies
Dans le Simulator, menu **Debug → Location** :
- ✅ `Apple` (Cupertino, USA)
- ✅ `City Bicycle Ride` (simulation de mouvement)
- ✅ `City Run` (simulation de course)
- ✅ `Freeway Drive` (simulation d'autoroute)

### Méthode 3 : Fichier GPX Personnalisé
Créer un fichier `nice-location.gpx` :
```xml
<?xml version="1.0"?>
<gpx version="1.1" creator="Xcode">
  <wpt lat="43.7102" lon="7.2620">
    <name>Nice, France</name>
  </wpt>
</gpx>
```

Charger dans Xcode : **Debug → Simulate Location → Add GPX File...**

---

## 🧪 Tester la Localisation

### 1. Vérifier les Permissions
Au premier lancement, l'app demandera :
```
"Vaseline Smart Refill" souhaite accéder à votre position
```
**✅ Cliquer sur "Autoriser"**

### 2. Vérifier les Logs Console
Dans Metro Bundler, vous verrez :
```
📍 Demande de localisation GPS...
🖥️  Mode: Émulateur
✅ Permission accordée - récupération de la position GPS...
✅ Position GPS obtenue: 43.7102, 7.2620
```

Si GPS échoue :
```
⚠️ Erreur de localisation: Timeout
📍 Utilisation de Nice comme position par défaut
```

### 3. Vérifier la Carte
- La carte doit être **centrée sur votre position GPS**
- Un **point bleu** (user location) doit apparaître
- Les **bornes de recharge** autour de Nice doivent être visibles

---

## 🚨 Troubleshooting

### Problème : "Permission de localisation refusée"
**Solution** :
- **Android** : Réinstaller l'app avec `npm run android` et autoriser les permissions
- **iOS** : Aller dans **Settings → Privacy → Location Services** et activer pour l'app

### Problème : Position GPS toujours sur San Francisco
**Cause** : L'émulateur Android utilise San Francisco par défaut.

**Solution** :
```bash
# Forcer la position sur Nice
adb emu geo fix 7.2620 43.7102
```

### Problème : GPS timeout
**Cause** : Timeout de 10 secondes dépassé.

**Solution** :
1. Vérifier que la position GPS est définie dans l'émulateur
2. Redémarrer l'app avec `r` dans Metro
3. Si le problème persiste, augmenter le timeout dans `RefillMapScreen.js` :
```javascript
const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    timeout: 20000, // 20 secondes
});
```

### Problème : Carte vide/noire
**Cause** : Problème d'API Google Maps.

**Solution** :
1. Vérifier que `react-native-maps` est installé
2. Sur Android, vérifier la clé Google Maps API dans `app.json`
3. Relancer avec `npm start -- --reset-cache`

---

## 🌍 Positions GPS Utiles (France)

```javascript
// Nice (Côte d'Azur)
{ latitude: 43.7102, longitude: 7.2620 }

// Paris (Tour Eiffel)
{ latitude: 48.8584, longitude: 2.2945 }

// Marseille (Vieux Port)
{ latitude: 43.2965, longitude: 5.3698 }

// Lyon (Place Bellecour)
{ latitude: 45.7578, longitude: 4.8320 }

// Toulouse (Capitole)
{ latitude: 43.6047, longitude: 1.4442 }
```

---

## 📋 Commandes Rapides

### Android - Définir Position GPS
```bash
# Nice
adb emu geo fix 7.2620 43.7102

# Paris
adb emu geo fix 2.3522 48.8566

# Vérifier si adb est connecté
adb devices
```

### iOS - Définir Position GPS
Dans Xcode Simulator :
1. `Debug` → `Location` → `Custom Location...`
2. Entrer `43.7102, 7.2620`
3. OK

### Redémarrer l'App
```bash
# Dans Metro, appuyer sur 'r'
# OU relancer complètement
npm start -- --reset-cache
npm run android  # ou npm run ios
```

---

## 🎉 Résultat Attendu

Une fois la localisation GPS configurée :
1. ✅ L'app demande la permission de localisation
2. ✅ La carte se centre sur la **vraie position GPS** (Nice, Paris, etc.)
3. ✅ Le **point bleu** (user location) apparaît à votre position
4. ✅ Les bornes de recharge autour de **Nice** sont visibles
5. ✅ Les logs console affichent la position GPS obtenue

---

## 📚 Ressources

- [Expo Location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)
- [Android Emulator GPS](https://developer.android.com/studio/run/emulator-console#geo)
- [iOS Simulator Location](https://developer.apple.com/documentation/xcode/simulating-location-changes-in-the-simulator)

---

**✅ Modification effectuée par** : GitHub Copilot  
**📅 Date** : 2025-01-XX  
**🎯 Status** : GPS Réel Activé
