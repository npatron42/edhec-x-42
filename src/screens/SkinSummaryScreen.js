import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, radius, typography, shadow } from '../styles/theme';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import { useTheme } from '../styles/ThemeProvider';

export default function SkinSummaryScreen({ navigation, route }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { analysis, answers, photoBase64 } = route.params || {};

  // Dimensions d'affichage de l'image via aspectRatio
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const ratio = imgSize.w && imgSize.h ? imgSize.w / imgSize.h : 4 / 5;

  const faceBoxNorm = analysis?.face?.boxNormalized;
  const heatmap = analysis?.face?.heatmap; // { grid, values }

  const renderHeatmap = () => {
    if (!faceBoxNorm || !heatmap) return null;
    // La vue image est full width; sa hauteur est déterminée par aspectRatio
    // On récupère la largeur réelle de la carte image via onLayout plus bas
    // Ici, on s'appuie sur le style parent (100%) et l'aspectRatio pour le positionnement relatif.
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View
          style={{
            position: 'absolute',
            left: `${(faceBoxNorm.x) * 100}%`,
            top: `${(faceBoxNorm.y) * 100}%`,
            width: `${(faceBoxNorm.width) * 100}%`,
            height: `${(faceBoxNorm.height) * 100}%`,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.6)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {/* Grille heatmap rougeurs */}
          {(() => {
            const cells = [];
            const g = heatmap.grid || 16;
            const vals = heatmap.values || [];
            for (let y = 0; y < g; y++) {
              for (let x = 0; x < g; x++) {
                const i = y * g + x;
                const v = Math.min(1, Math.max(0, vals[i] || 0));
                const alpha = v * 0.65; // intensité
                cells.push(
                  <View
                    key={`c-${x}-${y}`}
                    style={{
                      position: 'absolute',
                      left: `${(x / g) * 100}%`,
                      top: `${(y / g) * 100}%`,
                      width: `${(1 / g) * 100}%`,
                      height: `${(1 / g) * 100}%`,
                      backgroundColor: `rgba(255, 0, 0, ${alpha})`,
                    }}
                  />
                );
              }
            }
            return cells;
          })()}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppHeader title="Analyse Complète" onBack={() => navigation.goBack()} compact />
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section avec Photo */}
        {photoBase64 ? (
          <View style={styles.heroCard}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
                style={styles.heroImage}
                resizeMode="cover"
                onLoad={(e) => {
                  const src = e?.nativeEvent?.source;
                  const w = src?.width; const h = src?.height;
                  if (w && h && (w !== imgSize.w || h !== imgSize.h)) {
                    setImgSize({ w, h });
                  }
                }}
              />
              {renderHeatmap()}
              
              {/* Badge de statut */}
              {faceBoxNorm ? (
                <View style={styles.badge}>
                  <AppIcon provider="Ionicons" name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.badgeText}>Visage détecté</Text>
                </View>
              ) : null}
            </View>
            
            {!faceBoxNorm ? (
              <View style={styles.warningCard}>
                <View style={styles.warningHeader}>
                  <AppIcon provider="Feather" name="alert-circle" size={20} color={colors.warning} />
                  <Text style={styles.warningTitle}>Visage non détecté</Text>
                </View>
                <Text style={styles.warningText}>
                  Prenez une photo bien cadrée avec votre visage centré et un bon éclairage pour une analyse optimale.
                </Text>
                <AppButton 
                  label="Reprendre une photo" 
                  onPress={() => navigation.navigate('CameraCapture')}
                  icon={{ name: 'camera', provider: 'Ionicons' }}
                  style={{ marginTop: spacing.md }}
                />
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Profil Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <AppIcon provider="Ionicons" name="person" size={20} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Votre Profil</Text>
          </View>
          
          <View style={styles.profileGrid}>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Type de peau</Text>
              <Text style={styles.profileValue}>{analysis?.skinType || 'Non déterminé'}</Text>
            </View>
            <View style={[styles.profileItem, styles.profileItemLast]}>
              <Text style={styles.profileLabel}>Besoins identifiés</Text>
              <Text style={styles.profileValue}>
                {analysis?.needs?.join(', ') || 'Aucun'}
              </Text>
            </View>
          </View>

          {/* Ajout section Cheveux si disponible */}
          {analysis?.hair ? (
            <View style={{ marginTop: spacing.lg }}>
              <Text style={{ ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm }}>Analyse Cheveux</Text>
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileLabel}>Type</Text>
                  <Text style={styles.profileValue}>{analysis.hair.type || '--'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileLabel}>Densité</Text>
                  <Text style={styles.profileValue}>{analysis.hair.density || '—'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileLabel}>Frisottis</Text>
                  <Text style={styles.profileValue}>{typeof analysis.hair.frizz === 'number' ? `${Math.round(analysis.hair.frizz * 100)}%` : '—'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileLabel}>Brillance</Text>
                  <Text style={styles.profileValue}>{typeof analysis.hair.shine === 'number' ? `${Math.round(analysis.hair.shine * 100)}%` : '—'}</Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>

        {/* Metrics Cards */}
        <Text style={styles.metricsTitle}>Analyse Détaillée</Text>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.primarySoft }]}>
            <View style={styles.metricIconContainer}>
              <AppIcon provider="Ionicons" name="sparkles" size={24} color={colors.primary} />
            </View>
            <Text style={styles.metricLabel}>Brillance</Text>
            <Text style={styles.metricValue}>{analysis?.metrics?.shineLevel || '—'}</Text>
            <Text style={styles.metricSubValue}>
              {(analysis?.metrics?.brightness * 100 || 0).toFixed(0)}%
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.accentLight }]}>
            <View style={styles.metricIconContainer}>
              <AppIcon provider="Ionicons" name="water" size={24} color={colors.warning} />
            </View>
            <Text style={styles.metricLabel}>Rougeurs</Text>
            <Text style={styles.metricValue}>{analysis?.metrics?.rednessLevel || '—'}</Text>
            <Text style={styles.metricSubValue}>
              {(analysis?.metrics?.redness * 100 || 0).toFixed(0)}%
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.accentLight }]}>
            <View style={styles.metricIconContainer}>
              <AppIcon provider="Ionicons" name="leaf" size={24} color={colors.accent} />
            </View>
            <Text style={styles.metricLabel}>Densité cheveux</Text>
            <Text style={styles.metricValue}>{analysis?.hair?.density || '—'}</Text>
            <Text style={styles.metricSubValue}>Analyse capillaire</Text>
          </View>
        </View>

        {/* Notes Section */}
        {analysis?.notes?.length ? (
          <View style={styles.notesCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <AppIcon provider="Ionicons" name="bulb" size={20} color={colors.info} />
              </View>
              <Text style={styles.sectionTitle}>Recommandations</Text>
            </View>
            {analysis.notes.map((n, i) => (
              <View key={`skinsummary-note-${i}-${String(n).slice(0,10)}`} style={styles.noteItem}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>{n}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <AppButton
            label="Découvrir mes produits"
            icon={{ name: 'arrow-forward-circle', provider: 'Ionicons' }}
            onPress={() => navigation.replace('ProductMatching', { answers })}
            style={styles.ctaButton}
          />
          <Text style={styles.ctaHelper}>
            Basé sur votre analyse personnalisée
          </Text>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  
  // Hero Section
  heroCard: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', marginBottom: spacing.lg, ...shadow.card },
  imageContainer: { width: '100%', aspectRatio: 1, position: 'relative', backgroundColor: colors.border },
  heroImage: { ...StyleSheet.absoluteFillObject },
  badge: { position: 'absolute', top: spacing.md, right: spacing.md, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceElevated, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, gap: spacing.xs, ...shadow.soft },
  badgeText: { ...typography.labelSmall, color: colors.success, fontWeight: '600' },
  
  // Warning Card
  warningCard: { padding: spacing.lg, backgroundColor: colors.backgroundAlt },
  warningHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  warningTitle: { ...typography.h4, color: colors.warning },
  warningText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  
  // Section Card
  sectionCard: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.soft },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  iconCircle: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  
  // Profile Grid
  profileGrid: { gap: spacing.lg },
  profileItem: { paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  profileItemLast: { borderBottomWidth: 0, paddingBottom: 0 },
  profileLabel: { ...typography.labelSmall, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.xs },
  profileValue: { ...typography.bodyLarge, color: colors.textPrimary, fontWeight: '600' },
  
  // Metrics
  metricsTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.lg, paddingHorizontal: spacing.xs },
  metricsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  metricCard: { flex: 1, borderRadius: radius.xl, padding: spacing.lg, alignItems: 'center', ...shadow.soft },
  metricIconContainer: { width: 48, height: 48, borderRadius: radius.full, backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  metricLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs, textAlign: 'center' },
  metricValue: { ...typography.h3, color: colors.textPrimary, fontWeight: '700', marginBottom: spacing.xs },
  metricSubValue: { ...typography.caption, color: colors.textMuted },
  
  // Notes Card
  notesCard: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.soft },
  noteItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md, paddingLeft: spacing.sm },
  noteDot: { width: 6, height: 6, borderRadius: radius.full, backgroundColor: colors.info, marginTop: 8 },
  noteText: { ...typography.body, color: colors.textSecondary, flex: 1, lineHeight: 22 },
  
  // CTA
  ctaContainer: { alignItems: 'center', marginTop: spacing.lg },
  ctaButton: { marginBottom: spacing.md },
  ctaHelper: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
