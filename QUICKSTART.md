# 🚀 Guide de Démarrage Rapide

## Installation en 3 étapes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer l'application

**Sur votre ordinateur (simulateur) :**
```bash
# iOS (Mac uniquement)
npm run ios

# Android
npm run android

# Web
npm run web
```

**Sur votre téléphone (recommandé) :**
```bash
npm start
```

Puis scannez le QR code avec :
- **iOS**: Application Appareil Photo
- **Android**: Application Expo Go

## 📱 Test de l'Application

### Flux complet :

1. **Écran d'accueil**
   - Cliquez sur "Commencer"

2. **Questionnaire** (5 étapes)
   - Type de peau/cheveux
   - Exposition environnementale
   - Produits préférés
   - Besoins prioritaires
   - Fréquence de recharge

3. **Matching de produits**
   - Swipez à droite (❤️) pour aimer
   - Swipez à gauche (✕) pour passer
   - Visualisez le score de matching

4. **QR Code**
   - Code unique généré
   - Aperçu de l'impact
   - Option de partage

5. **Dashboard**
   - Statistiques d'impact
   - Historique
   - Badges

## 🎯 Fonctionnalités Clés

### Algorithme de Recommandation
- **Type de peau** : 40% du score
- **Environnement** : 20% du score
- **Catégories préférées** : 20% du score
- **Besoins** : 20% du score

### Calcul d'Impact
- **Plastique** : ~45-50g par recharge
- **CO₂** : ~0.10-0.15kg par recharge
- **Bouteilles** : 1 bouteille = 50g plastique

## 🐛 Résolution de Problèmes

### L'app ne démarre pas ?
```bash
# Nettoyer le cache
npm start -- --clear

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Erreur de module manquant ?
```bash
# Réinstaller les dépendances natives
npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
```

### Problème de QR Code ?
Assurez-vous que `react-native-qrcode-svg` et `react-native-svg` sont installés :
```bash
npm install react-native-qrcode-svg react-native-svg
```

## 📊 Données de Test

L'application utilise des données mockées :
- **8 produits Dove** prédéfinis
- **Algorithme de matching** simulé
- **Calculs d'impact** basés sur données réelles Unilever

## 🎨 Personnalisation

### Ajouter un produit :
Éditez `src/data/products.js` :
```javascript
{
  id: '9',
  name: 'Nouveau Produit',
  category: 'shampoing',
  description: 'Description',
  skinTypes: ['normal'],
  environment: ['moyenne'],
  benefits: ['Benefit 1', 'Benefit 2'],
  co2Saved: 0.15,
  plasticSaved: 50,
  image: '🧴',
}
```

### Modifier les couleurs :
Les couleurs principales sont dans chaque fichier `styles` :
- **Vert principal** : `#2e7d32`
- **Vert clair** : `#e8f5e9`
- **Texte** : `#1a1a1a`

## 📞 Support

Pour toute question :
1. Consultez le `README.md` principal
2. Vérifiez les erreurs dans la console
3. Contactez l'équipe de développement

---

**Bon développement ! 💚**
