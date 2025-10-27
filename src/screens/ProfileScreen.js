import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    getUserProfile,
    updateUserProfile,
    signOutUser,
    clearAllData,
    redeemDiscount,
} from '../utils/storage';
import { colors, spacing, radius, shadow, typography } from '../styles/theme';
import { AppButton, AppIcon } from '../components/common';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/ThemeProvider';

export default function ProfileScreen({ navigation }) {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);

    const { mode, setMode, isDark, colors: themeColors } = useTheme();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            const data = await getUserProfile();
            if (isMounted) {
                setProfile(data);
                setName(data?.name || '');
                setEmail(data?.email || '');
            }
        })();
        return () => {
            isMounted = false;
        };
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

    const ThemeOption = ({ value, label, icon }) => (
      <TouchableOpacity
        onPress={() => setMode(value)}
        style={[styles.themeOption, { borderColor: themeColors.border, backgroundColor: mode === value ? themeColors.primarySoft : themeColors.surface }]}
        accessibilityRole="button"
        accessibilityLabel={`Thème ${label}`}
      >
        <AppIcon name={icon.name} provider={icon.provider} size={18} color={mode === value ? themeColors.primary : themeColors.textSecondary} />
        <Text style={[styles.themeOptionLabel, { color: mode === value ? themeColors.textPrimary : themeColors.textSecondary }]}>{label}</Text>
        {mode === value ? (
          <AppIcon name="check" provider="Feather" size={16} color={themeColors.primary} />
        ) : null}
      </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}> 
            <ScrollView
            style={[styles.container, { backgroundColor: themeColors.surface }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
        >
            {/* En-tête compact intégré à la bannière, comme les autres écrans */}
            <LinearGradient
              colors={[themeColors.primary, themeColors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBanner}
            >
              <View style={styles.heroHeaderRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour">
                  <AppIcon name="arrow-back" provider="Ionicons" size={20} color={themeColors.onPrimaryText} />
                </TouchableOpacity>
                <View style={{ marginLeft: spacing.sm }}>
                  <Text style={[styles.heroTitle, { color: themeColors.onPrimaryText }]}>Mon Profil</Text>
                  <Text style={[styles.heroSubtitle, { color: themeColors.onPrimaryTextSoft }]}>Gérez vos informations et récompenses</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Informations</Text>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: themeColors.primary }]}>Nom</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Votre nom"
                        style={[styles.input, { backgroundColor: themeColors.surface, borderColor: themeColors.surfaceAlt, color: themeColors.textPrimary }]}
                        placeholderTextColor={themeColors.textMuted}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: themeColors.primary }]}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="vous@exemple.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={[styles.input, { backgroundColor: themeColors.surface, borderColor: themeColors.surfaceAlt, color: themeColors.textPrimary }]}
                        placeholderTextColor={themeColors.textMuted}
                    />
                </View>
                <AppButton
                    label={saving ? 'Enregistrement…' : 'Enregistrer'}
                    icon={{ name: 'save-outline', provider: 'Ionicons' }}
                    onPress={handleSave}
                    disabled={saving}
                />
            </View>

            {/* Thème */}
            <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
              <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Apparence</Text>
              <Text style={[styles.sectionSubtitle, { color: themeColors.textMuted }]}>Choisissez votre thème</Text>
              <View style={styles.themeRow}>
                <ThemeOption value="light" label="Clair" icon={{ name: 'sunny-outline', provider: 'Ionicons' }} />
                <ThemeOption value="dark" label="Sombre" icon={{ name: 'moon-outline', provider: 'Ionicons' }} />
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Récompenses</Text>
                <View style={styles.pointsRow}>
                    <AppIcon
                        name="star-circle"
                        provider="MaterialCommunityIcons"
                        size={24}
                        color={themeColors.primary}
                        style={styles.pointsIcon}
                    />
                    <Text style={[styles.pointsText, { color: themeColors.textPrimary }]}> 
                        Points : {profile?.rewards?.points || 0}
                    </Text>
                </View>
                <View style={styles.badges}>
                    {(profile?.rewards?.badges || []).length === 0 ? (
                        <Text style={[styles.emptyText, { color: themeColors.textMuted }]}> 
                            Aucun badge débloqué pour le moment
                        </Text>
                    ) : (
                        profile.rewards.badges.map((badge, index) => (
                            <View key={`profile-badge-${badge.id || index}`} style={[styles.badge, { backgroundColor: themeColors.surface }]}> 
                                <Text style={styles.badgeEmoji}>
                                    {badge.icon || '⭐'}
                                </Text>
                                <Text style={[styles.badgeLabel, { color: themeColors.textSecondary }]}>{badge.name}</Text>
                            </View>
                        ))
                    )}
                </View>
                {availableDiscounts.length ? (
                    <View style={styles.discounts}>
                        <Text style={[styles.sectionSubtitle, { color: themeColors.textMuted }]}>Réductions disponibles</Text>
                        {availableDiscounts.map((discount, index) => (
                            <View key={`profile-discount-${discount.id || index}`} style={[styles.discount, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
                                <View style={styles.discountInfo}>
                                    <Text style={[styles.discountLabel, { color: themeColors.textPrimary }]}> 
                                        {discount.label || '-5% sur produit'}
                                    </Text>
                                    <Text style={[styles.discountCode, { color: themeColors.textMuted }]}> 
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

            <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Session</Text>
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
                    style={[styles.dangerButton, { backgroundColor: themeColors.danger, borderColor: themeColors.danger }]}
                />
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
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
        paddingBottom: spacing.xxxl,
        ...(Platform.OS === 'web' && {
            minHeight: '100vh',
        }),
    },
    heroBanner: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        padding: spacing.xxl,
        borderRadius: radius.xxl,
        ...shadow.strong,
    },
    heroHeaderRow: { flexDirection: 'row', alignItems: 'center' },
    heroTitle: {
        ...typography.h2,
        marginBottom: spacing.xs,
    },
    heroSubtitle: {
        ...typography.body,
    },
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
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
        borderWidth: 1,
        borderColor: colors.border,
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

    // Theme selector
    themeRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    themeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: radius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    themeOptionLabel: {
      ...typography.label,
      flex: 1,
      marginLeft: spacing.sm,
    },
});
