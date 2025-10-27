import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Platform,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    getImpactStats,
    getRefillHistory,
    getUserAnswers,
    getSelectedProducts,
    getUserProfile,
} from '../utils/storage';
import { formatImpactStats } from '../utils/recommendations';
import { colors as lightColors, darkColors, spacing, radius, shadow, typography, withTheme } from '../styles/theme';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import { useTheme } from '../styles/ThemeProvider';

export default function DashboardScreen({ navigation }) {
    const { isDark, colors } = useTheme();

    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [profile, setProfile] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        const [impactStats, refillHistory, answers, products, profileData] = await Promise.all([
            getImpactStats(),
            getRefillHistory(),
            getUserAnswers(),
            getSelectedProducts(),
            getUserProfile(),
        ]);
        setStats(impactStats);
        setHistory(refillHistory);
        setUserProfile({ answers, products });
        setProfile(profileData);
    };

    useEffect(() => {
        let isMounted = true;
        (async () => {
            if (isMounted) {
                await loadData();
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const formattedStats = stats ? formatImpactStats(stats) : null;
    const availableDiscounts = (profile?.rewards?.discounts || []).filter((discount) => !discount.used);

    // Revenir à 4 cartes d'économies: argent, plastique, CO2, recharges
    const savingsKeys = ['money', 'plastic', 'co2', 'refills'];

    const openPreviousSummary = () => {
        const answers = userProfile?.answers || null;
        const bp = answers?._beautyProfile || null;
        if (!answers || !bp) {
            navigation.navigate('CameraCapture');
            return;
        }
        const hair = bp.ai?.hair || null;
        const analysis = {
            skinType: bp.ai?.skin_type || '—',
            needs: Array.isArray(bp.ai?.needs) ? bp.ai.needs : [],
            notes: Array.isArray(bp.ai?.notes) ? bp.ai.notes : (bp.rationale ? [bp.rationale] : []),
            hair: hair ? {
              type: hair.type || '--',
              density: hair.density || undefined,
              frizz: typeof hair.frizz === 'number' ? hair.frizz : undefined,
              shine: typeof hair.shine === 'number' ? hair.shine : undefined,
            } : undefined,
          };
        navigation.navigate('SkinSummary', { analysis, answers, photoBase64: null });
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
            <ScrollView
                style={[styles.container]}
                contentContainerStyle={[styles.content, { paddingBottom: spacing.xxxl * 2 }]} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
            {/* Hero riche avec gradient conservé (code couleur), plus aéré */}
            <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.heroBanner, { borderColor: colors.border }]}
            >
                <View style={styles.bannerHeader}>
                    <View style={styles.bannerTextContainer}>
                        <Text style={[styles.bannerGreeting, { color: colors.textInverse }]}>Bonjour 👋</Text>
                        <Text style={[styles.bannerName, { color: colors.textInverse }]}>{profile?.name || 'Beauty Pioneer'}</Text>
                    </View>
                    <TouchableOpacity style={[styles.profileAvatarButton, { backgroundColor: colors.background }]} onPress={() => navigation.navigate('Profile')}>
                        <AppIcon name="person" provider="Ionicons" size={22} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.bannerSubtitle, { color: colors.textInverse, opacity: 0.9 }]}>Suivez votre impact environnemental</Text>
                {/* Centrer davantage le CTA principal */}
                <View style={{ marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
                  <AppButton label="Analyse visage IA" icon={{ name: 'scan', provider: 'Ionicons' }} onPress={() => navigation.navigate('CameraCapture')} style={{ minWidth: 240, alignSelf: 'center' }} />
                  {/* Remplacer le bouton Historique par "Mon précédent bilan" en dessous */}
                  <AppButton variant="subtle" label="Mon précédent bilan" icon={{ name: 'document-text', provider: 'Ionicons' }} onPress={openPreviousSummary} style={{ marginTop: spacing.sm, alignSelf: 'center' }} />
                </View>
            </LinearGradient>

            {/* Économies réalisées – cartes gradient */}
            {formattedStats ? (
                <View style={[styles.section, { paddingHorizontal: spacing.xl }]}> 
                    <View style={styles.sectionHeader}>
                        <AppIcon name="trending-up" provider="Feather" size={22} color={colors.textPrimary} />
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Économies réalisées</Text>
                    </View>
                    <View style={styles.statsGrid}> 
                        {savingsKeys.map((k, index) => {
                            const stat = formattedStats[k];
                            if (!stat) return null;
                            const grad = index === 0
                              ? [colors.primaryLight, colors.surface]
                              : index === 1
                              ? [colors.accentLight, colors.surface]
                              : index === 2
                              ? [colors.primarySoft, colors.surface]
                              : [colors.backgroundAlt, colors.surface];
                            return (
                                <View key={`saving-${k}`} style={styles.statCard}>
                                    <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statGradient}>
                                        <View style={[styles.statIconWrapper, { backgroundColor: colors.background }]}> 
                                            <AppIcon name={stat.icon?.name} provider={stat.icon?.provider} size={22} color={index === 1 ? colors.accent : colors.primary} />
                                        </View>
                                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value} {stat.unit}</Text>
                                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                                        {stat.equivalence ? <Text style={[styles.statEquivalence, { color: colors.textMuted }]}>{stat.equivalence}</Text> : null}
                                    </LinearGradient>
                                </View>
                            );
                        })}
                    </View>
                </View>
            ) : null}

            {/* Objectifs */}
            <View style={[styles.section, { paddingHorizontal: spacing.xl }]}> 
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Objectifs 2025</Text>
                <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Réduction plastique</Text>
                        <Text style={[styles.progressValue, { color: colors.textPrimary }]}> {stats ? Math.min(100, Math.round((stats.plasticSaved / 20000) * 100)) : 0}%</Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: colors.backgroundAlt }]}>
                        <View style={[styles.progressFill, { width: `${stats ? Math.min(100, (stats.plasticSaved / 20000) * 100) : 0}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[styles.progressCaption, { color: colors.textMuted }]}>Objectif : 20 kg économisés par utilisateur</Text>
                </View>
                <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Réduction CO₂</Text>
                        <Text style={[styles.progressValue, { color: colors.textPrimary }]}>{stats ? Math.min(100, Math.round((stats.co2Saved / 10) * 100)) : 0}%</Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: colors.backgroundAlt }]}>
                        <View style={[styles.progressFill, { width: `${stats ? Math.min(100, (stats.co2Saved / 10) * 100) : 0}%`, backgroundColor: colors.accent }]} />
                    </View>
                    <Text style={[styles.progressCaption, { color: colors.textMuted }]}>Objectif : 10 kg CO₂ évités</Text>
                </View>
            </View>

            {/* Récompenses */}
            <View style={[styles.section, { paddingHorizontal: spacing.xl }]}> 
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Vos Récompenses</Text>
                <View style={styles.badgesGrid}>
                    {(profile?.rewards?.badges || []).length === 0 ? (
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>Aucun badge débloqué pour le moment</Text>
                    ) : (
                        profile.rewards.badges.map((badge, index) => (
                            <View key={`dashboard-badge-${badge.id || index}`} style={[styles.badge, { backgroundColor: colors.surface }]}> 
                                <Text style={styles.badgeEmoji}>{badge.icon || '⭐'}</Text>
                                <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>{badge.name}</Text>
                            </View>
                        ))
                    )}
                </View>
            </View>

            {/* Encouragement */}
            <View style={[styles.encouragement, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Text style={[styles.encouragementTitle, { color: colors.textPrimary }]}> 
                    {stats && stats.totalRefills > 0 ? '🎉 Bravo pour votre engagement éco-responsable !' : '🌿 Démarrez votre aventure beauté durable'}
                </Text>
                <Text style={[styles.encouragementText, { color: colors.textSecondary }]}> 
                    {stats && stats.totalRefills > 0
                        ? `Vous avez évité l'équivalent de ${stats.bottlesSaved} bouteilles plastiques et économisé ${(stats.moneySaved||0).toFixed(2)} €.`
                        : 'Scannez votre peau avec notre IA pour découvrir les produits Vaseline adaptés.'}
                </Text>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    content: { flexGrow: 1 },

    heroBanner: {
        marginHorizontal: spacing.xl,
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
        padding: spacing.xxl,
        minHeight: 170,
        borderRadius: radius.xxl,
        overflow: 'hidden',
        ...shadow.strong,
    },
    bannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    bannerTextContainer: { flex: 1, marginRight: spacing.md },
    bannerGreeting: { ...typography.label, marginBottom: spacing.xs },
    bannerName: { ...typography.h1 },
    profileAvatarButton: { width: 48, height: 48, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', ...shadow.soft },
    bannerSubtitle: { ...typography.body },

    section: { marginBottom: spacing.xl },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
    sectionTitle: { ...typography.h3 },

    // Gradient stats (revival)
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    statCard: { width: '47%', borderRadius: radius.xl, overflow: 'hidden', ...shadow.card },
    statGradient: { padding: spacing.xl, minHeight: 180, justifyContent: 'space-between' },
    statIconWrapper: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, ...shadow.soft },
    statValue: { ...typography.h3 },
    statLabel: { ...typography.label },
    statEquivalence: { ...typography.caption },

    // Progress
    progressCard: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.md, marginTop: spacing.sm, ...shadow.soft },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    progressLabel: { ...typography.label },
    progressValue: { ...typography.label },
    progressBar: { height: 10, borderRadius: radius.full, overflow: 'hidden', marginBottom: spacing.sm },
    progressFill: { height: '100%', borderRadius: radius.full },
    progressCaption: { ...typography.caption },

    // Badges
    badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.xl },
    badge: { width: '22%', paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.lg, ...shadow.soft },
    badgeEmoji: { fontSize: 20, marginBottom: spacing.xs },
    badgeLabel: { ...typography.caption, textAlign: 'center' },

    // Encouragement
    encouragement: { marginHorizontal: spacing.xl, marginBottom: spacing.lg, padding: spacing.lg, borderRadius: radius.xl, borderWidth: 1, ...shadow.soft },
    encouragementTitle: { ...typography.h4, marginBottom: spacing.xs },
    encouragementText: { ...typography.body },
});
