import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import {
    getUserProfile,
    updateUserProfile,
    signOutUser,
    clearAllData,
    redeemDiscount,
} from '../utils/storage';
import { colors, spacing, radius, shadow } from '../styles/theme';
import { AppButton, AppHeader, AppIcon } from '../components/common';

export default function ProfileScreen({ navigation }) {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await getUserProfile();
            setProfile(data);
            setName(data?.name || '');
            setEmail(data?.email || '');
        })();
    }, []);

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            return;
        }
        setSaving(true);
        const updated = await updateUserProfile({
            name: name.trim(),
            email: email.trim().toLowerCase(),
        });
        setProfile(updated);
        setSaving(false);
    };

    const handleSignOut = async () => {
        await signOutUser();
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    };

    const handleClearAll = () => {
        Alert.alert(
            'Réinitialiser',
            'Supprimer toutes vos données locales ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllData();
                        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
                    },
                },
            ],
        );
    };

    const handleRedeem = async (id) => {
        const ok = await redeemDiscount(id);
        if (ok) {
            const updated = await getUserProfile();
            setProfile(updated);
        }
    };

    const availableDiscounts = (profile?.rewards?.discounts || []).filter(
        (discount) => !discount.used,
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
        >
            <AppHeader title="Mon Profil" onBack={() => navigation.goBack()} />

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Informations</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Votre nom"
                        style={styles.input}
                        placeholderTextColor={colors.textMuted}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="vous@exemple.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                        placeholderTextColor={colors.textMuted}
                    />
                </View>
                <AppButton
                    label={saving ? 'Enregistrement…' : 'Enregistrer'}
                    icon={{ name: 'save-outline', provider: 'Ionicons' }}
                    onPress={handleSave}
                    disabled={saving}
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Récompenses</Text>
                <View style={styles.pointsRow}>
                    <AppIcon
                        name="star-circle"
                        provider="MaterialCommunityIcons"
                        size={24}
                        color={colors.primary}
                        style={styles.pointsIcon}
                    />
                    <Text style={styles.pointsText}>
                        Points : {profile?.rewards?.points || 0}
                    </Text>
                </View>
                <View style={styles.badges}>
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
                            <View key={discount.id} style={styles.discount}>
                                <View style={styles.discountInfo}>
                                    <Text style={styles.discountLabel}>
                                        {discount.label || '-5% sur produit'}
                                    </Text>
                                    <Text style={styles.discountCode}>
                                        {discount.code || 'Utilisation en borne'}
                                    </Text>
                                </View>
                                <AppButton
                                    label="Utiliser"
                                    icon={{
                                        name: 'ticket-confirmation',
                                        provider: 'MaterialCommunityIcons',
                                    }}
                                    onPress={() => handleRedeem(discount.id)}
                                    style={styles.discountButton}
                                />
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Session</Text>
                <AppButton
                    label="Se déconnecter"
                    variant="outline"
                    icon={{ name: 'log-out-outline', provider: 'Ionicons' }}
                    onPress={handleSignOut}
                    style={styles.sessionButton}
                />
                <AppButton
                    label="Supprimer mes données"
                    icon={{ name: 'trash-outline', provider: 'Ionicons' }}
                    onPress={handleClearAll}
                    style={styles.dangerButton}
                />
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
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
        ...(Platform.OS === 'web' && {
            minHeight: '100vh',
        }),
    },
    card: {
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.xxl,
        ...shadow.soft,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: colors.textMuted,
        marginBottom: spacing.sm,
    },
    formGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.surfaceAlt,
        borderRadius: radius.lg,
        padding: spacing.lg,
        backgroundColor: colors.surface,
        color: colors.textPrimary,
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
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.sm,
        marginBottom: spacing.md,
    },
    badge: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginHorizontal: spacing.sm,
        marginBottom: spacing.sm,
        minWidth: 100,
        ...shadow.soft,
    },
    badgeEmoji: {
        fontSize: 30,
        marginBottom: spacing.xs,
    },
    badgeLabel: {
        fontSize: 12,
        color: colors.textMuted,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: colors.textMuted,
    },
    discounts: {
        marginTop: spacing.lg,
    },
    discount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.sm,
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
        flexBasis: 150,
    },
    sessionButton: {
        marginBottom: spacing.md,
    },
    dangerButton: {
        backgroundColor: colors.danger,
        borderColor: colors.danger,
    },
});
