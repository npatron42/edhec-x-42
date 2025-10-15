# 📋 Documentation Technique

## Architecture de l'Application

### Navigation
L'application utilise **React Navigation** avec un `StackNavigator` :
- `WelcomeScreen` → Écran d'accueil
- `QuestionnaireScreen` → Formulaire multi-étapes
- `ProductMatchingScreen` → Swipe de recommandations
- `QRCodeScreen` → Génération du QR code
- `DashboardScreen` → Tableau de bord utilisateur

### Gestion des Données

#### AsyncStorage
Toutes les données sont stockées localement :
- `@eco_refill_user_profile` : Profil utilisateur
- `@eco_refill_user_answers` : Réponses questionnaire
- `@eco_refill_history` : Historique recharges
- `@eco_refill_impact` : Statistiques d'impact
- `@eco_refill_selected_products` : Produits sélectionnés

#### Structure de Données

**Réponses Questionnaire :**
```javascript
{
  step1: 'sec',              // Type de peau
  step2: 'moyenne',          // Environnement
  step3: ['shampoing'],      // Catégories
  step4: ['hydratation'],    // Besoins
  step5: 'monthly'           // Fréquence
}
```

**Produit :**
```javascript
{
  id: '1',
  name: 'Dove Shampoing Nutritif',
  category: 'shampoing',
  description: 'Description...',
  skinTypes: ['sec', 'normal'],
  environment: ['faible', 'moyenne'],
  benefits: ['Hydratation', 'Nutrition'],
  co2Saved: 0.15,           // kg
  plasticSaved: 50,         // grammes
  image: '🧴',
  matchScore: 85            // Calculé dynamiquement
}
```

**Statistiques d'Impact :**
```javascript
{
  co2Saved: 2.5,            // kg total
  plasticSaved: 450,        // grammes total
  totalRefills: 10,         // nombre
  bottlesSaved: 9,          // calculé
  lastUpdate: '2025-10-02T...'
}
```

## Algorithme de Recommandation

### Calcul du Score de Match

```javascript
function calculateMatchScore(product, userAnswers) {
  let score = 0;
  
  // 1. Type de peau (40%)
  if (product.skinTypes.includes(userAnswers.step1)) {
    score += 40;
  }
  
  // 2. Environnement (20%)
  if (product.environment.includes(userAnswers.step2)) {
    score += 20;
  }
  
  // 3. Catégories (20%)
  if (userAnswers.step3.includes(product.category)) {
    score += 20;
  }
  
  // 4. Besoins (20%)
  const matchingNeeds = product.benefits.filter(benefit =>
    userAnswers.step4.some(need => 
      benefit.toLowerCase().includes(need)
    )
  );
  score += (matchingNeeds.length / userAnswers.step4.length) * 20;
  
  return score;
}
```

### Interprétation du Score
- **80-100%** : Match Parfait (vert foncé)
- **60-79%** : Excellent Match (bleu)
- **40-59%** : Bon Match (orange)
- **0-39%** : À Essayer (gris)

## Calcul d'Impact Environnemental

### Par Produit
Chaque produit a des valeurs prédéfinies :
- **Shampoing** : 50g plastique, 0.15kg CO₂
- **Gel douche** : 45g plastique, 0.12kg CO₂
- **Déodorant** : 30g plastique, 0.08kg CO₂
- **Savon** : 35g plastique, 0.10kg CO₂

### Impact Mensuel
```javascript
function calculateMonthlyImpact(products, frequency) {
  const multipliers = {
    weekly: 4,
    biweekly: 2,
    monthly: 1
  };
  
  const totalCO2 = products.reduce((sum, p) => 
    sum + p.co2Saved, 0) * multipliers[frequency];
  
  const totalPlastic = products.reduce((sum, p) => 
    sum + p.plasticSaved, 0) * multipliers[frequency];
  
  return {
    co2SavedPerMonth: totalCO2,
    plasticSavedPerMonth: totalPlastic,
    bottlesSavedPerMonth: Math.floor(totalPlastic / 50)
  };
}
```

## Génération QR Code

### Format des Données
Le QR code encode un objet JSON stringifié :

```javascript
{
  userId: "ECO-" + timestamp + random,
  timestamp: new Date().toISOString(),
  profile: {
    skinType: string,
    environment: string,
    preferences: string[],
    needs: string[],
    frequency: string
  },
  products: [{
    id: string,
    name: string,
    category: string
  }]
}
```

### Utilisation à la Borne
1. Scanner le QR code
2. Décoder le JSON
3. Extraire les IDs produits
4. Activer les distributeurs correspondants
5. Enregistrer la transaction (date, quantité, utilisateur)

## Animations

### Swipe (ProductMatchingScreen)
Utilise **react-native-gesture-handler** et **react-native-reanimated** :

```javascript
const panResponder = PanResponder.create({
  onPanResponderMove: (_, gesture) => {
    position.setValue({ x: gesture.dx, y: gesture.dy });
  },
  onPanResponderRelease: (_, gesture) => {
    if (gesture.dx > SWIPE_THRESHOLD) {
      swipeRight(); // Like
    } else if (gesture.dx < -SWIPE_THRESHOLD) {
      swipeLeft(); // Pass
    } else {
      resetPosition();
    }
  }
});
```

### Interpolation
```javascript
const rotate = position.x.interpolate({
  inputRange: [-width/2, 0, width/2],
  outputRange: ['-10deg', '0deg', '10deg']
});

const likeOpacity = position.x.interpolate({
  inputRange: [0, width/4],
  outputRange: [0, 1]
});
```

## Composants Réutilisables

### ProgressBar
Affiche une barre de progression :
```javascript
<ProgressBar current={3} total={5} color="#2e7d32" />
```

### ProductCard
Carte produit avec actions :
```javascript
<ProductCard 
  product={product}
  onLike={() => handleLike(product)}
  onPass={() => handlePass(product)}
/>
```

## Styles et Thème

### Palette de Couleurs
```javascript
const colors = {
  primary: '#2e7d32',      // Vert Dove
  primaryLight: '#e8f5e9', // Vert clair
  secondary: '#4CAF50',    // Vert succès
  danger: '#f44336',       // Rouge refus
  text: '#1a1a1a',         // Texte principal
  textLight: '#666',       // Texte secondaire
  background: '#f5f5f5',   // Fond
  white: '#fff',           // Blanc
};
```

### Typographie
```javascript
const typography = {
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16 },
  caption: { fontSize: 14 },
  small: { fontSize: 12 },
};
```

## Performance

### Optimisations
1. **AsyncStorage** : Lecture/écriture asynchrone
2. **Animations** : `useNativeDriver: false` pour layout
3. **Images** : Emojis au lieu d'images (léger)
4. **Liste** : Pas de FlatList (peu d'items)

### Bundle Size
- **JS Bundle** : ~2-3 MB
- **Assets** : Minimal (emojis uniquement)
- **Total** : ~3-4 MB

## Tests

### Test Manuel
1. Compléter le questionnaire
2. Swiper 3-4 produits
3. Générer le QR code
4. Vérifier le dashboard
5. Tester le refresh

### Scénarios de Test
- Type de peau : sec → recommande shampoings hydratants
- Environnement : élevé → recommande protection
- Sélection multiple → QR code encode tous les produits
- Impact : vérifie calculs CO₂ et plastique

## Déploiement

### Build Production

**iOS :**
```bash
npx expo build:ios
```

**Android :**
```bash
npx expo build:android
```

**Web :**
```bash
npx expo export:web
```

### Configuration App Stores
1. Créer comptes développeur (Apple, Google)
2. Configurer app.json (bundleIdentifier, package)
3. Ajouter icônes et splash screens
4. Générer builds signés
5. Soumettre pour review

## Évolutions Futures

### Backend API
```javascript
// endpoints suggérés
POST /api/users/profile
GET  /api/products/recommendations
POST /api/refills
GET  /api/users/impact
GET  /api/stations/nearby
```

### Machine Learning
- Affiner recommandations avec historique
- Prédire besoins futurs
- Analyser tendances par région

### Notifications
- Rappel recharge
- Nouveaux produits
- Objectifs atteints
- Promotions personnalisées

---

**Documentation mise à jour : 2 octobre 2025**
