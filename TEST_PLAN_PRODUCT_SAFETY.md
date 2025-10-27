# 🧪 Test Plan: Product Safety Fixes

## Objectif
Vérifier que l'application gère correctement les produits `undefined`, `null` ou avec des propriétés manquantes sans crasher.

---

## ✅ Tests à Effectuer

### Test 1: Produit Complètement Valide ✅
**Scénario**: Navigation normale avec des produits valides  
**Attendu**: Affichage parfait sans erreur

**Étapes**:
1. Lancer l'app : `npm start`
2. Compléter le questionnaire
3. Swiper sur les produits (ProductMatchingScreen)
4. Générer le QR Code (QRCodeScreen)
5. Vérifier le Dashboard

**Vérification**:
- ✅ Emojis de produits affichés correctement
- ✅ Noms et descriptions visibles
- ✅ Métriques (CO₂, plastique) présentes
- ✅ Aucune erreur dans les logs

---

### Test 2: Produit avec Propriétés Manquantes ⚠️
**Scénario**: Simuler un produit sans `image` ou `benefits`

**Setup - Modifier temporairement `src/data/products.js`**:
```javascript
// Ajouter ce produit de test
{
  id: 'test-1',
  name: 'Produit Test Sans Image',
  category: 'test',
  // image: undefined ❌
  // benefits: undefined ❌
  skinTypes: ['normal'],
  environment: ['moyenne'],
  co2Saved: 0.1,
  plasticSaved: 30,
}
```

**Attendu**:
- ✅ Emoji par défaut `📦` affiché
- ✅ Pas de crash sur l'écran ProductCard
- ✅ Section benefits vide (pas d'erreur)

---

### Test 3: Array de Produits avec Valeur Null 🔍
**Scénario**: Injecter un `null` dans la liste de produits

**Setup - Dans `DashboardScreen.js` (temporairement)**:
```javascript
// Ligne ~100, après le chargement
const testProducts = [...products, null, undefined];
setUserProfile({ ...userProfile, products: testProducts });
```

**Attendu**:
- ✅ Filtrage automatique des valeurs `null`/`undefined`
- ✅ Seuls les produits valides affichés
- ✅ Pas d'erreur "Cannot read property"

---

### Test 4: Produits Vides dans QRCodeScreen 📱
**Scénario**: Générer un QR Code sans produits sélectionnés

**Étapes**:
1. Compléter le questionnaire
2. Ne sélectionner AUCUN produit (swiper tous à gauche)
3. Aller sur QRCodeScreen

**Attendu**:
- ✅ Message "Aucun produit sélectionné" affiché
- ✅ QR Code généré quand même (avec profil seul)
- ✅ Section "Produits choisis" vide mais pas d'erreur

---

### Test 5: Storage Local Corrompu 💾
**Scénario**: Simuler des données AsyncStorage corrompues

**Setup - Dans Chrome DevTools (Web) ou React Native Debugger**:
```javascript
// Exécuter dans la console
AsyncStorage.setItem('selectedProducts', '{ invalid json }');
```

**Attendu**:
- ✅ L'app détecte les données invalides
- ✅ Retour aux valeurs par défaut
- ✅ Pas de crash au démarrage

---

## 🔍 Zones Critiques à Surveiller

### 1. Console Logs
**Rechercher ces erreurs** (ne doivent PAS apparaître) :
```
❌ TypeError: Cannot read property 'image' of undefined
❌ TypeError: Cannot read property 'benefits' of undefined
❌ TypeError: undefined is not an object
```

### 2. React Native Debugger
**Vérifier** :
- ✅ Pas de crash dans l'onglet "Errors"
- ✅ State correct dans Redux DevTools (si activé)
- ✅ Network requests OK

### 3. Visual Testing
**Screens à vérifier** :
- ✅ `ProductMatchingScreen` - Swipe cards
- ✅ `QRCodeScreen` - Liste produits + QR
- ✅ `DashboardScreen` - Section "Vos Produits"
- ✅ `SkinSummaryScreen` - Produits recommandés

---

## 🚀 Commandes Rapides

```bash
# Test iOS
npm run ios

# Test Android
npm run android

# Test Web (plus facile pour DevTools)
npm run web

# Logs en temps réel
# iOS
npx react-native log-ios

# Android
npx react-native log-android
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

## 📋 Checklist de Validation

### Avant de Merger
- [ ] Test 1 passé (produits valides) ✅
- [ ] Test 2 passé (propriétés manquantes) ✅
- [ ] Test 3 passé (null dans array) ✅
- [ ] Test 4 passé (pas de produits) ✅
- [ ] Test 5 passé (storage corrompu) ✅
- [ ] Aucune erreur dans les logs ✅
- [ ] UI reste propre avec fallbacks ✅
- [ ] Performance OK (pas de lag) ✅

### Screens Validés
- [ ] WelcomeScreen ✅
- [ ] QuestionnaireScreen ✅
- [ ] ProductMatchingScreen ✅
- [ ] SkinSummaryScreen ✅
- [ ] QRCodeScreen ✅
- [ ] DashboardScreen ✅
- [ ] ProfileScreen ✅

---

## 🐛 Si un Bug Persiste

### 1. Vérifier le Stack Trace
```bash
# Localiser l'erreur exacte
npx react-native log-ios | grep "TypeError"
```

### 2. Ajouter des Logs de Debug
```javascript
console.log('Product data:', JSON.stringify(product, null, 2));
console.log('Product exists:', Boolean(product));
console.log('Product has ID:', Boolean(product?.id));
```

### 3. Vérifier les Imports
```javascript
// S'assurer que les données sont bien importées
import { doveProducts } from '../data/products';
console.log('Products loaded:', doveProducts.length);
```

### 4. Reset AsyncStorage
```bash
# iOS Simulator
xcrun simctl get_app_container booted <bundle-id> data

# Android
adb shell pm clear <package-name>
```

---

## 📚 Documentation Connexe

- [`PRODUCT_SAFETY_FIX.md`](./PRODUCT_SAFETY_FIX.md) - Détails techniques des corrections
- [`BUGFIX_SUMMARY.md`](./BUGFIX_SUMMARY.md) - Résumé de tous les bugs
- [`TESTING_GUIDE_UI.md`](./TESTING_GUIDE_UI.md) - Guide de test UI/UX complet
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - Dépannage général

---

## ✅ Résultat Attendu

Après ces corrections, l'application doit être **100% stable** face aux scénarios suivants :

| Scénario | Comportement |
|----------|--------------|
| Produit `undefined` | Emoji `📦` + nom "Produit" |
| `product.image` manquant | Emoji `📦` par défaut |
| `product.benefits` `null` | Array vide, pas d'erreur |
| Array avec `null` | Filtré automatiquement |
| Storage corrompu | Reset avec valeurs par défaut |

**Status Final** : 🟢 **Production Ready**

---

**Créé par** : GitHub Copilot  
**Date** : 2024  
**Version** : 2.0
