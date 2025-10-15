import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Platform,
    TouchableOpacity,
} from 'react-native';
import {
    getImpactStats,
    getRefillHistory,
    getUserAnswers,
    getSelectedProducts,
    getUserProfile,
} from '../utils/storage';
import { formatImpactStats } from '../utils/recommendations';
import { colors, spacing, radius, shadow } from '../styles/theme';
import { AppButton, AppHeader, AppIcon } from '../components/common';

export default function DashboardScreen({ navigation }) {
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [profile, setProfile] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        (async () => {
            const profileData = await getUserProfile();
            setProfile(profileData);
        })();
    }, []);

    const loadData = async () => {
        const [impactStats, refillHistory, answers, products] = await Promise.all([
            getImpactStats(),
            getRefillHistory(),
            getUserAnswers(),
            getSelectedProducts(),
        ]);
        setStats(impactStats);
        setHistory(refillHistory);
        setUserProfile({ answers, products });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const formattedStats = stats ? formatImpactStats(stats) : null;
    const availableDiscounts = (profile?.rewards?.discounts || []).filter(
        (discount) => !discount.used,
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                />
            }
        >
            <AppHeader
                title="Mon Tableau de Bord"
                subtitle="Suivez votre impact environnemental"
            />

            <View style={styles.banner}>
                <Text style={styles.bannerTitle}>
                    Bonjour, {profile?.name || 'Eco-héros'} 👋
                </Text>
                <Text style={styles.bannerSubtitle}>
                    Retrouvez vos statistiques personnalisées et vos récompenses.
                </Text>
            </View>

            <AppButton
                label="Gérer mon profil et mes récompenses"
                icon={{ name: 'person-circle-outline', provider: 'Ionicons' }}
                onPress={() => navigation.navigate('Profile')}
                style={styles.profileButton}
            />

            {formattedStats ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Votre Impact Total</Text>
                    {Object.values(formattedStats).map((stat) => (
                        <View key={stat.label} style={styles.statCard}>
                            <View style={styles.statIconWrapper}>
                                <AppIcon
                                    name={stat.icon?.name}
                                    provider={stat.icon?.provider}
                                    size={28}
                                    color={colors.primary}
                                />
                            </View>
                            <View style={styles.statContent}>
                                <Text style={styles.statValue}>
                                    {stat.value} {stat.unit}
                                </Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                                {stat.equivalence ? (
                                    <Text style={styles.statEquivalence}>
                                        {stat.equivalence}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    ))}
                </View>
            ) : null}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Objectifs 2025</Text>
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Réduction plastique</Text>
                        <Text style={styles.progressValue}>
                            {stats
                                ? Math.min(
                                      100,
                                      Math.round((stats.plasticSaved / 20000) * 100),
                                  )
                                : 0}
                            %
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${
                                        stats
                                            ? Math.min(
                                                  100,
                                                  (stats.plasticSaved / 20000) * 100,
                                              )
                                            : 0
                                    }%`,
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressCaption}>
                        Objectif : 20 kg économisés par utilisateur
                    </Text>
                </View>
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Réduction CO₂</Text>
                        <Text style={styles.progressValue}>
                            {stats
                                ? Math.min(
                                      100,
                                      Math.round((stats.co2Saved / 10) * 100),
                                  )
                                : 0}
                            %
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${
                                        stats
                                            ? Math.min(100, (stats.co2Saved / 10) * 100)
                                            : 0
                                    }%`,
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressCaption}>
                        Objectif : 10 kg CO₂ évités
                    </Text>
                </View>
            </View>

            {userProfile?.products?.length ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vos Produits</Text>
                    {userProfile.products.map((product) => (
                        <View key={product.id} style={styles.productCard}>
                            <Text style={styles.productEmoji}>{product.image}</Text>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productDetails}>
                                    {product.benefits.slice(0, 2).join(' • ')}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : null}

            {history.length ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Historique des Recharges</Text>
                    {history.slice(0, 5).map((refill) => (
                        <View key={refill.id || refill.date} style={styles.historyItem}>
                            <View style={styles.historyIcon}>
                                <AppIcon
                                    name="refresh"
                                    provider="MaterialCommunityIcons"
                                    size={20}
                                    color={colors.primary}
                                />
                            </View>
                            <View style={styles.historyContent}>
                                <Text style={styles.historyDate}>
                                    {new Date(refill.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </Text>
                                <Text style={styles.historyProducts}>
                                    {refill.products.map((item) => item.name).join(', ')}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : null}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions rapides</Text>
                <View style={styles.actionsRow}>
                    <AppButton
                        label="Refaire le questionnaire"
                        icon={{ name: 'refresh', provider: 'MaterialCommunityIcons' }}
                        variant="outline"
                        onPress={() => navigation.navigate('Questionnaire')}
                        style={styles.actionButton}
                    />
                    <AppButton
                        label="Voir mon QR Code"
                        icon={{ name: 'qr-code', provider: 'Ionicons' }}
                        variant="outline"
                        onPress={() =>
                            navigation.navigate('QRCode', {
                                answers: userProfile?.answers || {},
                                selectedProducts: userProfile?.products || [],
                            })
                        }
                        style={styles.actionButton}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vos Récompenses</Text>
                <View style={styles.pointsRow}>
                    <AppIcon
                        name="medal-outline"
                        provider="MaterialCommunityIcons"
                        size={24}
                        color={colors.primary}
                        style={styles.pointsIcon}
                    />
                    <Text style={styles.pointsText}>
                        Points cumulés : {profile?.rewards?.points || 0}
                    </Text>
                </View>
                <View style={styles.badgesGrid}>
                    {(profile?.rewards?.badges || []).length === 0 ? (
                        <Text style={styles.emptyText}>
                            Aucun badge débloqué pour le moment
                        </Text>
                    ) : (
                        profile.rewards.badges.map((badge) => (
                            <View key={badge.id} style={styles.badge}>
                                <Text style={styles.badgeEmoji}>
                                    {badge.icon || '⭐'}
                                </Text>
                                <Text style={styles.badgeLabel}>{badge.name}</Text>
                            </View>
                        ))
                    )}
                </View>
                {availableDiscounts.length ? (
                    <View style={styles.discounts}>
                        <Text style={styles.sectionSubtitle}>
                            Réductions disponibles
                        </Text>
                        {availableDiscounts.map((discount) => (
                            <View key={discount.id} style={styles.discountItem}>
                                <View style={styles.discountInfo}>
                                    <Text style={styles.discountLabel}>
                                        {discount.label || '-5% sur produit'}
                                    </Text>
                                    <Text style={styles.discountCode}>
                                        {discount.code || 'Utilisable en borne'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.discountButton}
                                    onPress={() => navigation.navigate('Profile')}
                                >
                                    <Text style={styles.discountButtonText}>Utiliser</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            <View style={styles.encouragement}>
                <Text style={styles.encouragementTitle}>
                    {stats && stats.totalRefills > 0
                        ? '🎉 Bravo pour votre engagement !'
                        : '🌿 Commencez votre aventure éco-responsable'}
                </Text>
                <Text style={styles.encouragementText}>
                    {stats && stats.totalRefills > 0
                        ? `Vous avez évité l'équivalent de ${
                              stats.bottlesSaved
                          } bouteilles plastiques. Continuez comme ça !`
                        : 'Complétez le questionnaire pour découvrir les produits adaptés à vos besoins.'}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
        ...(Platform.OS === 'web' && {
            height: '100vh',
            overflow: 'auto',
        }),
    },
    content: {
        flexGrow: 1,
        paddingBottom: spacing.xxl,
        ...(Platform.OS === 'web' && {
            minHeight: '100vh',
        }),
    },
    banner: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    bannerSubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 20,
    },
    profileButton: {
        marginHorizontal: spacing.xl,
        marginBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.xl,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: spacing.sm,
    },
    statCard: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadow.card,
    },
    statIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    statEquivalence: {
        fontSize: 12,
        color: colors.primaryPale,
        marginTop: spacing.xs,
    },
    progressCard: {
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadow.soft,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    progressLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    progressValue: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
    },
    progressBar: {
        height: 10,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceAlt,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: radius.md,
        backgroundColor: colors.primary,
    },
    progressCaption: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: spacing.sm,
    },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.sm,
        ...shadow.soft,
    },
    productEmoji: {
        fontSize: 36,
        marginRight: spacing.lg,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    productDetails: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.sm,
        ...shadow.soft,
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    historyContent: {
        flex: 1,
    },
    historyDate: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    historyProducts: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    actionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexBasis: '48%',
        marginBottom: spacing.md,
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    pointsIcon: {
        marginRight: spacing.sm,
    },
    pointsText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.sm,
        marginBottom: spacing.md,
    },
    badge: {
        backgroundColor: colors.background,
        borderRadius: radius.md,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        marginHorizontal: spacing.sm,
        marginBottom: spacing.sm,
        minWidth: 110,
        ...shadow.soft,
    },
    badgeEmoji: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    badgeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: colors.textMuted,
    },
    discounts: {
        marginTop: spacing.lg,
    },
    discountItem: {
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...shadow.soft,
    },
    discountInfo: {
        flex: 1,
        marginRight: spacing.lg,
    },
    discountLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    discountCode: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    discountButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
    },
    discountButtonText: {
        color: colors.background,
        fontWeight: '700',
    },
    encouragement: {
        backgroundColor: colors.surfaceAlt,
        marginHorizontal: spacing.xl,
        marginBottom: spacing.xxl,
        padding: spacing.lg,
        borderRadius: radius.lg,
    },
    encouragementTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: spacing.sm,
    },
    encouragementText: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 20,
    },
});
