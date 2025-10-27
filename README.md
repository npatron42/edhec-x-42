# 🌿 Eco-Refill AI Station

[![Version](https://img.shields.io/badge/version-1.0.2-green.svg)](./**Option 4 - Émulateur Android (nécessite Android Studio):**

⚠️ **Prérequis**: Android Studio + émulateur configuré
```bash
npm run android
```

---

### 🔧 Dépannage Rapide

**Problème: "Cannot scroll" sur le web**
- Assurez-vous d'utiliser un navigateur récent (Chrome, Firefox, Safari)
- Essayez de rafraîchir la page (Cmd/Ctrl + R)
- Vérifiez la console pour d'éventuelles erreurs

**Problème: "Unable to run simctl" sur iOS**
- Installez Xcode depuis l'App Store (gratuit)
- OU utilisez Expo Go sur votre iPhone (plus simple!)
- OU utilisez la version web: `npm run web`

**Problème: Port déjà utilisé**
```bash
# Le serveur Expo proposera automatiquement un autre port
# Appuyez sur 'Y' pour accepter
```

### 💡 Recommandation

**Pour tester rapidement sans installation:**
```bash
npm run web
```
Ouvrez http://localhost:8083 dans votre navigateur!

**Pour tester sur un vrai téléphone:**
1. Installez Expo Go
2. `npm start`
3. Scannez le QR code

---

### Installation sur votre téléphone

1. Installez l'application **Expo Go** depuis l'App Store (iOS) ou Google Play (Android)
2. Lancez `npm start` dans le terminal
3. Scannez le QR code affiché avec votre téléphone
   - iOS: Utilisez l'app Appareil Photo
   - Android: Utilisez l'app Expo Go directement

### Support Web (facultatif)atform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue.svg)](./README.md)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-blue.svg)](https://expo.dev)
[![Status](https://img.shields.io/badge/status-active-success.svg)](./README.md)

Application mobile React Native pour les bornes intelligentes de recharge Dove. Cette application permet aux utilisateurs de :
- Compléter un questionnaire personnalisé sur leurs besoins en soins
- Recevoir des recommandations de produits avec matching IA (style Tinder)
- Générer un QR code unique pour utiliser aux bornes de recharge
- Suivre leur impact environnemental (plastique économisé, CO₂ évité)

## 📱 Fonctionnalités

### 1. Questionnaire Personnalisé
- Analyse du type de peau/cheveux
- Évaluation de l'exposition environnementale
- Sélection des catégories de produits préférées
- Identification des besoins prioritaires
- Fréquence d'utilisation

### 2. Recommandations avec Gamification
- Système de swipe (style Tinder)
- Score de matching basé sur l'IA
- Visualisation des bénéfices produits
- Impact environnemental par produit
- Animation fluide et intuitive

### 3. Génération de QR Code
- Code unique et sécurisé
- Intégration Apple Wallet / Google Pay (à venir)
- Partage sur les réseaux sociaux
- Visualisation de l'impact mensuel prévu

### 4. Tableau de Bord
- Statistiques d'impact en temps réel
- Historique des recharges
- Objectifs et progression
- Système de badges et récompenses
- Profil utilisateur

## 🚀 Installation

### Prérequis
- Node.js >= 20.19.4
- npm ou yarn
- Expo CLI (installé automatiquement)

### Étapes d'installation

1. **Cloner le projet**
```bash
cd challenge_edhec
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer l'application**

**Option 1 - Sur votre téléphone (RECOMMANDÉ - pas besoin de Xcode):**

a. Installez **Expo Go** sur votre téléphone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

b. Lancez le serveur de développement:
```bash
npm start
```

c. Scannez le QR code affiché dans le terminal:
   - **iOS**: Ouvrez l'app Appareil Photo et scannez le QR code
   - **Android**: Ouvrez Expo Go et scannez le QR code

**Option 2 - Dans votre navigateur web (le plus simple):**
```bash
npm run web
```
Puis ouvrez http://localhost:8083 (ou le port indiqué) dans votre navigateur.

**Option 3 - Simulateur iOS (nécessite macOS + Xcode):**

⚠️ **Prérequis**: Xcode doit être installé et configuré
```bash
# Installer Xcode depuis l'App Store (gratuit, ~12GB)
# Puis configurer les outils de développement:
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept

# Lancer le simulateur:
npm run ios
```

**Option 4 - Émulateur Android (nécessite Android Studio):**
```bash
npm run android
```

Pour le web:
```bash
npm run web
```

### Installation sur votre téléphone

1. Installez l'application **Expo Go** depuis l'App Store (iOS) ou Google Play (Android)
2. Lancez `npm start` dans le terminal
3. Scannez le QR code affiché avec votre téléphone
   - iOS: Utilisez l'app Appareil Photo
   - Android: Utilisez l'app Expo Go directement

### Support Web (facultatif)

Si vous souhaitez utiliser l'app dans un navigateur :
```bash
npm install react-native-web react-dom react-native-worklets --legacy-peer-deps
npm run web
```
Puis ouvrez http://localhost:8081 dans votre navigateur.

## 📂 Structure du Projet

```
challenge_edhec/
├── src/
│   ├── screens/
│   │   ├── WelcomeScreen.js          # Écran d'accueil
│   │   ├── QuestionnaireScreen.js    # Questionnaire multi-étapes
│   │   ├── ProductMatchingScreen.js  # Swipe de recommandations
│   │   ├── QRCodeScreen.js           # Génération QR code
│   │   └── DashboardScreen.js        # Tableau de bord
│   ├── data/
│   │   └── products.js               # Catalogue produits Dove
│   ├── utils/
│   │   ├── storage.js                # Gestion AsyncStorage
│   │   └── recommendations.js        # Algorithme de matching
│   └── components/                   # Composants réutilisables
├── assets/                           # Images et icônes
├── App.js                            # Point d'entrée avec navigation
├── package.json
└── README.md
```

## 🎨 Technologies Utilisées

- **React Native**: Framework mobile
- **Expo**: Plateforme de développement
- **React Navigation**: Navigation entre écrans
- **react-native-qrcode-svg**: Génération de QR codes
- **AsyncStorage**: Stockage local des données
- **react-native-gesture-handler**: Gestes tactiles (swipe)
- **react-native-reanimated**: Animations fluides

## 🌍 Impact Environnemental

### Données Dove / Unilever
- **20 500 tonnes** de plastique vierge économisées par an
- **480 tonnes** d'aluminium économisées par an
- **10 000 tonnes** de plastique évitées sur 10 ans

### Objectifs Loi AGEC (France)
- Réduction de 20% des emballages plastiques d'ici 2025
- 100% des emballages recyclables/réemployés
- 10% d'emballages réemployés en 2027

### Impact par Utilisateur
Chaque recharge permet d'économiser en moyenne :
- **40-50g** de plastique
- **0.10-0.15kg** de CO₂
- Équivalent de **1 bouteille plastique** évitée

## 📊 Algorithme de Recommandation

L'algorithme calcule un score de matching pour chaque produit basé sur :

1. **Type de peau** (40% du score)
   - Correspondance exacte avec les produits adaptés

2. **Environnement** (20% du score)
   - Humidité, pollution, exposition UV

3. **Catégories préférées** (20% du score)
   - Shampoing, gel douche, déodorant, savon

4. **Besoins spécifiques** (20% du score)
   - Hydratation, nutrition, volume, protection, etc.

Score final : 
- **80-100%**: Match Parfait 🎉
- **60-79%**: Excellent Match ✨
- **40-59%**: Bon Match 👍
- **0-39%**: À Essayer 🤔

## 🔐 Données QR Code

Le QR code encode :
```json
{
  "userId": "ECO-xxxx",
  "timestamp": "2025-10-02T...",
  "profile": {
    "skinType": "sec",
    "environment": "moyenne",
    "preferences": ["shampoing", "gel-douche"],
    "needs": ["hydratation", "douceur"],
    "frequency": "monthly"
  },
  "products": [
    {
      "id": "1",
      "name": "Dove Shampoing Nutritif",
      "category": "shampoing"
    }
  ]
}
```

## 🎯 Roadmap

### Phase 1 - MVP (Actuel)
- ✅ Questionnaire personnalisé
- ✅ Recommandations avec swipe
- ✅ Génération QR code
- ✅ Dashboard impact

### Phase 2 - Amélioration
- [ ] Intégration Apple Wallet / Google Pay
- [ ] Authentification utilisateur
- [ ] Notifications push
- [ ] Géolocalisation des bornes
- [ ] Programme de fidélité

### Phase 3 - Expansion
- [ ] Backend API avec données réelles
- [ ] Machine Learning pour recommandations
- [ ] Communauté et partage
- [ ] Intégration e-commerce

## 🤝 Contribution

Cette application a été développée pour le challenge EDHEC dans le cadre du concours innovation Unilever/Dove.

### Équipe
- Développement: [Votre nom]
- Design UX/UI: [Votre nom]
- Business Model: [Votre nom]

## 📄 Licence

Ce projet est développé dans le cadre d'un challenge étudiant pour Unilever/Dove.

## 📞 Contact

Pour toute question concernant le projet :
- Email: [votre email]
- GitHub: [votre profil]

---

**Made with 💚 for a sustainable future**

# Eco-Refill AI Station — Analyse faciale on-device (Option B)

Cette application implémente une première version d'analyse locale (sans cloud) pour déduire automatiquement le type de peau et les besoins.

- Prise de vue: expo-image-picker (caméra ou galerie)
- Analyse heuristique: `src/utils/faceAnalysis.js` (placeholder à remplacer par TFJS)
- Objectif: Privacy by Design, offline-ready

Prochaines étapes techniques:
1. Installer et configurer `@tensorflow/tfjs`, `@tensorflow/tfjs-react-native`, `expo-gl`, `expo-camera` (si besoin) et intégrer un modèle de segmentation peau/cheveux.
2. Implémenter détection visage (MediaPipe Face Detection/Fast), landmarks (FaceMesh) pour cadrage/qualité.
3. Calculer des métriques: brillance (specular highlights), uniformité/rougeurs, densité cheveux; mapper vers catégories du questionnaire.

Usage:
- Écran `Questionnaire`: bouton "Analyser mon visage" qui capture une image, exécute l'analyse locale et pré-remplit les réponses avant d'ouvrir les recommandations.
