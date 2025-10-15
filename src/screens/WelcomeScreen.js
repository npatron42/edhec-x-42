import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
import { AppButton, AppIcon } from '../components/common';
import { colors, spacing, radius } from '../styles/theme';

const { width } = Dimensions.get('window');

const FEATURES = [
    {
        title: 'Questionnaire personnalisé',
        description: 'Analysez vos besoins et votre type de peau',
        icon: { provider: 'Ionicons', name: 'list-circle-outline' },
    },
    {
        title: 'Recommandations IA',
        description: 'Match automatique avec les produits les plus adaptés',
        icon: { provider: 'Ionicons', name: 'sparkles-outline' },
    },
    {
        title: 'QR Code unique',
        description: 'Rechargez vos produits en borne en un scan',
        icon: { provider: 'MaterialCommunityIcons', name: 'qrcode-scan' },
    },
    {
        title: 'Impact environnemental',
        description: 'Suivez le plastique et le CO₂ économisés',
        icon: { provider: 'MaterialCommunityIcons', name: 'earth' },
    },
];

const IMPACT_STATS = [
    {
        value: '20 500',
        label: 'Tonnes de plastique économisées / an',
    },
    {
        value: '480',
        label: "Tonnes d'aluminium économisées / an",
    },
];

export default function WelcomeScreen({ navigation }) {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
        >
            <View style={styles.header}>
                <AppIcon
                    name="leaf"
                    provider="Feather"
                    size={54}
                    color={colors.primary}
                />
                <Text style={styles.brand}>Eco-Refill</Text>
                <Text style={styles.brandSubtitle}>AI Station</Text>
            </View>

            <View style={styles.hero}>
                <View style={styles.heroIconWrapper}>
                    <AppIcon
                        name="recycle"
                        provider="MaterialCommunityIcons"
                        size={74}
                        color={colors.primary}
                    />
                </View>
                <Text style={styles.heroTitle}>
                    Rechargez vos produits Dove de manière intelligente
                </Text>
                <Text style={styles.heroDescription}>
                    Découvrez des recommandations personnalisées et suivez votre
                    impact environnemental.
                </Text>
            </View>

            <View style={styles.features}>
                {FEATURES.map((feature) => (
                    <View key={feature.title} style={styles.featureCard}>
                        <View style={styles.featureIcon}>
                            <AppIcon
                                name={feature.icon.name}
                                provider={feature.icon.provider}
                                size={28}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={styles.featureTitle}>{feature.title}</Text>
                        <Text style={styles.featureText}>{feature.description}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.stats}>
                {IMPACT_STATS.map((stat, index) => (
                    <View
                        key={stat.label}
                        style={[
                            styles.statCard,
                            width > 480 && index === IMPACT_STATS.length - 1
                                ? { marginRight: 0 }
                                : null,
                        ]}
                    >
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            <AppButton
                label="Commencer"
                icon={{ name: 'arrow-forward', provider: 'Ionicons' }}
                onPress={() => navigation.navigate('Questionnaire')}
                style={styles.primaryCta}
            />

            <AppButton
                label="J'ai déjà un profil"
                variant="outline"
                icon={{ name: 'person-circle-outline', provider: 'Ionicons' }}
                onPress={() => navigation.navigate('Dashboard')}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        ...(Platform.OS === 'web' && {
            height: '100vh',
            overflow: 'auto',
        }),
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xxl,
        ...(Platform.OS === 'web' && {
            minHeight: '100vh',
        }),
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    brand: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: spacing.sm,
    },
    brandSubtitle: {
        fontSize: 16,
        color: colors.textMuted,
    },
    hero: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.lg,
    },
    heroIconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    heroDescription: {
        fontSize: 15,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 22,
    },
    features: {
        marginBottom: spacing.xxl,
    },
    featureCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        alignItems: 'center',
    },
    featureIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    featureText: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
    stats: {
        flexDirection: width > 480 ? 'row' : 'column',
        justifyContent: 'space-between',
        marginBottom: spacing.xxl,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginBottom: width > 480 ? 0 : spacing.md,
        marginRight: width > 480 ? spacing.md : 0,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: spacing.sm,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 18,
    },
    primaryCta: {
        marginBottom: spacing.md,
    },
});
