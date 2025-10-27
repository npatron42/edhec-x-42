# 📷 Guide : Caméra sur Émulateur Android

**Date :** 24 Octobre 2025  
**Problème :** La caméra ne fonctionne pas correctement sur l'émulateur Android  
**Solution :** ✅ Implémentée

---

## 🔍 Problème

Les émulateurs Android ont des **limitations importantes** avec la caméra :
- ❌ Caméra virtuelle avec image statique ou animation basique
- ❌ Qualité d'image très faible
- ❌ Pas d'autofocus
- ❌ Latence importante
- ❌ Pas de vraie analyse possible (IA peau/cheveux)

**Impact :** L'analyse IA du visage ne peut pas fonctionner correctement avec la caméra virtuelle de l'émulateur.

---

## ✅ Solutions Implémentées

### 1. **Détection Automatique de l'Émulateur**

Le code détecte maintenant si l'app tourne sur un émulateur Android :

```javascript
const isEmulator = Platform.OS === 'android' && !Device.isDevice;
```

### 2. **Fallback vers la Galerie**

Sur émulateur Android, l'app **propose automatiquement d'utiliser la galerie** au lieu de la caméra :

```
⚠️ Émulateur Android détecté : la caméra virtuelle a des limitations.
Pour une meilleure expérience, utilisez la galerie ou testez sur un appareil réel.

[Bouton : Choisir une photo dans la galerie]

💡 Astuce : Sélectionnez un selfie bien éclairé avec votre visage centré
```

### 3. **Bouton Galerie sur Caméra Réelle**

Sur les **appareils Android réels**, les utilisateurs ont maintenant **deux options** :
- **Capturer** : Prendre une photo avec la caméra
- **Galerie** : Choisir une photo existante

---

## 🧪 Tests

### ✅ Émulateur Android
- ✅ Détection automatique
- ✅ Message informatif affiché
- ✅ Bouton galerie fonctionnel
- ✅ Permissions galerie demandées
- ✅ Photo sélectionnée → Analyse IA

### 📱 Appareil Android Réel (À Tester)
- [ ] Caméra fonctionnelle
- [ ] Bouton galerie accessible
- [ ] Analyse IA fonctionne
- [ ] Performance fluide

### 🍎 iOS Simulator (Déjà Géré)
- ✅ Message informatif
- ✅ Fallback galerie

### 🌐 Web (Déjà Géré)
- ✅ Message informatif
- ✅ Fallback galerie

---

## 🎯 Utilisation sur Émulateur

### Pour tester l'analyse IA sur émulateur :

1. **Préparez un selfie** sur votre ordinateur :
   - Visage bien centré
   - Éclairage uniforme
   - Bonne résolution (minimum 640x480)
   - Format JPEG ou PNG

2. **Copiez la photo dans l'émulateur** :
   ```bash
   # Méthode 1 : Via ADB
   adb -s emulator-5554 push ~/Downloads/selfie.jpg /sdcard/Pictures/
   
   # Méthode 2 : Drag & Drop (AVD Manager)
   # Glissez-déposez directement la photo sur l'émulateur
   ```

3. **Dans l'app** :
   - Lancez l'analyse IA
   - Cliquez sur "Choisir une photo dans la galerie"
   - Sélectionnez le selfie
   - L'analyse IA se lance automatiquement

---

## 🚀 Alternative : Tester sur Appareil Réel

Pour une **expérience complète**, testez sur un appareil Android réel :

### Via Expo Go (Recommandé)

1. **Installez Expo Go** sur votre téléphone Android
2. **Scannez le QR code** du terminal Expo
3. **Autorisez la caméra** quand demandé
4. **Testez l'analyse IA** en conditions réelles

### Via APK (Avancé)

```bash
# Build APK
eas build --platform android --profile preview

# Installez sur votre appareil
```

---

## 📊 Comparaison

| Plateforme | Caméra | Galerie | Analyse IA | Recommandation |
|------------|--------|---------|------------|----------------|
| **Émulateur Android** | ⚠️ Limitée | ✅ Oui | ✅ Via galerie | Galerie uniquement |
| **Appareil Android** | ✅ Complète | ✅ Oui | ✅ Temps réel | ✅ **Idéal** |
| **Simulateur iOS** | ❌ Non | ✅ Oui | ✅ Via galerie | Galerie uniquement |
| **iPhone réel** | ✅ Complète | ✅ Oui | ✅ Temps réel | ✅ **Idéal** |
| **Web** | ⚠️ Limitée | ✅ Oui | ✅ Via galerie | Galerie uniquement |

---

## 🔧 Configuration Émulateur (Optionnel)

Pour améliorer la caméra virtuelle de l'émulateur (pas recommandé pour cette app) :

1. **Ouvrez AVD Manager** (Android Studio)
2. **Éditez votre émulateur**
3. **Show Advanced Settings**
4. **Camera** :
   - Front : `Webcam0` (utilise votre webcam)
   - Back : `VirtualScene`
5. **Redémarrez l'émulateur**

⚠️ **Note :** Même avec ces réglages, la qualité reste inférieure à un appareil réel et l'analyse IA sera moins précise.

---

## 💡 Bonnes Pratiques

### Pour Développeurs

1. ✅ **Toujours tester sur appareil réel** pour les fonctionnalités caméra/IA
2. ✅ **Implémenter des fallbacks** (galerie) pour émulateurs
3. ✅ **Détecter automatiquement** le type d'appareil
4. ✅ **Messages clairs** pour guider l'utilisateur
5. ✅ **Options multiples** (caméra + galerie)

### Pour Utilisateurs

1. ✅ **Préférer les appareils réels** pour l'analyse IA
2. ✅ **Utiliser la galerie** sur émulateurs
3. ✅ **Photos bien éclairées** pour meilleurs résultats
4. ✅ **Visage centré** dans le cadre

---

## 📝 Code Modifié

### Fichier : `src/screens/CameraCaptureScreen.js`

**Changements :**

1. ✅ Ajout détection émulateur Android :
   ```javascript
   const isEmulator = Platform.OS === 'android' && !Device.isDevice;
   ```

2. ✅ Message spécifique pour émulateurs :
   ```javascript
   if (isEmulator) {
     message = "⚠️ Émulateur Android détecté : ...";
   }
   ```

3. ✅ Bouton galerie sur écran caméra :
   ```javascript
   <AppButton 
     label="Ou choisir dans la galerie" 
     onPress={openGalleryFallback} 
     variant="outline"
   />
   ```

---

## 🎯 Résultat

### ✅ Avant
- ❌ Caméra émulateur ne marchait pas
- ❌ Utilisateur bloqué
- ❌ Impossible de tester l'analyse IA

### ✅ Après
- ✅ Détection automatique émulateur
- ✅ Message clair et informatif
- ✅ Bouton galerie accessible
- ✅ Analyse IA fonctionne via galerie
- ✅ UX améliorée sur tous les appareils

---

## 📞 Support

Si la galerie ne fonctionne pas non plus sur l'émulateur :

1. **Vérifiez les permissions** :
   ```bash
   adb -s emulator-5554 shell pm list permissions
   ```

2. **Ajoutez une photo dans l'émulateur** :
   ```bash
   adb push selfie.jpg /sdcard/Pictures/
   ```

3. **Testez sur appareil réel** (solution recommandée)

---

**Challenge Unilever 2025 - Vaseline Smart Refill Station** 🚀  
**Caméra Émulateur : Problème Résolu** ✅
