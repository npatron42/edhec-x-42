# 💧 Vaseline Smart Refill Station

[![Version](https://img.shields.io/badge/version-1.1.0-green.svg)](./CHANGELOG.md)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue.svg)](./README.md)
[![React Native](https://img.shields.io/badge/React%20Native-Expo%20SDK%2054-blue.svg)](https://expo.dev)
[![Status](https://img.shields.io/badge/status-active-success.svg)](./README.md)
[![AI](https://img.shields.io/badge/AI-TensorFlow.js-orange.svg)](https://www.tensorflow.org/js)

Application mobile React Native pour la **borne intelligente de recharge Vaseline** par Unilever. Cette application révolutionne l'expérience beauté en combinant **personnalisation IA**, **éco-responsabilité**, et **gamification**.

---

## 🎯 Pourquoi Vaseline Smart Refill Station ?

### Le Défi Unilever
- **Modernisation** : Digitaliser l'expérience client et capter la GenZ
- **Personnalisation** : Proposer des soins sur-mesure grâce à l'IA
- **Durabilité** : Réduire le plastique et l'empreinte carbone (objectif 2025 : -50%)
- **First-Party Data** : Collecter des données de qualité, avec consentement, pour un CRM efficace
- **Fidélisation** : Gamifier l'expérience pour créer de l'engagement long terme

### Notre Solution
✅ **Analyse IA instantanée** de la peau via caméra (TensorFlow.js)  
✅ **Matching produits** personnalisé en temps réel  
✅ **QR Code** unique pour recharge en borne sans friction  
✅ **Dashboard impact** : CO₂, plastique, économies trackées  
✅ **Gamification** : badges, points, récompenses exclusives  
✅ **Privacy by Design** : données locales, transparence totale  

---

## 📱 Fonctionnalités Principales

### 1. 📸 Analyse IA de la Peau
- **Capture photo** (caméra frontale) ou **upload galerie**
- **Détection automatique** : niveau d'hydratation, brillance, rougeurs, zones sensibles
- **Guidance qualité** : positionnement visage, luminosité, distance caméra
- **Heatmap visuelle** : overlay avec zones analysées et scoring
- **Technologie** :
  - TensorFlow.js (backend WASM web, natif mobile)
  - BlazeFace pour détection faciale
  - BodyPix pour segmentation peau
  - Face Landmarks Detection pour guidance

### 2. 📝 Questionnaire Personnalisé
- **Type de peau** : très sèche, sèche, normale, mixte, sensible
- **Exposition environnementale** : pollution, UV, humidité, climat
- **Catégories de soins** : visage, corps, lèvres, mains, gel douche
- **Besoins prioritaires** : hydratation, réparation, protection, éclat, fraîcheur
- **Fréquence de recharge** : hebdomadaire, bi-mensuelle, mensuelle

### 3. 💫 Product Matching Gamifié
- **Swipe Tinder-style** : like ❤️ / dislike ✖️
- **Scoring IA** : compatibilité peau/produit basée sur analyse
- **Bénéfices clairs** : hydratation profonde, réparation, protection cutanée
- **Impact éco affiché** : CO₂ et plastique économisés par recharge
- **Produits Vaseline** :
  - Crème Visage Hydratation Intense 💧
  - Gel Douche Hydratant 🚿
  - Lait Corps Réparateur 🧴
  - Lip Therapy Original 💋
  - Crème Mains Réparatrice 🤲
  - Intensive Care Aloe Soothe 🌿
  - Advanced Repair ⚕️
  - Healthy Bright ✨

### 4. 📱 QR Code Personnalisé
- **Génération unique** : encodage JSON (préférences + sélection + ID utilisateur)
- **Format compatible borne** : ready to scan
- **Intégration wallet** : Apple Wallet / Google Pay (roadmap)
- **Partage social** : encourager l'éco-responsabilité via réseaux

### 5. 📊 Dashboard Impact & Récompenses
- **Statistiques temps réel** :
  - Plastique économisé (grammes → kg)
  - CO₂ évité (kg)
  - Bouteilles plastiques sauvées
  - Économies financières estimées (€)
- **Objectifs 2025 Unilever** : progression vers targets
- **Historique recharges** : dates, produits, impact cumulé
- **Système de badges** : déblocage automatique (Pionnier, Éco-warrior, etc.)
- **Points de fidélité** : cumulables pour réductions
- **Réductions exclusives** : codes utilisables en borne
- **Privacy badge** : transparence sur la gestion des données (first-party, local storage, RGPD)

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** >= 20.19.4
- **npm** ou **yarn**
- **Expo CLI** (installé automatiquement)

### Installation en 3 étapes

```bash
# 1. Cloner et installer
git clone <repo-url>
cd challenge_edhec
npm install --legacy-peer-deps

# 2. Lancer l'app
npm start

# 3. Choisir votre plateforme
# - Web : appuyez sur 'w'
# - iOS : appuyez sur 'i' (simulateur) ou scannez le QR code (Expo Go)
# - Android : appuyez sur 'a' (émulateur) ou scannez le QR code (Expo Go)
```

### 🌐 Test Web (le plus rapide)
```bash
npm run web
```
→ Ouvrez **http://localhost:8083** dans Chrome/Firefox/Safari

### 📱 Test sur Téléphone Réel (recommandé pour IA caméra)
1. Installez **Expo Go** depuis l'App Store (iOS) ou Google Play (Android)
2. Lancez `npm start`
3. Scannez le QR code avec :
   - **iOS** : App Appareil Photo → ouvre Expo Go
   - **Android** : App Expo Go → bouton "Scan QR Code"

---

## 🛠️ Architecture Technique

### Stack
- **React Native** (Expo SDK 54)
- **React Navigation** (stack navigator)
- **AsyncStorage** (persistence locale)
- **TensorFlow.js** + **@tensorflow-models** (IA)
- **Expo Camera** + **Expo Image Picker** (capture)
- **react-native-qrcode-svg** (QR code)

### Structure du Projet
```
src/
├── components/
│   ├── common/          # AppButton, AppHeader, AppIcon
│   ├── ProductCard.js   # Card produit avec swipe
│   └── ProgressBar.js   # Barre de progression
├── data/
│   └── products.js      # Catalogue Vaseline + questionnaire
├── screens/
│   ├── AuthScreen.js           # Création compte
│   ├── WelcomeScreen.js        # Onboarding
│   ├── QuestionnaireScreen.js  # Questionnaire
│   ├── CameraCaptureScreen.js  # Capture photo IA
│   ├── SkinSummaryScreen.js    # Résultats analyse + heatmap
│   ├── ProductMatchingScreen.js # Swipe produits
│   ├── QRCodeScreen.js         # Génération QR
│   ├── RefillMapScreen.js      # Carte bornes (MapView native)
│   ├── RefillMapScreen.web.js  # Carte bornes (iframe web)
│   ├── DashboardScreen.js      # Impact + stats + rewards
│   └── ProfileScreen.js        # Profil + badges + discounts
├── styles/
│   └── theme.js         # Couleurs, spacing, radius, shadows
└── utils/
    ├── faceAnalysis.js  # Logique IA TensorFlow
    ├── recommendations.js # Algo matching produits
    └── storage.js       # AsyncStorage helpers
```

---

## 🎨 Expérience Utilisateur

### Flux Utilisateur Optimisé
```
Auth → Questionnaire → CameraCapture → SkinSummary (Heatmap) 
  → ProductMatching (Swipe) → QRCode → RefillMap → Dashboard/Profile
```

### Design System
- **Palette Vaseline** : bleu primaire (#3498db), vert impact (#2ecc71)
- **Typographie** : SF Pro (iOS), Roboto (Android)
- **Animations** : smooth transitions, swipe gestures naturelles
- **Accessibilité** : contraste WCAG AA, touch targets 44x44

### Gamification
- **Badges** : Pionnier (1ère recharge), Éco-warrior (10 recharges), Champion (50 recharges)
- **Points** : +10 par recharge, +50 par parrainage, +100 par milestone
- **Récompenses** : -5% produit, -10% achat borne, gratuité produit (500 pts)

---

## 🌍 Impact Environnemental

### Données Unilever 2025
- **20 500 tonnes** de plastique économisées/an
- **480 tonnes** d'aluminium économisées/an
- **2M+ utilisateurs** engagés dans l'éco-recharge

### Par Recharge Utilisateur (moyenne)
- **50g** de plastique économisés
- **0.15kg** de CO₂ évités
- **1€** d'économie estimée vs achat neuf

---

## 🔐 Privacy by Design

### Principes
- ✅ **Données locales** : AsyncStorage, pas de serveur cloud
- ✅ **Pas de stockage photo** : analyse en mémoire, immediate discard
- ✅ **Consentement explicite** : opt-in pour tracking analytics
- ✅ **RGPD compliant** : droit à l'oubli (bouton reset dans profil)
- ✅ **Transparence** : badge privacy sur dashboard avec explications

### First-Party Data (Collecte Consentie)
- **Profil utilisateur** : nom, email, date création
- **Préférences peau** : type, besoins, environnement
- **Historique recharges** : produits, dates, quantités
- **Engagement** : points, badges, utilisation app

### Usage Business
→ **CRM Unilever** : segmentation clients, campagnes ciblées  
→ **Product Development** : insights sur besoins consommateurs  
→ **Fidélisation** : rewards program, offres personnalisées  

---

## 🧪 Tests & Validation

### Plateformes Testées
- ✅ **Web** : Chrome, Firefox, Safari (responsive)
- ✅ **iOS Simulateur** : iPhone 15 Pro, iPad
- ✅ **iOS Réel** : iPhone 12 Pro, iPhone 14
- ⚙️ **Android Émulateur** : Pixel 6 (config en cours, voir TROUBLESHOOTING.md)

### Robustesse IA
- ✅ **Fallback galerie** : si caméra indisponible (simulateur, permissions)
- ✅ **Guidance qualité** : alerts si photo floue, mal cadrée, trop sombre
- ✅ **Backend adaptatif** : WASM (web), natif (mobile)
- ✅ **Tidy/Dispose** : gestion mémoire tensors pour éviter leaks

---

## 🚧 Roadmap

### Phase 2 (Q2 2025)
- [ ] Intégration API backend Unilever (auth, sync CRM)
- [ ] Géolocalisation automatique des bornes
- [ ] API météo/pollution pour recommandations contextuelles
- [ ] Notifications push (rappel recharge, nouveaux produits)
- [ ] Partage social (Instagram, TikTok) avec deep linking

### Phase 3 (Q3 2025)
- [ ] Apple Wallet / Google Pay intégration QR code
- [ ] Programme de parrainage (bonus points)
- [ ] Chatbot IA pour conseils beauté
- [ ] Multi-langue (EN, ES, DE)
- [ ] Dark mode

---

## 📚 Documentation Complète

- **[START_HERE.md](./START_HERE.md)** : Guide de démarrage complet
- **[QUICKSTART.md](./QUICKSTART.md)** : Installation express
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** : Résolution problèmes
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** : Architecture détaillée
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** : API & composants
- **[CHANGELOG.md](./CHANGELOG.md)** : Historique versions
- **[PITCH.md](./PITCH.md)** : Présentation business
- **[PRESENTATION_GUIDE.md](./PRESENTATION_GUIDE.md)** : Guide pitch investisseurs

---

## 👥 Équipe & Contact

**Projet réalisé dans le cadre du challenge Unilever 2025**  
Stack : React Native, TensorFlow.js, Expo  
Licence : MIT  

---

## 🌟 Démo Vidéo

🎥 **[Voir la démo complète](#)** (à venir)

---

## 📊 KPIs Business

### Objectifs Mesurables
- **Adoption** : 100k utilisateurs actifs / an
- **Engagement** : 3+ recharges / utilisateur / mois
- **Rétention** : 70% à 3 mois
- **Impact plastique** : 5 tonnes économisées / mois
- **Satisfaction** : NPS > 50

### Revenus Potentiels
- **Cross-sell** : +15% ventes produits complémentaires
- **Upsell** : +20% upgrade vers produits premium
- **Fidélité** : +30% lifetime value vs non-users

---

**🚀 Lancez l'app maintenant et découvrez l'avenir de la beauté durable !**

```bash
npm start
```
