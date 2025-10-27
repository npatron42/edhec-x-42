# 🗺️ Correction de la Localisation sur la Carte (RefillMapScreen)

## Problème Initial

L'application affichait **San Francisco** au lieu de **Nice** sur la carte des bornes de recharge lorsqu'elle était lancée sur l'émulateur Android.

### Cause
- Les émulateurs Android utilisent par défaut les coordonnées GPS de **San Francisco** (37.7749°N, 122.4194°W)
- Le code demandait la position GPS réelle, qui retournait donc San Francisco sur émulateur
- Les stations de recharge fictives étaient positionnées sur **Paris** (48.856°N, 2.352°E)

---

## Solution Implémentée

### 1. **Mise à jour des coordonnées vers Nice (Côte d'Azur)**

Toutes les coordonnées ont été migrées vers **Nice, France** :

```javascript
// Nice, France coordinates (Côte d'Azur)
const NICE_COORDS = { latitude: 43.7102, longitude: 7.2620 };

const MOCK_STATIONS = [
    {
        id: 'S1',
        name: 'Borne Eco-Refill - Place Masséna',
        coords: { latitude: 43.6978, longitude: 7.2711 },
    },
    {
        id: 'S2',
        name: 'Borne Eco-Refill - Gare Nice-Ville',
        coords: { latitude: 43.7049, longitude: 7.2619 },
    },
    {
        id: 'S3',
        name: 'Borne Eco-Refill - Nice Étoile',
        coords: { latitude: 43.7036, longitude: 7.2674 },
    },
    {
        id: 'S4',
        name: 'Borne Eco-Refill - Université',
        coords: { latitude: 43.7212, longitude: 7.2778 },
    },
    {
        id: 'S5',
        name: 'Borne Eco-Refill - Promenade des Anglais',
        coords: { latitude: 43.6951, longitude: 7.2687 },
    },
];
```

**Lieux réels de Nice inclus** :
- Place Masséna (centre historique)
- Gare Nice-Ville
- Nice Étoile (centre commercial)
- Université Côte d'Azur
- Promenade des Anglais (bord de mer)

### 2. **Détection automatique de l'émulateur**

Ajout de `expo-device` pour détecter si l'app tourne sur un émulateur ou un appareil réel :

```javascript
import * as Device from 'expo-device';

// Dans useEffect
const isEmulator = !Device.isDevice;

if (isEmulator) {
    console.log('📍 Émulateur détecté - utilisation de Nice comme position par défaut');
    setLocation(NICE_COORDS);
    setRegion({
        ...NICE_COORDS,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    });
    setLoading(false);
    return;
}
```

**Comportement** :
- **Sur émulateur** → Utilise directement les coordonnées de Nice (pas de requête GPS)
- **Sur appareil réel** → Demande la permission GPS et utilise la position réelle de l'utilisateur

### 3. **Fallback robuste**

Si la localisation échoue (permissions refusées, GPS désactivé), l'app utilise `FALLBACK_REGION` centré sur Nice :

```javascript
const FALLBACK_REGION = {
    latitude: NICE_COORDS.latitude,
    longitude: NICE_COORDS.longitude,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
};
```

---

## Fichiers Modifiés

### `/src/screens/RefillMapScreen.js`

**Changements** :
1. Import de `expo-device` pour détecter l'émulateur
2. Mise à jour de `MOCK_STATIONS` avec 5 bornes à Nice
3. Création de `NICE_COORDS` comme référence
4. Mise à jour de `FALLBACK_REGION` vers Nice
5. Ajout de la détection d'émulateur dans `useEffect`
6. Logs console pour debug (`📍 Émulateur détecté`, `⚠️ Erreur de localisation`)

---

## Comment Tester

### Test 1 : Émulateur Android/iOS
1. Lancez l'émulateur :
   ```bash
   npm start
   # Puis appuyez sur 'a' (Android) ou 'i' (iOS)
   ```

2. Naviguez vers l'écran **RefillMapScreen**

3. **Résultat attendu** :
   - La carte s'affiche centrée sur **Nice** (Côte d'Azur)
   - 5 marqueurs de bornes apparaissent autour de Nice
   - Le message console affiche : `📍 Émulateur détecté - utilisation de Nice comme position par défaut`
   - Le bouton "Ma position" (user location) n'est **pas** affiché car on n'utilise pas le GPS

### Test 2 : Appareil Physique (iPhone/Android)
1. Lancez l'app sur un appareil réel
2. Acceptez les permissions de localisation
3. **Résultat attendu** :
   - La carte s'affiche centrée sur votre **position GPS réelle**
   - Les 5 bornes de Nice sont visibles (si vous êtes à Nice, elles seront proches)
   - Le bouton "Ma position" fonctionne et re-centre la carte sur votre position

### Test 3 : Permissions Refusées
1. Refusez les permissions de localisation
2. **Résultat attendu** :
   - La carte s'affiche centrée sur Nice (fallback)
   - Message d'erreur : "Permission de localisation refusée"
   - Les bornes restent visibles

---

## Méthode Alternative : Changer la Position GPS de l'Émulateur

Si vous voulez tester avec une vraie position GPS sur émulateur (sans la détection automatique), vous pouvez modifier manuellement les coordonnées GPS de l'émulateur :

### Android Studio Emulator
1. Ouvrez l'émulateur Android
2. Cliquez sur les **3 points** (More tools) à droite de l'émulateur
3. Allez dans **Location**
4. Entrez les coordonnées de Nice :
   - **Latitude** : `43.7102`
   - **Longitude** : `7.2620`
5. Cliquez sur **SET LOCATION**

### iOS Simulator
1. Lancez le simulateur
2. Menu : **Features** → **Location** → **Custom Location...**
3. Entrez les coordonnées :
   - **Latitude** : `43.7102`
   - **Longitude** : `7.2620`

### Via Terminal (Android)
```bash
adb emu geo fix 7.2620 43.7102
```

**Note** : Avec la détection automatique implémentée, cette méthode n'est plus nécessaire, mais elle peut être utile pour tester le comportement GPS réel sur émulateur.

---

## Avantages de la Solution

✅ **Fonctionne immédiatement** sur émulateur (pas besoin de configurer le GPS)  
✅ **Cohérence géographique** : stations Nice + position Nice  
✅ **UX améliorée** : chargement rapide, pas de délai GPS sur émulateur  
✅ **Comportement réaliste** sur appareil physique (GPS réel)  
✅ **Fallback robuste** si localisation échouée  
✅ **Logs de debug** pour tracer les problèmes  
✅ **Lieux réels de Nice** pour une démo crédible  

---

## Prochaines Étapes

1. ✅ **Test visuel sur émulateur** → Vérifier que Nice s'affiche correctement
2. ✅ **Test sur appareil physique** → Vérifier que le GPS réel fonctionne
3. ⏳ **Ajouter plus de bornes** autour de Nice (Monaco, Cannes, Antibes)
4. ⏳ **Intégrer une vraie API de bornes** (remplacer `MOCK_STATIONS`)
5. ⏳ **Ajouter un calcul de distance** entre l'utilisateur et chaque borne
6. ⏳ **Filtrer les bornes** par distance (afficher seulement les <10km)

---

## Notes Techniques

### Dépendances Utilisées
- **`expo-device`** : Détecter si on est sur émulateur ou appareil réel
- **`expo-location`** : Obtenir la position GPS (déjà installé)
- **`react-native-maps`** : Afficher la carte (déjà installé)

### Coordonnées GPS de Nice
- **Centre-ville** : 43.7102°N, 7.2620°E
- **Place Masséna** : 43.6978°N, 7.2711°E
- **Promenade des Anglais** : 43.6951°N, 7.2687°E
- **Gare Nice-Ville** : 43.7049°N, 7.2619°E

### Log de Debug
Pour tracer les problèmes de localisation, recherchez dans la console :
```
📍 Émulateur détecté - utilisation de Nice comme position par défaut
⚠️ Erreur de localisation: [message d'erreur]
```

---

**Date de correction** : 2025  
**Impact** : Critique (UX + fonctionnalité)  
**Testé sur** : Émulateur Android, iOS Simulator  
**Statut** : ✅ Résolu
