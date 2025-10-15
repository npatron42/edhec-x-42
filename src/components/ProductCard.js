import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../styles/theme';
import AppButton from './common/AppButton';
import AppIcon from './common/AppIcon';

export default function ProductCard({ product, onLike, onPass }) {
    if (!product) {
        return null;
    }

    return (
        <View style={styles.card}>
            <Text style={styles.emoji}>{product.image}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.benefits}>
                {product.benefits.slice(0, 3).map((benefit, index) => (
                    <View key={index} style={styles.benefitTag}>
                        <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.impact}>
                <View style={styles.impactItem}>
                    <AppIcon
                        name="recycle"
                        provider="MaterialCommunityIcons"
                        size={22}
                        color={colors.primary}
                        style={styles.impactIcon}
                    />
                    <Text style={styles.impactText}>{product.plasticSaved}g</Text>
                </View>
                <View style={styles.impactItem}>
                    <AppIcon
                        name="leaf"
                        provider="Feather"
                        size={22}
                        color={colors.primarySoft}
                        style={styles.impactIcon}
                    />
                    <Text style={styles.impactText}>{product.co2Saved}kg</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <AppButton
                    onPress={onPass}
                    variant="subtle"
                    icon={{ name: 'close', provider: 'Ionicons', size: 24 }}
                    style={styles.actionButton}
                />
                <AppButton
                    onPress={onLike}
                    icon={{ name: 'heart', provider: 'Ionicons', size: 22 }}
                    style={styles.primaryButton}
                    label="Sélectionner"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.background,
        borderRadius: radius.xl,
        padding: spacing.xxl,
        alignItems: 'center',
        ...shadow.card,
    },
    emoji: {
        fontSize: 80,
        marginBottom: spacing.lg,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 22,
    },
    benefits: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        marginHorizontal: -spacing.xs,
    },
    benefitTag: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
        marginHorizontal: spacing.xs,
        marginVertical: spacing.xs,
    },
    benefitText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    impact: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
    },
    impactItem: {
        alignItems: 'center',
    },
    impactIcon: {
        marginBottom: spacing.xs,
    },
    impactText: {
        fontSize: 13,
        color: colors.textMuted,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: -spacing.sm,
    },
    actionButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        paddingHorizontal: 0,
        marginHorizontal: spacing.sm,
    },
    primaryButton: {
        flex: 1,
        marginHorizontal: spacing.sm,
    },
});
