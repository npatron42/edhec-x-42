import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import { spacing, radius, typography, shadow } from '../styles/theme';
import { fetchEnvSignals } from '../env/openMeteo';
import { doveProducts } from '../data/products';
import { analyzeWithGemini } from '../ai/geminiAnalysis';
import { saveUserAnswers } from '../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/ThemeProvider';
import Header from './Header';

export default function BeautyAnalysisScreen({ route, navigation }){
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // Spinner animé pour l'état de chargement
  const Spinner = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      const loop = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 900,
          easing: undefined,
          useNativeDriver: true,
        })
      );
      loop.start();
      return () => rotateAnim.stopAnimation();
    }, [rotateAnim]);

    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        accessibilityRole="progressbar"
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          borderWidth: 4,
          borderColor: 'rgba(0,0,0,0.08)',
          borderTopColor: colors.primary,
          transform: [{ rotate: spin }],
        }}
      />
    );
  };

  const { base64, coords } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState([]);

  const screenHeight = Dimensions.get('screen').height;
  const headerHeight = screenHeight / 5;
  const headerOffset = Math.ceil(headerHeight) + spacing.xl; // offset accru sous le header

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        if (Platform.OS === 'web') {
          console.warn('[AI] Web: appels directs API possibles erreurs CORS. Préférez iOS/Android.');
        }
        console.log('[AI] Début analyse (monolithique)', { hasBase64: !!base64, coords });
        const env = coords ? await fetchEnvSignals(coords) : {};
        console.log('[AI] Signaux environnement', env);

        // Appel monolithique: image + environnement + catalogue produits
        let analysis = null; let outRecs = []; let rationale = '';
        try {
          const res = await analyzeWithGemini({ base64, envSignals: env, products: doveProducts });
          analysis = res?.analysis || {};
          outRecs = Array.isArray(res?.recommendations) ? res.recommendations : [];
          rationale = typeof res?.rationale === 'string' ? res.rationale : '';
        } catch (gerr) {
          console.error('[AI] Pipeline monolithique KO', { code: gerr?.code, message: gerr?.message });
          const msg = gerr?.message?.includes('Timeout') ? 'Délai dépassé. Réessayez dans un instant.' : (gerr?.code === 429 ? 'Quota IA dépassé. Réessayez plus tard.' : 'Analyse IA indisponible. Vérifiez la connexion et la clé.');
          setError(msg);
          setProfile(null);
          setRecs([]);
          return;
        }

        if (!mounted) return;
        const p = {
          source: 'ai',
          ai: {
            skin_type: analysis?.skin_type || null,
            needs: Array.isArray(analysis?.needs) ? analysis.needs : [],
            notes: Array.isArray(analysis?.notes) ? analysis.notes : [],
            hair: analysis?.hair ? {
              type: analysis.hair.type ?? '--',
              density: analysis.hair.density ?? null,
              frizz: typeof analysis.hair.frizz === 'number' ? analysis.hair.frizz : null,
              shine: typeof analysis.hair.shine === 'number' ? analysis.hair.shine : null,
            } : { type: '--', density: null, frizz: null, shine: null },
          },
          rationale,
          env,
        };
        setProfile(p);
        setRecs(outRecs);

        // Sauvegarder automatiquement le dernier bilan IA (sans photo)
        try {
          const inferNeedsFromProfile = (pp) => {
            if (!pp) return [];
            if (Array.isArray(pp.ai?.needs) && pp.ai.needs.length) return pp.ai.needs.slice(0,3);
            const needs = [];
            if ((pp.hair_features?.frizz_proxy ?? 0) > 0.5) needs.push('réparation');
            if ((pp.image_quality?.exposure ?? 0.5) < 0.35) needs.push('éclat');
            if ((pp.skin_tone?.mst_bin ?? 4) <= 3) needs.push('hydratation');
            return Array.from(new Set([...(pp.needs||[]), ...needs])).slice(0,3);
          };
          const autoAnswers = {
            _beautyProfile: p,
            _aiRecs: Array.isArray(outRecs) ? outRecs.slice(0, 8) : [],
            step1: p?.ai?.skin_type || (p?.skin_tone ? (p.skin_tone.mst_bin <= 3 ? 'sec' : p.skin_tone.mst_bin >= 7 ? 'gras' : 'normal') : 'normal'),
            step2: (p?.env?.uv_index ?? 4) > 6 ? 'élevée' : (p?.env?.humidity ?? 50) > 70 ? 'moyenne' : 'faible',
            step3: (outRecs || []).map(r => r.category).slice(0,2),
            step4: inferNeedsFromProfile(p),
            step5: 'monthly',
          };
          await saveUserAnswers(autoAnswers);
          console.log('[AI] Bilan IA sauvegardé pour consultation ultérieure');
        } catch (persistErr) {
          console.warn('[AI] Impossible de sauvegarder le bilan IA', persistErr);
        }
      } catch(e){
        console.error('[AI] Erreur inattendue analyse', e);
        setError('Analyse IA indisponible. Réessayez plus tard.');
      } finally {
        setLoading(false);
        console.log('[AI] Fin analyse');
      }
    })();
    return () => { mounted = false; };
  }, [base64, coords?.latitude, coords?.longitude]);

  const inferNeedsFromProfile = (p) => {
    if (!p) return [];
    // Si l'IA a fourni des besoins, les utiliser
    if (Array.isArray(p.ai?.needs) && p.ai.needs.length) return p.ai.needs.slice(0,3);
    const needs = [];
    if ((p.hair_features?.frizz_proxy ?? 0) > 0.5) needs.push('réparation');
    if ((p.image_quality?.exposure ?? 0.5) < 0.35) needs.push('éclat');
    if ((p.skin_tone?.mst_bin ?? 4) <= 3) needs.push('hydratation');
    return Array.from(new Set([...(p.needs||[]), ...needs])).slice(0,3);
  };

  const mapSkinTypeToLabel = (p) => {
    const t = p?.ai?.skin_type;
    if (t) return String(t).charAt(0).toUpperCase() + String(t).slice(1);
    const mst = p?.skin_tone?.mst_bin;
    if (typeof mst === 'number') return `MST ${mst}`;
    return '—';
  };

  const handleContinue = async () => {
    if (!profile) return;
    const answers = {
      _beautyProfile: profile,
      // Joindre aussi la sélection IA (ordre conservé) pour le Tinder-like
      _aiRecs: Array.isArray(recs) ? recs.slice(0, 8) : [],
      // Si IA dispo, conserver son type de peau tel quel
      step1: profile?.ai?.skin_type || (profile?.skin_tone ? (profile.skin_tone.mst_bin <= 3 ? 'sec' : profile.skin_tone.mst_bin >= 7 ? 'gras' : 'normal') : 'normal'),
      step2: (profile?.env?.uv_index ?? 4) > 6 ? 'élevée' : (profile?.env?.humidity ?? 50) > 70 ? 'moyenne' : 'faible',
      step3: (recs || []).map(r => r.category).slice(0,2),
      step4: inferNeedsFromProfile(profile),
      step5: 'monthly',
    };
    try { await saveUserAnswers(answers); } catch {}
    console.log('[AI] Navigation vers ProductMatching avec réponses', answers);
    navigation.replace('ProductMatching', { answers });
  };

  const hairLabel = useMemo(() => {
    if (!profile) return '—';
    const t = profile.hair_type;
    const f = profile.hair_features || {};
    if (!t && !f) return '—';
    const parts = [];
    if (t) parts.push(t);
    if (typeof f.frizz_proxy === 'number') parts.push(`frisottis ${(f.frizz_proxy*100).toFixed(0)}%`);
    if (typeof f.shine_proxy === 'number') parts.push(`brillance ${(f.shine_proxy*100).toFixed(0)}%`);
    return parts.join(' • ') || '—';
  }, [profile]);

  if (!base64) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.center]}>
          <Header
            headerTitle="Analyse visage et cheveux"
            headerSubtitle="Scannez votre peau pour des recommandations personnalisées"
            navigation={navigation}
          />
          <View style={{ width: '100%', paddingHorizontal: spacing.lg, paddingTop: headerOffset }}>
            <Text style={styles.info}>Aucune photo. Reprenez une photo.</Text>
            <AppButton label="Ouvrir la caméra" onPress={() => navigation.replace('CameraCapture')} icon={{ name: 'camera', provider: 'Ionicons' }} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          headerTitle="Analyse visage et cheveux"
          headerSubtitle="Rapport IA et recommandations"
          navigation={navigation}
        />
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingTop: headerOffset }]}>
          <View style={styles.hero}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: `data:image/jpeg;base64,${base64}` }} style={styles.image} resizeMode="cover" />
              {loading ? (
                <View style={styles.loadingOverlay}>
                  <Spinner />
                  <Text style={styles.loadingText}>Analyse en cours…</Text>
                </View>
              ) : null}
            </View>
          </View>

          {error ? (
            <View style={styles.errorCard}>
              <View style={styles.rowCenter}>
                <AppIcon provider="Feather" name="alert-circle" size={18} color={colors.warning} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
              <AppButton label="Réessayer" onPress={() => navigation.replace('CameraCapture')} icon={{ name: 'camera', provider: 'Ionicons' }} style={{ marginTop: spacing.sm }} />
            </View>
          ) : null}

          {profile ? (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconCircle}><AppIcon provider="Ionicons" name="person" size={18} color={colors.primary} /></View>
                <Text style={styles.sectionTitle}>Profil Beauté</Text>
              </View>
              <View style={styles.rowBetween}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Type de peau</Text>
                  <Text style={styles.statValue}>{mapSkinTypeToLabel(profile)}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Besoins</Text>
                  <Text style={styles.statValue}>{(inferNeedsFromProfile(profile) || []).join(' • ') || '—'}</Text>
                </View>
              </View>
              {Array.isArray(profile?.ai?.notes) && profile.ai.notes.length ? (
                <View style={{ marginTop: spacing.md }}>
                  <Text style={{ ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs }}>Notes IA</Text>
                  {profile.ai.notes.slice(0,3).map((n, idx) => (
                    <Text key={`note-${idx}`} style={{ ...typography.caption, color: colors.textSecondary }}>• {String(n)}</Text>
                  ))}
                </View>
              ) : null}
              {profile?.rationale ? (
                <View style={{ marginTop: spacing.sm }}>
                  <Text style={{ ...typography.caption, color: colors.textMuted }}>Synthèse</Text>
                  <Text style={{ ...typography.caption, color: colors.textSecondary }}>{profile.rationale}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {profile?.env ? (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconCircle}><AppIcon provider="Ionicons" name="sunny" size={18} color={colors.accent} /></View>
                <Text style={styles.sectionTitle}>Environnement</Text>
              </View>
              <View style={styles.envRow}>
                <EnvPill label="UV" value={String(profile.env.uv_index)} />
                <EnvPill label="Humidité" value={`${Math.round(profile.env.humidity)}%`} />
                <EnvPill label="PM2.5" value={`${Math.round(profile.env.pm2_5)} µg/m³`} />
              </View>
            </View>
          ) : null}

          {recs?.length ? (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconCircle}><AppIcon provider="Ionicons" name="flask" size={18} color={colors.primary} /></View>
                <Text style={styles.sectionTitle}>Recommandations</Text>
              </View>
              {recs.slice(0,3).map((p, idx) => (
                <View key={`rec-${p.id}-${idx}`} style={styles.productRow}>
                  <Text style={styles.productEmoji}>{p.image || '🧴'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{p.name}</Text>
                    <Text style={styles.productDesc}>{p.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.bottomActions}>
            <AppButton label="Continuer" onPress={handleContinue} icon={{ name: 'arrow-forward', provider: 'Ionicons' }} disabled={loading || !profile} />
            <AppButton label="Reprendre une photo" variant="outline" onPress={() => navigation.replace('CameraCapture')} icon={{ name: 'camera', provider: 'Ionicons' }} style={{ marginTop: spacing.sm }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function EnvPill({ label, value}){
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md }}>
      <Text style={{ ...typography.caption, color: colors.textMuted }}>{label}</Text>
      <Text style={{ ...typography.label, color: colors.textPrimary }}>{value}</Text>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  hero: { marginBottom: spacing.lg },
  imageWrap: { width: '100%', aspectRatio: 1, backgroundColor: colors.border, borderRadius: radius.xl, overflow: 'hidden', ...shadow.soft },
  image: { width: '100%', height: '100%' },
  loadingOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  loadingText: { marginTop: spacing.xs, color: colors.textMuted },
  errorCard: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadow.soft, marginBottom: spacing.lg },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  errorText: { color: colors.warning, marginLeft: spacing.sm },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.soft },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  iconCircle: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.md },
  statLabel: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  statValue: { ...typography.bodyLarge, color: colors.textPrimary, fontWeight: '600' },
  envRow: { flexDirection: 'row', gap: spacing.sm },
  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.md },
  productEmoji: { fontSize: 28 },
  productName: { ...typography.bodyLarge, color: colors.textPrimary, fontWeight: '600' },
  productDesc: { ...typography.caption, color: colors.textSecondary },
  bottomActions: { marginTop: spacing.xl, paddingBottom: spacing.xl },
  info: { color: colors.textSecondary },
});
