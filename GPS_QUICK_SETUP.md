# 🗺️ Guide Visuel : Configuration GPS en 30 Secondes

## 🎯 Objectif
Définir la position GPS sur **Nice, France** en 30 secondes chrono.

---

## 📱 Android (Méthode Rapide)

### Option 1 : Script Automatique ⚡ (10 secondes)
```bash
./set-gps-location.sh
```
**↓ Sélectionner**
```
1) Nice, France (Côte d'Azur) - Par défaut
```
**↓ Résultat**
```
✅ Position GPS définie avec succès !
```

### Option 2 : Ligne de Commande (15 secondes)
```bash
adb emu geo fix 7.2620 43.7102
```
**↓ Résultat**
```
OK
```

### Option 3 : Interface Graphique (30 secondes)
1. **Cliquer sur `...`** (3 points) dans l'émulateur
2. **Onglet "Location"**
3. **Entrer** : `43.7102` (Latitude), `7.2620` (Longitude)
4. **Cliquer "Send"**

---

## 🍎 iOS (Méthode Rapide)

### Option 1 : Menu Simulator (20 secondes)
1. **Menu "Debug"** dans le Simulator
2. **Location → Custom Location...**
3. **Entrer** :
   - **Latitude** : `43.7102`
   - **Longitude** : `7.2620`
4. **Cliquer "OK"**

### Option 2 : Positions Prédéfinies (10 secondes)
1. **Menu "Debug" → Location**
2. **Sélectionner** : `City Bicycle Ride` (simulation de mouvement)

---

## ✅ Validation (10 secondes)

### Dans l'App
1. **Ouvrir** "Bornes de Recharge"
2. **Autoriser** la localisation
3. **Vérifier** :
   - ✅ Carte centrée sur **Nice**
   - ✅ **Point bleu** (votre position) visible
   - ✅ **5 bornes** autour de Nice

### Dans les Logs Metro
```
📍 Demande de localisation GPS...
🖥️  Mode: Émulateur
✅ Permission accordée - récupération de la position GPS...
✅ Position GPS obtenue: 43.7102, 7.2620
```

---

## 🚨 Dépannage Express (30 secondes)

### Problème : "Permission de localisation refusée"
**Solution** :
1. Désinstaller l'app
2. Relancer : `npm run android` (ou `ios`)
3. **Autoriser** la localisation

### Problème : "Localisation GPS indisponible"
**Solution** :
```bash
# Android
adb emu geo fix 7.2620 43.7102

# iOS
Debug → Location → Custom Location... → 43.7102, 7.2620
```

### Problème : Carte vide
**Solution** :
```bash
npm start -- --reset-cache
```

---

## 🌍 Autres Positions GPS (Copier-Coller)

### Android (adb)
```bash
# Nice
adb emu geo fix 7.2620 43.7102

# Paris
adb emu geo fix 2.2945 48.8584

# Marseille
adb emu geo fix 5.3698 43.2965
```

### iOS (Simulator)
```
Nice      : 43.7102, 7.2620
Paris     : 48.8584, 2.2945
Marseille : 43.2965, 5.3698
```

---

## 📋 Checklist Rapide

**Avant de tester :**
- [ ] Émulateur lancé (`npm run android` ou `ios`)
- [ ] Position GPS définie (voir commandes ci-dessus)
- [ ] App installée et fonctionnelle

**Dans l'app :**
- [ ] Écran "Bornes de Recharge" ouvert
- [ ] Permission localisation **autorisée**
- [ ] Carte centrée sur Nice
- [ ] Point bleu (user location) visible
- [ ] 5 bornes de recharge visibles

**Logs Metro :**
- [ ] `✅ Position GPS obtenue: 43.7102, 7.2620`
- [ ] Aucune erreur `⚠️`

---

## 🎯 Résultat Attendu

```
┌─────────────────────────────────────┐
│  📍 Bornes de Recharge              │
│  Localisez une borne à proximité   │
├─────────────────────────────────────┤
│                                     │
│    ╔═══════════════════════╗       │
│    ║                       ║       │
│    ║   🗺️  Nice, France   ║       │
│    ║                       ║       │
│    ║   🔵 (Votre position) ║       │
│    ║                       ║       │
│    ║   📍 Borne Masséna    ║       │
│    ║   📍 Borne Gare       ║       │
│    ║   📍 Borne Étoile     ║       │
│    ║   📍 Borne Université ║       │
│    ║   📍 Borne Promenade  ║       │
│    ║                       ║       │
│    ╚═══════════════════════╝       │
│                                     │
├─────────────────────────────────────┤
│  [Générer mon QR Code]              │
└─────────────────────────────────────┘
```

---

## ⏱️ Temps Total : 30 Secondes

1. **10s** : Définir GPS (script ou commande)
2. **10s** : Ouvrir l'app → "Bornes de Recharge"
3. **10s** : Vérifier carte + point bleu + bornes

---

**✅ C'est tout !** Vous êtes prêt à tester la localisation GPS. 🎉

**📍 Position par défaut** : Nice, France (43.7102, 7.2620)  
**🚀 Commande rapide** : `./set-gps-location.sh`  
**📚 Guide complet** : `GPS_LOCATION_GUIDE.md`
