# ⚡ QUICK START - 5 Minutes
## Vaseline Smart Refill Station

---

## 🎯 Objectif

**Lancer l'app et voir la démo complète en 5 minutes.**

---

## 🚀 Installation Express

### Option 1 : Web (le plus rapide) ✅ RECOMMANDÉ

```bash
# 1. Cloner le repo
git clone <repo-url>
cd challenge_edhec

# 2. Installer les dépendances
npm install --legacy-peer-deps

# 3. Lancer en mode web
npm run web
```

**✅ Ouvrir http://localhost:8083 dans Chrome/Firefox/Safari**

⏱️ **Temps total : 3-5 minutes**

---

### Option 2 : Téléphone Réel (pour tester l'IA caméra)

```bash
# 1. Installer Expo Go sur votre téléphone
# iOS : App Store → rechercher "Expo Go"
# Android : Google Play → rechercher "Expo Go"

# 2. Lancer l'app
npm start

# 3. Scanner le QR code affiché dans le terminal
# iOS : App Appareil Photo → pointe vers QR code → ouvre Expo Go
# Android : App Expo Go → bouton "Scan QR Code"
```

⏱️ **Temps total : 5-7 minutes**

---

## 📱 Parcours Démo (3 minutes)

### Étape 1 : Création Compte (15s)
1. **Nom** : "Clara Test"
2. **Email** : "clara@test.com"
3. Cliquer **"Continuer"**

### Étape 2 : Onboarding (15s)
1. Lire les features principales
2. Scroller vers le bas
3. Cliquer **"Commencer le questionnaire"**

### Étape 3 : Questionnaire (45s)
1. **Type de peau** : Sélectionner "Sèche" 🧴
2. **Exposition environnementale** : Sélectionner "Moyenne" ☁️
3. **Types de soins** : Cocher "Soins visage" + "Gel douche"
4. **Besoins** : Cocher "Hydratation" + "Réparation" + "Protection"
5. **Fréquence** : Sélectionner "Chaque mois"
6. Cliquer **"Analyser ma peau"**

### Étape 4 : Analyse IA (30s)
- **Sur téléphone réel** : Autoriser caméra → capturer selfie
- **Sur web/simulateur** : Cliquer "Utiliser la galerie" → choisir une photo
- Attendre analyse (10s)
- Voir le résumé avec heatmap
- Cliquer **"Voir mes recommandations"**

### Étape 5 : Product Matching (45s)
1. **Swiper** 8 produits Vaseline :
   - ❤️ Like (swipe droite) : Crème Visage, Gel Douche, Lait Corps
   - ✖️ Dislike (swipe gauche) : autres produits
2. Cliquer **"Voir mon QR Code"**

### Étape 6 : QR Code (15s)
1. Voir le QR code personnalisé
2. Lire l'impact prévu (plastique, CO₂)
3. Cliquer **"Trouver une borne"**

### Étape 7 : Carte Bornes (15s)
1. Voir les bornes de recharge sur la carte
2. Cliquer sur une borne pour voir les détails
3. Cliquer **"Aller au tableau de bord"**

### Étape 8 : Dashboard (30s)
1. **Impact Total** : voir plastique/CO₂ économisés
2. **Objectifs 2025** : progression vers targets
3. **Produits sélectionnés** : liste des 3 produits likés
4. **Récompenses** : points, badges (vide pour l'instant)
5. Cliquer **"Gérer mon profil"**

### Étape 9 : Profil (15s)
1. Modifier nom/email si besoin
2. Voir les récompenses (badges, points, réductions)
3. Cliquer **"Enregistrer"**

**✅ DÉMO TERMINÉE !**

---

## 🎥 Points à Montrer dans une Présentation

### 1. Onboarding Moderne (15s)
> "Regardez cette landing page : features claires, icônes engageantes, call-to-action direct."

### 2. Questionnaire Optimisé (30s)
> "5 questions seulement, interface gamifiée avec emojis et descriptions. L'utilisateur termine en moins d'une minute."

### 3. Analyse IA Instantanée (30s)
> "La caméra scanne le visage, l'IA détecte hydratation, brillance, rougeurs en 10 secondes. Heatmap visuelle pour comprendre les zones à traiter."

### 4. Matching Tinder-Style (45s)
> "Swipe droite si vous aimez, gauche sinon. Scoring IA affiché, bénéfices clairs, impact éco par produit. C'est fun, c'est rapide, c'est personnalisé."

### 5. QR Code Ready-to-Scan (15s)
> "Génération instantanée. L'utilisateur scanne en borne, récupère ses produits. Simple, frictionless."

### 6. Dashboard Impact (30s)
> "L'utilisateur voit son impact : CO₂ évité, plastique économisé, bouteilles sauvées. Objectifs 2025 Unilever, progression visible. Gamification : points, badges, réductions."

### 7. Privacy Badge (15s)
> "Transparence totale : données locales, pas de cloud, RGPD compliant. First-party data collectée avec consentement."

**⏱️ Démo complète : 3 minutes**

---

## 🐛 Dépannage Express

### Erreur "Port already in use"
```bash
# Le serveur proposera un autre port automatiquement
# Appuyez sur 'Y' pour accepter
```

### Erreur "Cannot scroll" sur web
→ **Rafraîchir la page (Cmd/Ctrl + R)**  
→ Vérifier que vous utilisez Chrome, Firefox ou Safari récent

### Erreur "Camera permission denied"
→ **Sur web** : Cliquer "Utiliser la galerie" (fallback)  
→ **Sur mobile** : Réglages → Expo Go → autoriser caméra

### Erreur "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Erreur TensorFlow.js web
```bash
# Nettoyer le cache et relancer
npx expo start --web -c
```

---

## 💡 Astuces Performance

### Accélérer le Démarrage
- **Web** : Désactiver extensions Chrome (mode incognito)
- **Mobile** : Fermer autres apps (libérer RAM)

### Optimiser l'Analyse IA
- **Photo bien cadrée** : visage centré, distance 30-50cm
- **Bon éclairage** : lumière naturelle ou éclairage doux (pas de contre-jour)
- **Éviter mouvements** : tenir téléphone stable pendant capture

---

## 📊 Tester les Features Avancées

### Système de Points
1. Aller dans **Profile**
2. Les points s'accumulent avec les recharges (simulées dans l'app)
3. À 500 pts : déblocage réduction -5%

### Badges
1. Effectuer une recharge (simulée via dashboard)
2. Badge "Pionnier" débloqué automatiquement
3. Voir dans Profile → section Récompenses

### Historique Recharges
1. Dashboard → section "Historique des Recharges"
2. Voir les recharges passées (simulées)
3. Impact cumulé affiché

---

## 🎯 Checklist Démo Réussie

Avant de présenter, vérifier que :
- [ ] App lance en < 5s (web/mobile)
- [ ] Questionnaire fonctionne (5 étapes)
- [ ] Analyse IA fonctionne (capture + résultat)
- [ ] Swipe produits fluide (animation smooth)
- [ ] QR code s'affiche correctement
- [ ] Dashboard affiche stats (plastique, CO₂)
- [ ] Profile modifiable (nom, email)
- [ ] Pas d'erreurs console (F12 sur web)

---

## 🚀 Commandes Utiles

```bash
# Lancer en mode web (recommandé démo)
npm run web

# Lancer en mode développement (QR code mobile)
npm start

# Nettoyer le cache (si problème)
npx expo start -c

# Voir les logs en temps réel
# (automatique dans le terminal)

# Build production web (pour déploiement)
npx expo export --platform web
```

---

## 📱 Plateformes Supportées

✅ **Web** : Chrome 90+, Firefox 88+, Safari 14+  
✅ **iOS** : 13.0+ (iPhone 6s et plus récents)  
✅ **Android** : 8.0+ (API 26+)  

---

## 🎉 Prêt pour la Démo !

**Lancez l'app maintenant :**

```bash
npm run web
```

**Ouvrez http://localhost:8083 et suivez le parcours ci-dessus.**

**Temps total : 5 minutes. Expérience beauté durable : garantie.**

---

## 📞 Besoin d'Aide ?

📄 **Documentation complète** : README_NEW.md  
📄 **Guide présentation** : PRESENTATION_GUIDE_UPDATED.md  
📄 **Pitch deck** : PITCH_UPDATED.md  
📄 **Résumé exécutif** : EXECUTIVE_SUMMARY_UPDATED.md  
📄 **Troubleshooting** : TROUBLESHOOTING.md  

---

**🚀 Go time !**
