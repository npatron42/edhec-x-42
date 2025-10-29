# 🚀 Guide de test - Nouvelle UI/UX v2.0

## ✅ Vérification rapide avant de démarrer

### 1. Vérifier les dépendances
```bash
# Vérifier que expo-linear-gradient est installé
npm list expo-linear-gradient

# Si non installé, installer
npm install expo-linear-gradient
```

### 2. Démarrer l'application
```bash
# Méthode 1 : Expo standard
npm start

# Méthode 2 : iOS
npm run ios

# Méthode 3 : Android (avec webcam)
./start-emulator-with-webcam.sh
# Puis dans un autre terminal :
npm start
```

---

## 🎯 Checklist de test visuel

### Écran WelcomeScreen (Accueil)
- [ ] Hero section avec gradient bleu visible
- [ ] Logo circulaire avec ombre
- [ ] Badge "Éco-responsable & IA" présent
- [ ] 4 features cards avec numéros 1-4
- [ ] Stats section avec badges de tendance
- [ ] Footer sécurité visible
- [ ] Boutons "Commencer" et "J'ai déjà un profil" fonctionnels

**Navigation :** Ouvrir l'app → Devrait arriver sur WelcomeScreen

### Écran QuestionnaireScreen (Questionnaire)
- [ ] Barre de progression en haut
- [ ] Card IA avec gradient et bouton "Lancer l'analyse"
- [ ] Question claire avec typographie h2
- [ ] Badge informatif pour sélections multiples
- [ ] Options avec icônes 52x52
- [ ] Gradient sur option sélectionnée
- [ ] Checkbox circulaire 32x32
- [ ] Bouton "Suivant" avec ombre

**Navigation :** WelcomeScreen → Bouton "Commencer"

### Écran SkinSummaryScreen (Bilan)
- [ ] Header "Bilan peau & cheveux"
- [ ] Photo avec heatmap de rougeurs (si visage détecté)
- [ ] Badge avec icône user
- [ ] Grid de metrics (3 colonnes)
- [ ] Section notes avec icône info
- [ ] Bouton "Voir mes recommandations"

**Navigation :** QuestionnaireScreen → Analyser mon visage → Prendre photo

### Écran ProductMatchingScreen (Matching)
- [ ] Compteur "1 / X" en haut à droite
- [ ] Card produit avec gradient surface
- [ ] Badge de match en haut à droite
- [ ] Emoji produit 80px
- [ ] Tags de bénéfices avec fond primaryLight
- [ ] Impact stats (plastique/CO₂) dans card
- [ ] Barre de match en bas
- [ ] Boutons circulaires (❌ et ❤️)
- [ ] Compteur de produits sélectionnés en bas

**Navigation :** QuestionnaireScreen → "Voir mes recommandations"

### Écran de fin ProductMatchingScreen
- [ ] Icône célébration 120x120 avec fond coloré
- [ ] Titre "Sélection terminée !"
- [ ] Liste des produits avec gradients alternés
- [ ] Checkmark vert sur chaque produit
- [ ] 3 boutons : QR Code, Trouver borne, Recommencer

**Navigation :** ProductMatchingScreen → Swiper tous les produits

### Écran DashboardScreen (Tableau de bord)
- [ ] Hero banner avec gradient et avatar
- [ ] Texte "Bonjour 👋" et nom
- [ ] Stats en grille 2x2 avec gradients
- [ ] Section objectifs avec barres de progression
- [ ] Section produits avec emojis 40px
- [ ] Historique avec icônes circulaires
- [ ] Section récompenses avec badges
- [ ] Card encouragement avec fond coloré
- [ ] Privacy card avec icône shield

**Navigation :** WelcomeScreen → "J'ai déjà un profil"

---

## 🎨 Tests de design system

### Couleurs
Vérifier que les couleurs correspondent :
- [ ] Bleu principal : #1E88E5
- [ ] Vert accent : #4CAF50
- [ ] Fond : #FAFAFA
- [ ] Surface : #FFFFFF
- [ ] Texte principal : #212121

### Gradients
Vérifier les dégradés :
- [ ] Hero sections : primary → primaryMuted
- [ ] Stats cards : alternance primary/accent
- [ ] Cards sélectionnées : gradient visible

### Typographie
Vérifier les tailles :
- [ ] H1 : 32px (Titres principaux)
- [ ] H2 : 28px (Sous-titres)
- [ ] H4 : 18px (Titres de cards)
- [ ] Body : 16px (Texte normal)
- [ ] Caption : 12px (Petits textes)

### Ombres
Vérifier les profondeurs :
- [ ] Cards : ombre légère
- [ ] Boutons CTA : ombre moyenne
- [ ] Modals : ombre forte
- [ ] Hero sections : ombre très forte

### Radius
Vérifier les arrondis :
- [ ] Boutons : 16px (radius.xl)
- [ ] Cards : 16-24px (radius.xl-xxl)
- [ ] Badges : 9999px (radius.full)
- [ ] Avatars : 9999px (radius.full)

---

## 🐛 Tests de régressions

### Navigation
- [ ] Retour arrière fonctionne sur tous les écrans
- [ ] Navigation entre écrans fluide
- [ ] Pas de crash lors du swipe produits
- [ ] Dashboard accessible depuis Welcome

### Fonctionnalités
- [ ] Caméra s'ouvre correctement
- [ ] Analyse IA fonctionne
- [ ] Sélection multiple dans questionnaire
- [ ] Swipe produits réactif
- [ ] QR Code génération OK
- [ ] Sauvegarde des données locale

### Performance
- [ ] Pas de lag au scroll
- [ ] Gradients s'affichent rapidement
- [ ] Animations fluides
- [ ] Chargement rapide des écrans

---

## 📱 Tests multi-plateformes

### iOS
- [ ] Affichage correct sur iPhone 12/13/14
- [ ] Safe area respectée
- [ ] Ombres visibles
- [ ] Gradients bien rendus

### Android
- [ ] Affichage correct sur Pixel 4/5/6
- [ ] Elevation visible
- [ ] Gradients bien rendus
- [ ] Pas de débordement

### Web (si applicable)
- [ ] Responsive design OK
- [ ] Scroll fonctionne
- [ ] Hover states visibles
- [ ] Pas d'erreurs console

---

## 🎬 Parcours utilisateur complet

### Nouveau utilisateur
1. [ ] Ouvrir l'app → WelcomeScreen
2. [ ] Cliquer "Commencer" → QuestionnaireScreen
3. [ ] Cliquer "Lancer l'analyse" → Camera
4. [ ] Prendre une photo → SkinSummaryScreen
5. [ ] Cliquer "Voir recommandations" → ProductMatchingScreen
6. [ ] Swiper 3-4 produits (au moins 1 like)
7. [ ] Voir l'écran de fin → Cliquer "Générer QR Code"
8. [ ] Voir le QR Code

### Utilisateur existant
1. [ ] Ouvrir l'app → WelcomeScreen
2. [ ] Cliquer "J'ai déjà un profil" → DashboardScreen
3. [ ] Vérifier les stats affichées
4. [ ] Cliquer sur avatar → ProfileScreen (si disponible)
5. [ ] Retour au Dashboard

---

## 🎯 Points d'attention spécifiques

### Gradients
- ⚠️ Vérifier que LinearGradient est bien importé partout
- ⚠️ Tester sur appareil réel (émulateur peut avoir rendu différent)

### Ombres
- ⚠️ Sur Android, vérifier l'elevation
- ⚠️ Sur iOS, vérifier shadowOffset/shadowRadius

### Typographie
- ⚠️ Vérifier que typography.* est bien importé
- ⚠️ Pas de fontSize en dur

### Icônes
- ⚠️ Tous les providers sont disponibles (Ionicons, MaterialCommunityIcons)
- ⚠️ Tailles cohérentes (14, 18, 20, 24, 28, etc.)

---

## 📊 Métriques de succès

### Visuel
- ✅ 100% des écrans ont des gradients
- ✅ 100% des cards ont des ombres
- ✅ 100% des textes utilisent typography.*
- ✅ 100% des espacements utilisent spacing.*

### Fonctionnel
- ✅ 0 crash sur parcours complet
- ✅ Navigation fluide (< 300ms entre écrans)
- ✅ Scroll sans lag
- ✅ Animations fluides (60fps)

### Accessibilité
- ✅ Contraste texte/fond > 4.5:1
- ✅ Zones tactiles > 44x44px
- ✅ Taille de police > 14px pour body

---

## 🔧 Dépannage rapide

### Les gradients ne s'affichent pas
```bash
# Réinstaller expo-linear-gradient
npm install expo-linear-gradient
# Redémarrer l'app
npm start -- --reset-cache
```

### Erreur d'import LinearGradient
```javascript
// Vérifier l'import en haut du fichier
import { LinearGradient } from 'expo-linear-gradient';
```

### Ombres pas visibles sur Android
```javascript
// Vérifier que elevation est présent
{
  ...shadow.md, // Doit contenir elevation
}
```

### Typographie non appliquée
```javascript
// Vérifier l'import
import { typography } from '../styles/theme';

// Utiliser spread operator
const styles = StyleSheet.create({
  text: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
```

---

## ✅ Validation finale

Une fois tous les tests passés :
- [ ] Faire une capture d'écran de chaque écran
- [ ] Documenter les bugs trouvés
- [ ] Créer des tickets pour corrections
- [ ] Valider avec l'équipe design
- [ ] Préparer pour démo client

---

## 📝 Rapport de test

### Template
```
Date : __/__/____
Testeur : ___________
Plateforme : iOS / Android / Web
Device : ___________

Écrans testés :
- [ ] WelcomeScreen
- [ ] QuestionnaireScreen
- [ ] SkinSummaryScreen
- [ ] ProductMatchingScreen
- [ ] DashboardScreen

Bugs trouvés : ___
Sévérité : Critique / Majeur / Mineur

Commentaires :
_______________________________
_______________________________
```

---

**Bonne chance pour les tests ! 🚀**

En cas de problème, consulter :
- `UI_UX_MODERNIZATION.md` pour la vue d'ensemble
- `UI_STYLE_GUIDE.md` pour les guidelines
- `CHANGELOG_UI_UX_V2.md` pour les changements détaillés
