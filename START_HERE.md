# 🚀 Quick Start - Eco-Refill AI Station

## ⚡ Démarrage Rapide (2 minutes)

### Option 1: Navigateur Web (Le Plus Rapide!)

```bash
npm run web
```

✅ Ouvrez votre navigateur à: http://localhost:8083

C'est tout! Aucune installation supplémentaire nécessaire.

---

### Option 2: Sur Votre Téléphone (Recommandé)

**Étape 1**: Installez Expo Go
- iOS: https://apps.apple.com/app/expo-go/id982107779
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent

**Étape 2**: Lancez le serveur
```bash
npm start
```

**Étape 3**: Scannez le QR code
- **iOS**: Ouvrez l'app Appareil Photo → Scannez
- **Android**: Ouvrez Expo Go → Scannez

✅ L'app se lance automatiquement!

---

## 🎯 Vous n'avez PAS besoin de:

❌ Xcode (pour iOS)  
❌ Android Studio (pour Android)  
❌ Configuration complexe  
❌ Compte développeur Apple  

Utilisez simplement **Expo Go** ou **le navigateur web**!

---

## 📱 Comparaison des Méthodes

| Méthode | Installation | Vitesse | Recommandé pour |
|---------|--------------|---------|-----------------|
| **Web** | Aucune | ⚡⚡⚡ Instantané | Tests rapides, démos |
| **Expo Go (téléphone)** | 5 min | ⚡⚡ Rapide | Tests réalistes, démos clients |
| **Simulateur iOS** | 2-3 heures | ⚡ Lent | Développement professionnel |
| **Émulateur Android** | 1-2 heures | ⚡ Lent | Développement professionnel |

---

## 🐛 Problèmes Fréquents

### "Port 8081 is already in use"

**Solution**: Expo proposera un autre port automatiquement
```
? Use port 8083 instead? › (Y/n)
```
Appuyez sur `Y`

---

### "Unable to run simctl" (iOS)

**Cause**: Xcode n'est pas installé

**Solutions**:
1. **RECOMMANDÉ**: Utilisez Expo Go sur votre iPhone
   ```bash
   npm start
   # Scannez le QR code avec votre téléphone
   ```

2. **OU** utilisez la version web:
   ```bash
   npm run web
   ```

3. **OU** installez Xcode (gratuit mais ~12GB, 2-3h):
   - App Store → Rechercher "Xcode"
   - Installer
   - Configurer:
     ```bash
     sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
     sudo xcodebuild -license accept
     ```

---

### Je ne peux pas scroller sur le web

**Solutions testées**:

1. **Rafraîchir la page**: `Cmd+R` (Mac) ou `Ctrl+R` (Windows)
2. **Vider le cache**: `Cmd+Shift+R` ou `Ctrl+Shift+R`
3. **Essayer un autre navigateur**: Chrome, Firefox, ou Safari
4. **Vérifier la console**: `F12` → Console → Vérifier les erreurs

Si le problème persiste:
```bash
# Arrêter le serveur (Ctrl+C)
# Nettoyer et relancer
npm start -- --clear
# Puis 'w' pour ouvrir le web
```

---

### L'app ne se charge pas sur mon téléphone

**Checklist**:
- [ ] Expo Go est installé
- [ ] Téléphone et ordinateur sur le **même WiFi**
- [ ] Pas de VPN actif
- [ ] Firewall désactivé ou autorise Expo

**Test rapide**:
```bash
npm start
# Dans le terminal, tapez 's' pour choisir le mode tunnel
```

---

## 📝 Commandes Utiles

```bash
# Démarrer le serveur
npm start

# Ouvrir automatiquement dans le web
npm run web

# Nettoyer le cache
npm start -- --clear

# Voir tous les appareils connectés
# (Après npm start, tapez 'shift+m')
```

---

## 🎓 Pour la Démo/Présentation

**Configuration Recommandée**:

1. **Avant la présentation**:
   ```bash
   npm run web
   ```
   Gardez l'onglet ouvert

2. **Pour montrer sur téléphone**:
   - Utilisez Expo Go
   - Ou enregistrez une vidéo à l'avance

3. **Plan B**: Captures d'écran dans `/assets`

---

## ✅ Checklist de Démarrage

- [ ] `npm install` exécuté
- [ ] Aucune erreur dans l'installation
- [ ] `npm start` fonctionne
- [ ] QR code visible dans le terminal
- [ ] Expo Go installé sur le téléphone (optionnel)
- [ ] Web accessible sur localhost

---

## 🆘 Besoin d'Aide?

1. **Vérifier**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. **Logs**: Regarder la console du terminal
3. **Réinitialiser**: 
   ```bash
   rm -rf node_modules
   npm install
   npm start
   ```

---

**💡 Astuce Pro**: Pour une démo rapide, utilisez toujours `npm run web` - c'est instantané et fonctionne partout!
