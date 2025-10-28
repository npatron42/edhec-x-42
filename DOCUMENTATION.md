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

## Pipeline IA modulaire

Le pipeline d'IA est découpé en deux étapes indépendantes pour plus de robustesse et de traçabilité.

1) Analyse vision → JSON
- Fichier: `src/ai/visionAnalysisLLM.js` (fonction `analyzeVisionOnly`)
- Entrées: image en base64 (selfie), signaux environnementaux (UV, humidité, pollution)
- Sortie normalisée:
```json
{
  "skin_type": "sec|normal|gras|mixte|sensible",
  "needs": ["hydratation", "apaisement", ...],
  "notes": ["..."],
  "hair": { "type": "raide|ondulé|bouclé|crépu|--", "density": "faible|moyenne|élevée", "frizz": 0..1, "shine": 0..1 }
}
```

2) Recommandations produits → liste personnalisée
- Fichier: `src/ai/recoLLM.js` (fonction `recommendFromAnalysis`)
- Entrées: JSON d'analyse + catalogue Vaseline (avec prix et attributs)
- Sortie: `{ recommendations: Product[], rationale?: string }`
- Contraintes appliquées par prompt: EXACTEMENT 8 items, ≥3 avec `match_score ≥ 85`, raisons en français, utilisation stricte du catalogue.
- Prix: le prompt est « price-aware » et encourage à valoriser les recharges avantageuses (`priceRefill`).

Ecran intégrateur
- Fichier: `src/screens/BeautyAnalysisScreen.js`
- Chaînage: `analyzeVisionOnly` → `recommendFromAnalysis`
- Persistance: les résultats sont sauvegardés dans `@eco_refill_user_answers` pour réutilisation (Tinder-like, QR, etc.).

Fallbacks
- Si l'IA est indisponible: `src/utils/recommendations.js` applique un scoring local explicable.

## Gestion des clés API

- `.env` (ignoré par git) définit `GEMINI_API_KEY` et `OPENAI_API_KEY`.
- `app.config.js` charge `dotenv` et expose les clés via `expoConfig.extra` pour Expo/EAS.
- `src/env/config.js` lit d'abord `expoConfig.extra`, puis `process.env`.

Bonnes pratiques
- Ne jamais commiter `.env`.
- Les builds OTA (EAS Update) récupèrent les clés depuis `extra`.

## Algorithme de Recommandation (fallback local)

### Calcul du Score de Match

```javascript
function calculateMatchScore(product, userAnswers) {
  let score = 0;
  if (product.skinTypes.includes(userAnswers.step1)) score += 40; // Peau
  if (product.environment.includes(userAnswers.step2)) score += 20; // Environnement
  if (userAnswers.step3.includes(product.category)) score += 20; // Catégorie
  const matchingNeeds = product.benefits.filter(benefit =>
    userAnswers.step4.some(need => benefit.toLowerCase().includes(need))
  );
  score += (matchingNeeds.length / Math.max(userAnswers.step4.length, 1)) * 20; // Besoins
  return score;
}
```

### Interprétation du Score
- 80-100% : Match Parfait (vert foncé)
- 60-79% : Excellent Match (bleu)
- 40-59% : Bon Match (orange)
- 0-39% : À Essayer (gris)

## Calcul d'Impact Environnemental

### Par Produit
Chaque produit a des valeurs prédéfinies :
- Shampoing : 50g plastique, 0.15kg CO₂
- Gel douche : 45g plastique, 0.12kg CO₂
- Déodorant : 30g plastique, 0.08kg CO₂
- Savon : 35g plastique, 0.10kg CO₂

### Impact Mensuel
```javascript
function calculateMonthlyImpact(products, frequency) {
  const multipliers = { weekly: 4, biweekly: 2, monthly: 1 };
  const totalCO2 = products.reduce((sum, p) => sum + p.co2Saved, 0) * multipliers[frequency];
  const totalPlastic = products.reduce((sum, p) => sum + p.plasticSaved, 0) * multipliers[frequency];
  return { co2SavedPerMonth: totalCO2, plasticSavedPerMonth: totalPlastic, bottlesSavedPerMonth: Math.floor(totalPlastic / 50) };
}
```

## Génération QR Code

### Format des Données
Le QR code encode un objet JSON stringifié :

```javascript
{
  userId: "ECO-...",
  timestamp: new Date().toISOString(),
  profile: {/* profil IA ou questionnaire */},
  products: [{ id, name, category }]
}
```

### Utilisation à la Borne
1. Scanner le QR code
2. Décoder le JSON
3. Extraire les IDs produits
4. Activer les distributeurs correspondants
5. Enregistrer la transaction (date, quantité, utilisateur)

## Styles et Thème
- Thème Vaseline: bleus profonds, dégradés, glassmorphism, glow subtil.
- `ThemeProvider` applique clair/sombre et palette unifiée.

## Tests & QA
- Vérifier que les recommandations comportent 8 éléments et ≥3 excellents.
- Contrôler que les raisons mentionnent besoins/peau/env/prix.
- Tester absence de clé → message d’erreur IA.
- Web: CORS possibles, privilégier iOS/Android en dev.

## Déploiement
- EAS Update configuré. Publier OTA après QA si nécessaire.

—
Documentation mise à jour: 28 octobre 2025
