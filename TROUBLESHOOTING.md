# 🔧 Guide de Résolution des Problèmes

## Problèmes Courants et Solutions

### ❌ Erreur: "Cannot find module 'react-native-web'"

**Problème**: Le support web n'est pas installé par défaut.

**Solution**:
```bash
npm install react-native-web react-dom react-native-worklets --legacy-peer-deps
```

---

### ❌ Erreur: "ERESOLVE unable to resolve dependency tree"

**Problème**: Conflits de versions entre les dépendances React.

**Solution**: Utiliser `--legacy-peer-deps` pour forcer l'installation
```bash
npm install [package-name] --legacy-peer-deps
```

---

### ❌ Erreur: "Metro bundler crashed" ou "Module not found"

**Problème**: Cache Metro corrompu ou dépendances manquantes.

**Solution 1 - Clear cache**:
```bash
npm start -- --clear
```

**Solution 2 - Réinstaller**:
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm start
```

---

### ❌ QR Code ne se scanne pas

**Problème**: Pas sur le même réseau WiFi ou firewall bloque.

**Solution**:
1. Vérifier que téléphone et ordinateur sont sur le même WiFi
2. Désactiver temporairement le VPN
3. Utiliser le mode tunnel:
```bash
npm start -- --tunnel
```

---

### ❌ App crash au démarrage sur iOS/Android

**Problème**: Dépendances natives non compilées.

**Solution iOS**:
```bash
cd ios
pod install
cd ..
npm run ios
```

**Solution Android**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

### ❌ "Port 8081 is already in use"

**Problème**: Une autre instance d'Expo tourne déjà.

**Solution 1 - Utiliser le port actif**:
Ouvrez simplement http://localhost:8081

**Solution 2 - Kill le processus**:
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

**Solution 3 - Utiliser un autre port**:
```bash
npm start -- --port 8082
```

---

### ❌ Animations ne fonctionnent pas sur Web

**Problème**: react-native-reanimated ne supporte pas complètement le web.

**Solution**: Les animations swipe fonctionnent mieux sur iOS/Android. Sur web, utiliser les boutons ❤️ et ✕ directement.

---

### ❌ QR Code ne s'affiche pas

**Problème**: Librairie react-native-svg manquante.

**Solution**:
```bash
npm install react-native-svg react-native-qrcode-svg --legacy-peer-deps
```

---

### ❌ AsyncStorage erreurs sur Web

**Problème**: AsyncStorage utilise le LocalStorage sur web qui peut être désactivé.

**Solution**: Vérifier les paramètres du navigateur et activer les cookies/stockage.

---

### ❌ "Unsupported engine" warnings

**Problème**: Version Node.js légèrement ancienne (20.19.3 vs 20.19.4).

**Impact**: Aucun, ces warnings peuvent être ignorés. L'app fonctionne parfaitement.

**Solution (optionnelle)**:
```bash
# Mettre à jour Node.js
nvm install 20.19.4
nvm use 20.19.4
```

---

### ❌ Expo Go montre "Network error"

**Problème**: Expo Go ne peut pas se connecter au serveur.

**Solution**:
1. Redémarrer le serveur Metro:
```bash
# Ctrl+C puis
npm start
```

2. Rafraîchir dans Expo Go (secouer le téléphone)

3. Vérifier l'URL affichée correspond à votre IP local

---

### ❌ Build production échoue

**Problème**: Configuration Expo pas complète pour build.

**Solution**:
1. Créer un compte Expo:
```bash
npx expo login
```

2. Configurer app.json:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.votreentreprise.ecorefill"
    },
    "android": {
      "package": "com.votreentreprise.ecorefill"
    }
  }
}
```

3. Build:
```bash
npx expo build:ios
npx expo build:android
```

---

### ❌ Images/Icons ne s'affichent pas

**Problème**: Ce projet utilise des emojis, pas d'images.

**Solution**: Aucune action nécessaire. Si vous ajoutez des vraies images, les placer dans `/assets`.

---

### ❌ Cannot scroll on web / Scrolling not working

**Problème**: ScrollView ne fonctionne pas correctement sur React Native Web.

**Cause**: React Native Web nécessite des styles spécifiques pour le scrolling.

**Solution Appliquée**:

1. **Ajout de `height: '100%'`** au container du ScrollView
2. **Ajout de `flexGrow: 1`** au contentContainerStyle
3. **Activation explicite** de `scrollEnabled={true}`
4. **Affichage de l'indicateur** avec `showsVerticalScrollIndicator={true}`

**Exemple de code**:
```javascript
// ✅ Configuration correcte pour le web
<ScrollView 
  style={styles.container} 
  contentContainerStyle={styles.content}
  showsVerticalScrollIndicator={true}
  scrollEnabled={true}
>
  {/* Votre contenu */}
</ScrollView>

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',  // Important pour web!
  },
  content: {
    flexGrow: 1,     // Permet au contenu de dépasser
    padding: 20,
  },
});
```

**Écrans mis à jour**:
- ✅ WelcomeScreen
- ✅ QuestionnaireScreen
- ✅ QRCodeScreen
- ✅ DashboardScreen

---

## 🛠️ Commandes de Diagnostic

### Vérifier l'installation
```bash
# Version Node
node --version  # Devrait être 20.x

# Version npm
npm --version   # Devrait être 10.x

# Vérifier Expo
npx expo --version

# Lister les dépendances installées
npm list --depth=0
```

### Nettoyer complètement
```bash
# Supprimer tous les caches
rm -rf node_modules
rm -rf .expo
rm -rf web-build
rm package-lock.json
npm cache clean --force

# Réinstaller
npm install
```

### Logs détaillés
```bash
# Expo avec logs verbeux
npm start -- --verbose

# Build avec logs
npm run ios -- --verbose
npm run android -- --verbose
```

---

## 📱 Tester sur Différentes Plateformes

### iOS (Mac uniquement)
```bash
# Installer Xcode depuis App Store
# Installer Command Line Tools
xcode-select --install

# Lancer simulateur
npm run ios
```

### Android
```bash
# Installer Android Studio
# Configurer ANDROID_HOME dans ~/.zshrc:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Lancer émulateur
npm run android
```

### Web
```bash
# Installer dépendances web
npm install react-native-web react-dom react-native-worklets --legacy-peer-deps

# Lancer
npm run web

# Ouvrir dans navigateur
open http://localhost:8081
```

### Appareil Physique (Recommandé)
```bash
# Installer Expo Go sur votre téléphone
# Lancer le serveur
npm start

# Scanner le QR code
# iOS: Appareil Photo
# Android: Expo Go app
```

---

## 🆘 Support Supplémentaire

### Documentation Officielle
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

### Communauté
- [Expo Forums](https://forums.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
- [Discord Expo](https://chat.expo.dev/)

### Logs et Debug
Si le problème persiste:
1. Copiez les logs d'erreur complets
2. Vérifiez les versions des dépendances
3. Créez un Issue GitHub avec:
   - Description du problème
   - Logs complets
   - Versions (Node, npm, Expo)
   - Plateforme (iOS/Android/Web)

---

## ✅ Checklist de Vérification

Avant de demander de l'aide, vérifiez:

- [ ] Node.js installé (v20.x)
- [ ] npm installé (v10.x)
- [ ] `npm install` exécuté sans erreurs
- [ ] Même réseau WiFi (téléphone + ordinateur)
- [ ] Expo Go installé sur le téléphone
- [ ] Port 8081 disponible
- [ ] Firewall/VPN désactivé
- [ ] Cache Metro nettoyé (`npm start -- --clear`)

---

**Si aucune solution ne fonctionne**, n'hésitez pas à :
1. Consulter les logs complets (`npm start -- --verbose`)
2. Chercher l'erreur exacte sur Google/Stack Overflow
3. Demander de l'aide sur Discord Expo

**Bonne chance ! 🍀**

---

### ⚠️ Warning: "shadow* style props are deprecated. Use boxShadow"

**Problème**: React Native Web utilise `boxShadow` au lieu de `shadowColor`, `shadowOffset`, etc.

**Solution**: Ce warning a été corrigé dans le code. Les anciennes props iOS/Android:
```javascript
// ❌ Ancienne syntaxe (iOS/Android)
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 10,
```

Ont été remplacées par la syntaxe web:
```javascript
// ✅ Nouvelle syntaxe (web compatible)
boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
```

**Note**: `elevation` est conservé pour Android.

---

### ⚠️ Warning: "props.pointerEvents is deprecated. Use style.pointerEvents"

**Problème**: Ce warning provient de React Navigation (bibliothèque externe).

**Solution**: 
- Ce n'est pas un problème dans notre code
- La bibliothèque React Navigation sera mise à jour dans les futures versions
- Vous pouvez ignorer ce warning en toute sécurité
