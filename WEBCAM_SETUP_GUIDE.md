# 📷 Guide : Activer la Webcam Mac pour l'Émulateur Android

**Date :** 24 Octobre 2025  
**Objectif :** Utiliser la webcam de votre Mac comme caméra de l'émulateur Android

---

## 🎯 Ce Que Vous Obtenez

✅ **Caméra fonctionnelle** : Votre webcam Mac devient la caméra de l'émulateur  
✅ **Choix complet** : Caméra OU Galerie (les deux options disponibles)  
✅ **Analyse IA en direct** : Testez l'analyse du visage en temps réel  
✅ **Démo réaliste** : Expérience identique à un smartphone réel  

---

## 🚀 Méthode 1 : Via Script (Recommandé - Plus Simple)

### Étape 1 : Démarrer l'Émulateur avec Webcam

```bash
cd /Users/h/Documents/challenge_edhec
./start-emulator-with-webcam.sh
```

**Le script va :**
1. ✅ Démarrer l'émulateur Android
2. ✅ Configurer la webcam Mac comme caméra frontale
3. ✅ Configurer la webcam Mac comme caméra arrière

### Étape 2 : Attendre que l'Émulateur Démarre

⏱️ **Patience** : L'émulateur met 30-60 secondes à démarrer complètement

### Étape 3 : Lancer l'App

Une fois l'émulateur prêt, dans le terminal Expo :
```
Appuyez sur 'a' pour ouvrir sur Android
```

### Étape 4 : Tester la Caméra

1. Dans l'app, allez sur "Analyser mon visage"
2. **Vous verrez maintenant 2 options** :
   - **Capturer** : Utilise votre webcam Mac
   - **Ou choisir dans la galerie** : Utilise une photo

3. Cliquez sur **Capturer**
4. **Autorisez l'accès à la caméra** si demandé
5. **Positionnez votre visage** face à la webcam
6. **Cliquez sur Capturer**
7. **L'analyse IA se lance** automatiquement !

---

## 🔧 Méthode 2 : Manuelle (Avancée)

### Option A : Depuis AVD Manager (Android Studio)

1. **Ouvrez Android Studio**
2. **AVD Manager** (icône téléphone en haut à droite)
3. **Éditez** votre émulateur (`eco-refill-api34-arm64`)
4. **Show Advanced Settings**
5. **Camera** :
   - **Front** : `Webcam0` (votre webcam Mac)
   - **Back** : `Webcam0` (ou `Emulated`)
6. **Finish**
7. **Démarrez l'émulateur** depuis AVD Manager

### Option B : Depuis la Ligne de Commande

```bash
# Lister les émulateurs disponibles
emulator -list-avds

# Démarrer avec webcam
emulator -avd eco-refill-api34-arm64 -camera-front webcam0 -camera-back webcam0 &
```

---

## 🧪 Vérification

### Test 1 : Vérifier que l'Émulateur Utilise la Webcam

```bash
# Vérifier la config caméra
adb shell getprop | grep camera
```

Vous devriez voir :
```
[ro.boot.qemu.camera_protocol_ver]: [1]
[vendor.qemu.sf.fake_camera]: []  # Vide = vraie caméra
```

### Test 2 : Tester dans l'App Caméra Native Android

1. Ouvrez l'app **Caméra** native de l'émulateur
2. Basculez en mode selfie (caméra frontale)
3. **Vous devriez voir votre visage** via la webcam !

Si ça marche, ça marchera dans votre app Vaseline ! ✅

---

## 💡 Conseils pour une Bonne Analyse IA

### Éclairage
✅ **Lumière de face** (pas de contre-jour)  
✅ **Lumière uniforme** (éviter les ombres)  
✅ **Lumière naturelle** idéale (près d'une fenêtre)  

### Position
✅ **Visage centré** dans le cadre  
✅ **Distance 40-60cm** de la webcam  
✅ **Regard vers la caméra**  

### Environnement
✅ **Fond neutre** si possible  
✅ **Pas de mouvement** pendant la capture  
✅ **Cheveux dégagés** du visage  

---

## 🎬 Workflow Complet

```
1. Démarrer émulateur avec webcam
   └→ ./start-emulator-with-webcam.sh

2. Attendre démarrage (30-60s)

3. Lancer Expo
   └→ Appuyer 'a' dans terminal Expo

4. Dans l'app :
   └→ Créer compte
   └→ Questionnaire
   └→ "Analyser mon visage"
   └→ Choisir "Capturer"
   └→ Autoriser caméra
   └→ Positionner visage
   └→ Capturer
   └→ Analyse IA automatique
   └→ Voir recommandations

5. Alternative à tout moment :
   └→ Bouton "Ou choisir dans la galerie"
```

---

## 🔍 Troubleshooting

### Problème : "Webcam0 not found"

**Solution :**
```bash
# Vérifier les webcams disponibles
ls -la /dev/video*

# Si aucune webcam, installer pilote
# Redémarrer l'émulateur
```

### Problème : Écran noir dans la caméra

**Solution :**
1. Vérifier que la webcam n'est pas utilisée par une autre app (Zoom, etc.)
2. Redémarrer l'émulateur
3. Autoriser l'accès caméra dans les paramètres Android

### Problème : Permission refusée

**Solution :**
```bash
# Dans l'émulateur, aller dans :
Paramètres → Apps → Expo Go → Permissions → Caméra → Autoriser
```

### Problème : Mauvaise qualité d'image

**Solution :**
- Améliorer l'éclairage
- Nettoyer la webcam
- Utiliser la galerie avec une photo haute qualité

---

## 🆚 Comparaison des Options

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| **Webcam Mac** | ✅ Expérience réaliste<br>✅ Test en conditions réelles<br>✅ Démo live possible | ⚠️ Configuration requise<br>⚠️ Qualité webcam Mac |
| **Galerie** | ✅ Photo haute qualité<br>✅ Contrôle total<br>✅ Reproductible | ⚠️ Pas en temps réel<br>⚠️ Moins immersif |
| **Smartphone réel** | ✅ ✅ ✅ Idéal pour tout | ⚠️ Nécessite appareil Android |

---

## 📱 Alternative : Tester sur Smartphone Réel

Si la webcam ne fonctionne pas bien, utilisez un smartphone Android :

```bash
# Sur votre smartphone :
1. Installez Expo Go
2. Scannez le QR code du terminal Expo
3. Testez la caméra en conditions réelles
```

**Avantage :** Qualité photo optimale, expérience 100% réaliste

---

## 🎯 Ce Qui a Été Modifié

### Fichier : `src/screens/CameraCaptureScreen.js`

**Changements :**

1. ✅ **Suppression détection émulateur** : Toujours proposer caméra + galerie
2. ✅ **Deux boutons sur tous les devices** :
   - "Capturer" → Utilise la caméra (webcam sur émulateur)
   - "Ou choisir dans la galerie" → Galerie

3. ✅ **Web reste galerie uniquement** : La webcam Web nécessite des permissions complexes

### Résultat

```
Sur Android (émulateur ou réel) :
┌────────────────────────────┐
│   [Vue Caméra en Direct]   │
│   (Votre visage via webcam)│
└────────────────────────────┘
         ▼
   [Capturer] 📸
         ▼
[Ou choisir dans la galerie] 🖼️
```

---

## ✅ Checklist de Démarrage

- [ ] Arrêter l'émulateur actuel
- [ ] Lancer `./start-emulator-with-webcam.sh`
- [ ] Attendre 30-60s
- [ ] Vérifier que l'émulateur est démarré
- [ ] Dans terminal Expo, appuyer `a`
- [ ] Tester caméra dans l'app
- [ ] Autoriser accès caméra
- [ ] Capturer votre visage
- [ ] Vérifier analyse IA

---

## 🎉 Résultat Final

Vous obtenez maintenant :

✅ **Caméra fonctionnelle** avec votre webcam Mac  
✅ **Choix Caméra + Galerie** sur tous les devices  
✅ **Analyse IA en temps réel** possible  
✅ **Expérience complète** pour la démo  

---

**Prêt à tester ? Lancez le script et c'est parti !** 🚀

```bash
./start-emulator-with-webcam.sh
```
