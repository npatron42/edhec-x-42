# 🎨 Guide de Style UI/UX - Vaseline Smart Refill Station

## 🎯 Philosophie de design

L'interface de l'application Vaseline Smart Refill Station suit une approche **premium, éco-responsable et moderne** avec :
- **Clarté** : Hiérarchie visuelle évidente
- **Profondeur** : Utilisation de gradients et ombres
- **Cohérence** : Design system unifié
- **Accessibilité** : Contraste et tailles optimales

---

## 🎨 Palette de couleurs

### Couleurs primaires
```javascript
colors.primary = '#1E88E5'          // Bleu Vaseline principal
colors.primaryDark = '#1565C0'      // Bleu foncé pour emphasis
colors.primaryMuted = '#42A5F5'     // Bleu clair pour dégradés
colors.primaryLight = '#E3F2FD'     // Fond bleu très clair
colors.primaryPale = '#BBDEFB'      // Accents subtils
```

### Couleurs d'accent
```javascript
colors.accent = '#4CAF50'           // Vert éco-responsable
colors.accentDark = '#388E3C'       // Vert foncé
colors.accentLight = '#E8F5E9'      // Fond vert clair
colors.primarySoft = '#66BB6A'      // Vert doux
```

### Couleurs de surface
```javascript
colors.surface = '#FFFFFF'          // Blanc pur pour cards
colors.surfaceAlt = '#F5F5F5'       // Gris très clair
colors.background = '#FAFAFA'       // Fond général
```

### Couleurs de texte
```javascript
colors.textPrimary = '#212121'      // Texte principal (noir)
colors.textSecondary = '#757575'    // Texte secondaire (gris)
colors.textMuted = '#9E9E9E'        // Texte désactivé
```

### Usage
```javascript
// Hero section avec gradient
<LinearGradient
  colors={[colors.primary, colors.primaryMuted]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  {/* Contenu */}
</LinearGradient>

// Card avec fond alternés
<LinearGradient
  colors={
    index % 2 === 0
      ? [colors.primaryLight, colors.surface]
      : [colors.accentLight, colors.surface]
  }
>
  {/* Contenu */}
</LinearGradient>
```

---

## 📐 Typographie

### Système de taille
```javascript
typography.h1 = {
  fontSize: 32,
  fontWeight: '700',
  lineHeight: 40,
  letterSpacing: -0.5,
}

typography.h2 = {
  fontSize: 28,
  fontWeight: '700',
  lineHeight: 36,
  letterSpacing: -0.3,
}

typography.h3 = {
  fontSize: 24,
  fontWeight: '600',
  lineHeight: 32,
}

typography.h4 = {
  fontSize: 18,
  fontWeight: '600',
  lineHeight: 26,
}

typography.body = {
  fontSize: 16,
  fontWeight: '400',
  lineHeight: 24,
}

typography.label = {
  fontSize: 14,
  fontWeight: '600',
  lineHeight: 20,
}

typography.caption = {
  fontSize: 12,
  fontWeight: '400',
  lineHeight: 18,
}
```

### Usage
```javascript
// Titre principal
<Text style={[styles.title, typography.h1]}>Mon Titre</Text>

// Ou directement dans styles
const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
});
```

---

## 📏 Espacement

### Échelle
```javascript
spacing.xs = 4      // Très petit
spacing.sm = 8      // Petit
spacing.md = 12     // Moyen
spacing.lg = 16     // Grand
spacing.xl = 24     // Très grand
spacing.xxl = 32    // Énorme
spacing.xxxl = 48   // Maximum
```

### Règles d'usage
- **Entre sections** : `spacing.xl` ou `spacing.xxl`
- **Entre éléments d'une section** : `spacing.md` ou `spacing.lg`
- **Padding de cards** : `spacing.lg` ou `spacing.xl`
- **Gap entre éléments inline** : `spacing.xs` ou `spacing.sm`

### Exemples
```javascript
// Section spacing
<View style={{ marginBottom: spacing.xl }}>

// Card padding
<View style={{ padding: spacing.lg }}>

// Gap entre icône et texte
<View style={{ flexDirection: 'row', gap: spacing.sm }}>
```

---

## 🔲 Radius (Bordures arrondies)

### Échelle
```javascript
radius.sm = 4       // Très petit
radius.md = 8       // Petit
radius.lg = 12      // Moyen
radius.xl = 16      // Grand
radius.xxl = 24     // Très grand
radius.full = 9999  // Cercle parfait
```

### Usage
- **Boutons** : `radius.lg` ou `radius.xl`
- **Cards** : `radius.xl` ou `radius.xxl`
- **Badges** : `radius.full`
- **Icônes circulaires** : `radius.full`
- **Tags** : `radius.full` ou `radius.lg`

### Exemples
```javascript
// Card moderne
<View style={{ borderRadius: radius.xl }}>

// Badge circulaire
<View style={{
  borderRadius: radius.full,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
}}>

// Avatar
<View style={{
  width: 48,
  height: 48,
  borderRadius: radius.full,
}}>
```

---

## 🌓 Ombres

### Échelle
```javascript
shadow.sm = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
}

shadow.md = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}

shadow.lg = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
}

shadow.xl = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 10,
}
```

### Usage
- **Cards normales** : `shadow.sm` ou `shadow.md`
- **Cards en avant** : `shadow.lg`
- **Modals et overlays** : `shadow.xl`
- **Boutons CTA** : `shadow.md`

### Exemples
```javascript
// Card avec ombre
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow.md,
  },
});
```

---

## 🎨 Composants de base

### 1. Hero Section
```javascript
<LinearGradient
  colors={[colors.primary, colors.primaryMuted]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.hero}
>
  <View style={styles.heroContent}>
    <Text style={styles.heroTitle}>Titre</Text>
    <Text style={styles.heroSubtitle}>Sous-titre</Text>
  </View>
</LinearGradient>

const styles = StyleSheet.create({
  hero: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    ...shadow.lg,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.background,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.background,
    opacity: 0.9,
  },
});
```

### 2. Card moderne
```javascript
<View style={styles.card}>
  <LinearGradient
    colors={[colors.surface, colors.primaryLight]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.cardGradient}
  >
    {/* Contenu */}
  </LinearGradient>
</View>

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.md,
  },
  cardGradient: {
    padding: spacing.lg,
  },
});
```

### 3. Badge informatif
```javascript
<View style={styles.badge}>
  <AppIcon name="leaf" provider="Ionicons" size={14} color={colors.primarySoft} />
  <Text style={styles.badgeText}>Éco-responsable</Text>
</View>

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});
```

### 4. Stat Card avec icône
```javascript
<View style={styles.statCard}>
  <View style={styles.statIconWrapper}>
    <AppIcon name="leaf" provider="Ionicons" size={24} color={colors.primary} />
  </View>
  <Text style={styles.statValue}>1.2 kg</Text>
  <Text style={styles.statLabel}>CO₂ évité</Text>
</View>

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow.sm,
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
```

### 5. Bouton primaire
```javascript
<TouchableOpacity style={styles.primaryButton}>
  <AppIcon name="arrow-forward" provider="Ionicons" size={20} color={colors.background} />
  <Text style={styles.buttonText}>Continuer</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    gap: spacing.sm,
    ...shadow.md,
  },
  buttonText: {
    ...typography.label,
    color: colors.background,
  },
});
```

---

## 🎭 États interactifs

### Pressed (Appuyé)
```javascript
<TouchableOpacity
  activeOpacity={0.7}
  style={styles.button}
>
```

### Disabled (Désactivé)
```javascript
const styles = StyleSheet.create({
  buttonDisabled: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.6,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
```

### Selected (Sélectionné)
```javascript
const styles = StyleSheet.create({
  optionSelected: {
    backgroundColor: colors.primary,
    ...shadow.md,
  },
  textSelected: {
    color: colors.background,
  },
});
```

---

## 🔄 Animations (à implémenter)

### Fade In
```javascript
const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={{ opacity: fadeAnim }}>
  {/* Contenu */}
</Animated.View>
```

### Scale on Press
```javascript
const scaleAnim = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  Animated.spring(scaleAnim, {
    toValue: 0.95,
    friction: 3,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  Animated.spring(scaleAnim, {
    toValue: 1,
    friction: 3,
    useNativeDriver: true,
  }).start();
};

<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
  <TouchableOpacity
    onPressIn={handlePressIn}
    onPressOut={handlePressOut}
  >
    {/* Contenu */}
  </TouchableOpacity>
</Animated.View>
```

---

## ✅ Checklist pour nouveau composant

- [ ] Utilise les couleurs du design system
- [ ] Applique la typographie cohérente
- [ ] Respecte l'échelle d'espacement
- [ ] Utilise les radius appropriés
- [ ] Ajoute les ombres nécessaires
- [ ] Gère les états (pressed, disabled, selected)
- [ ] Teste sur iOS et Android
- [ ] Vérifie l'accessibilité (contraste, taille)
- [ ] Optimise les performances (gradients, animations)

---

## 📚 Ressources

### Icônes disponibles
- **Ionicons** : https://ionic.io/ionicons
- **MaterialCommunityIcons** : https://materialdesignicons.com/
- **Feather** : https://feathericons.com/

### Documentation
- **expo-linear-gradient** : https://docs.expo.dev/versions/latest/sdk/linear-gradient/
- **React Native Animated** : https://reactnative.dev/docs/animated

---

**Version** : 2.0  
**Dernière mise à jour** : 2024  
**Auteur** : Équipe Challenge EDHEC
