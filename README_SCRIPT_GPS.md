# 🤖 Script : set-gps-location.sh

## 📖 Description
Script interactif pour définir rapidement la position GPS sur l'émulateur Android.

## 🚀 Usage

### Lancement
```bash
./set-gps-location.sh
```

### Menu Interactif
```
📍 Configuration GPS de l'émulateur Android
===========================================

✅ Émulateur Android détecté

Sélectionnez une position GPS :
1) Nice, France (Côte d'Azur) - Par défaut
2) Paris, France (Tour Eiffel)
3) Marseille, France (Vieux Port)
4) Lyon, France (Place Bellecour)
5) Position personnalisée

Votre choix [1-5] (défaut: 1) : _
```

### Exemple 1 : Nice (par défaut)
```bash
$ ./set-gps-location.sh
# Appuyer sur Entrée (ou taper 1)

📍 Configuration GPS : Nice
   Latitude  : 43.7102
   Longitude : 7.2620

✅ Position GPS définie avec succès !

🎯 Prochaines étapes :
   1. Ouvrez l'app Vaseline Smart Refill
   2. Allez sur l'écran 'Bornes de Recharge'
   3. Autorisez l'accès à la localisation
   4. La carte devrait se centrer sur Nice
```

### Exemple 2 : Paris
```bash
$ ./set-gps-location.sh
# Taper 2 et Entrée

📍 Configuration GPS : Paris
   Latitude  : 48.8584
   Longitude : 2.2945

✅ Position GPS définie avec succès !
```

### Exemple 3 : Position Personnalisée
```bash
$ ./set-gps-location.sh
# Taper 5 et Entrée

Latitude (ex: 43.7102) : 45.7640
Longitude (ex: 7.2620) : 4.8357

📍 Configuration GPS : Position personnalisée
   Latitude  : 45.7640
   Longitude : 4.8357

✅ Position GPS définie avec succès !
```

## 🌍 Positions Prédéfinies

| Ville | Latitude | Longitude | Lieu |
|-------|----------|-----------|------|
| **Nice** | 43.7102 | 7.2620 | Côte d'Azur |
| **Paris** | 48.8584 | 2.2945 | Tour Eiffel |
| **Marseille** | 43.2965 | 5.3698 | Vieux Port |
| **Lyon** | 45.7578 | 4.8320 | Place Bellecour |

## ⚠️ Prérequis

### 1. ADB Installé
Le script nécessite `adb` (Android Debug Bridge).

**Vérifier** :
```bash
adb --version
# Android Debug Bridge version 1.0.41
```

**Installer si absent** :
```bash
# macOS (Homebrew)
brew install android-platform-tools

# Linux (Ubuntu/Debian)
sudo apt-get install android-tools-adb

# Windows
# Télécharger depuis : https://developer.android.com/studio/releases/platform-tools
```

### 2. Émulateur Android Lancé
```bash
# Lancer l'émulateur
npm run android

# Vérifier qu'il est connecté
adb devices
# emulator-5554	device
```

## 🚨 Troubleshooting

### Erreur : "adb n'est pas installé"
**Solution** :
```bash
# macOS
brew install android-platform-tools

# Vérifier
adb --version
```

### Erreur : "Aucun émulateur Android détecté"
**Solution** :
```bash
# Lancer l'émulateur d'abord
npm run android

# Attendre 30 secondes, puis relancer le script
./set-gps-location.sh
```

### Erreur : "Erreur lors de la configuration GPS"
**Solution** :
```bash
# Vérifier la connexion adb
adb devices

# Redémarrer le serveur adb si besoin
adb kill-server
adb start-server

# Relancer le script
./set-gps-location.sh
```

## 🎯 Cas d'Usage

### Test Local (Nice)
Pour tester l'app avec les bornes de recharge autour de Nice :
```bash
./set-gps-location.sh  # Sélectionner 1 (Nice)
```

### Test National (Paris)
Pour simuler un utilisateur parisien :
```bash
./set-gps-location.sh  # Sélectionner 2 (Paris)
```

### Test Personnalisé
Pour tester une position spécifique (ex: Lille) :
```bash
./set-gps-location.sh  # Sélectionner 5
# Entrer : 50.6292, 3.0573
```

## 📝 Notes Techniques

### Format des Coordonnées
⚠️ **Important** : La commande `adb emu geo fix` utilise le format `longitude latitude` (inversé !).

**Exemple** :
```bash
# Nice : Latitude 43.7102, Longitude 7.2620
adb emu geo fix 7.2620 43.7102
#                 ↑       ↑
#              longitude latitude
```

### Permissions
Le script est automatiquement rendu exécutable lors de sa création. Si besoin :
```bash
chmod +x set-gps-location.sh
```

## 🔗 Voir Aussi

- **GPS_QUICK_SETUP.md** - Setup GPS en 30 secondes
- **GPS_LOCATION_GUIDE.md** - Guide complet de configuration GPS
- **TEST_GPS_QUICK.md** - Test rapide GPS (3 minutes)

## 📄 Licence
MIT

---

**✅ Script créé par** : GitHub Copilot  
**📅 Date** : 2025-01-XX  
**🎯 Version** : 1.0
