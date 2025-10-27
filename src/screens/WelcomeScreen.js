import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton, AppIcon, AppHeader } from '../components/common';
import { spacing, radius, typography, shadow } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const { width } = Dimensions.get('window');

const FEATURES = [
    {
        title: 'Analyse IA instantanée',
        description: 'Scannez votre peau avec la caméra pour un diagnostic personnalisé',
        icon: { provider: 'Ionicons', name: 'camera' },
    },
    {
        title: 'Match produits sur-mesure',
        description: 'Recevez les meilleures recommandations Dove adaptées à vos besoins',
        icon: { provider: 'Ionicons', name: 'sparkles' },
    },
    {
        title: 'Recharge en un scan',
        description: 'Utilisez votre QR Code personnalisé en borne',
        icon: { provider: 'MaterialCommunityIcons', name: 'qrcode-scan' },
    },
    {
        title: 'Impact & Récompenses',
        description: 'Gagnez des points, débloquez des badges et suivez votre impact éco',
        icon: { provider: 'MaterialCommunityIcons', name: 'trophy' },
    },
];

const IMPACT_STATS = [
    {
        value: '20 500',
        label: 'Tonnes de plastique économisées / an (objectif Unilever 2025)',
    },
    {
        value: '480',
        label: "Tonnes d'aluminium économisées / an",
    },
    {
        value: '2M+',
        label: "Utilisateurs engagés dans l'éco-recharge",
    },
];

export default function WelcomeScreen({ navigation }) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <AppHeader title="Bienvenue" compact />
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero Section avec Gradient */}
                    <LinearGradient
                        colors={[colors.primary, colors.accent]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroGradient}
                    >
                    <View style={styles.heroContent}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <AppIcon
                                    name="water-outline"
                                    provider="Ionicons"
                                    size={48}
                                    color={colors.background}
                                />
                            </View>
                        </View>
                        <Text style={styles.brand}>Dove</Text>
                        <Text style={styles.brandSubtitle}>Eco-Refill AI Station</Text>
                        <View style={styles.heroBadge}>
                            <AppIcon
                                name="leaf"
                                provider="Ionicons"
                                size={14}
                                color={colors.background}
                            />
                            <Text style={styles.heroBadgeText}>Éco-responsable & IA</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Section Introduction */}
                <View style={styles.introSection}>
                    <Text style={styles.introTitle}>
                        Votre soin personnalisé, rechargé intelligemment
                    </Text>
                    <Text style={styles.introDescription}>
                        Analyse IA de votre peau, recommandations sur-mesure et impact environnemental suivi en temps réel.
                    </Text>
                </View>

                {/* Features Grid */}
                <View style={styles.features}>
                    {FEATURES.map((feature, index) => (
                        <View key={feature.title} style={styles.featureCard}>
                            <LinearGradient
                                colors={[colors.surface, colors.background]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.featureGradient}
                            >
                                <View style={styles.featureHeader}>
                                    <View style={styles.featureIconWrapper}>
                                        <AppIcon
                                            name={feature.icon.name}
                                            provider={feature.icon.provider}
                                            size={26}
                                            color={colors.primary}
                                        />
                                    </View>
                                    <View style={styles.featureNumber}>
                                        <Text style={styles.featureNumberText}>{index + 1}</Text>
                                    </View>
                                </View>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureText}>{feature.description}</Text>
                            </LinearGradient>
                        </View>
                    ))}
                </View>

                {/* Impact Stats */}
                <View style={styles.statsSection}>
                    <View style={styles.statsSectionHeader}>
                        <AppIcon
                            name="stats-chart"
                            provider="Ionicons"
                            size={24}
                            color={colors.primary}
                        />
                        <Text style={styles.statsSectionTitle}>Notre Impact Collectif</Text>
                    </View>
                    {IMPACT_STATS.map((stat) => (
                        <View key={stat.label} style={styles.statCard}>
                            <View style={styles.statValueContainer}>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <View style={styles.statBadge}>
                                    <AppIcon
                                        name="trending-up"
                                        provider="Ionicons"
                                        size={12}
                                        color={colors.primary}
                                    />
                                </View>
                            </View>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* CTA Buttons */}
                <View style={styles.ctaSection}>
                    <AppButton
                        label="Analyser mon visage et mes cheveux"
                        icon={{ name: 'camera', provider: 'Ionicons' }}
                        onPress={() => navigation.navigate('CameraCapture')}
                        style={styles.primaryCta}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        🔒 Vos données restent privées et sécurisées
                    </Text>
                </View>
            </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (c) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: c.primary,
    },
    container: {
        flex: 1,
        backgroundColor: c.background,
        padding: spacing.lg,
    },
    scrollContainer: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingBottom: spacing.xxl,
    },
    heroGradient: {
        paddingTop: Platform.OS === 'ios' ? spacing.xxxl : spacing.xxl,
        paddingBottom: spacing.xxxl,
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.xl,
        borderRadius: radius.xxl,
        ...shadow.strong,
    },
    heroContent: {
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: spacing.lg,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: radius.full,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        // subtle shadow
    },
    brand: {
        ...typography.h1,
        color: c.background,
        marginBottom: spacing.xs,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    brandSubtitle: {
        ...typography.body,
        color: c.background,
        opacity: 0.9,
        marginBottom: spacing.lg,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        gap: spacing.xs,
    },
    heroBadgeText: {
        ...typography.label,
        color: c.background,
        fontWeight: '600',
    },
    introSection: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    introTitle: {
        ...typography.h3,
        color: c.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    introDescription: {
        ...typography.body,
        color: c.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    features: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    featureCard: {
        width: '47%'
    },
    featureGradient: {
        borderRadius: radius.xl,
        padding: spacing.lg,
        ...shadow.soft,
    },
    featureHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    featureIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: radius.full,
        backgroundColor: c.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureNumber: {
        width: 24,
        height: 24,
        borderRadius: radius.full,
        backgroundColor: c.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureNumberText: {
        ...typography.labelSmall,
        color: c.primary,
    },
    featureTitle: {
        ...typography.h4,
        color: c.textPrimary,
    },
    featureText: {
        ...typography.bodySmall,
        color: c.textSecondary,
        marginTop: spacing.xs,
    },
    statsSection: {
        marginBottom: spacing.xl,
    },
    statsSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    statsSectionTitle: {
        ...typography.h4,
        color: c.textPrimary,
    },
    statCard: {
        backgroundColor: c.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.sm,
        ...shadow.soft,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    statValue: {
        ...typography.h3,
        color: c.primary,
    },
    statBadge: {
        width: 20,
        height: 20,
        borderRadius: radius.full,
        backgroundColor: c.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        ...typography.caption,
        color: c.textSecondary,
        marginTop: spacing.xs,
    },
    ctaSection: {
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
        alignItems: 'center',
        gap: spacing.md,
    },
    primaryCta: {
        width: '100%'
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        ...typography.caption,
        color: c.textMuted,
    },
});
