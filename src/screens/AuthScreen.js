import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Platform,
} from 'react-native';
import { saveUserProfile, getUserProfile } from '../utils/storage';
import { spacing, radius } from '../styles/theme';
import { AppButton, AppIcon } from '../components/common';
import { useTheme } from '../styles/ThemeProvider';

export default function AuthScreen({ navigation }) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            const profile = await getUserProfile();
            if (isMounted) {
                if (profile) {
                    navigation.replace('Dashboard');
                } else {
                    setLoading(false);
                }
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleCreate = async () => {
        if (!name.trim() || !email.trim()) {
            return;
        }
        const profile = {
            id: `USR-${Date.now().toString(36)}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            createdAt: new Date().toISOString(),
            rewards: {
                points: 0,
                badges: [],
                discounts: [],
            },
        };
        await saveUserProfile(profile);
        navigation.replace('Dashboard');
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <AppIcon
                    name="loader"
                    provider="Feather"
                    size={32}
                    color={colors.primary}
                />
                <Text style={styles.loadingText}>Chargement…</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <AppIcon
                        name="water"
                        provider="Ionicons"
                        size={64}
                        color={colors.primary}
                    />
                </View>
                <Text style={styles.brand}>Dove</Text>
                <Text style={styles.title}>Eco-Refill AI Station</Text>
                <Text style={styles.subtitle}>
                    Créez votre compte pour débloquer une expérience beauté personnalisée et des récompenses exclusives
                </Text>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Votre nom"
                    style={styles.input}
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="words"
                    returnKeyType="next"
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
                    returnKeyType="done"
                />
            </View>

            <AppButton
                label="Continuer"
                icon={{ name: 'arrow-forward', provider: 'Ionicons' }}
                onPress={handleCreate}
                style={styles.submitButton}
            />
        </ScrollView>
    );
}

const getStyles = (c) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: c.background,
        ...(Platform.OS === 'web' && {
            height: '100vh',
            overflow: 'auto',
        }),
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xxl,
        justifyContent: 'center',
        ...(Platform.OS === 'web' && {
            minHeight: '100vh',
        }),
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: c.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    brand: {
        fontSize: 32,
        fontWeight: '800',
        color: c.primary,
        marginBottom: spacing.xs,
    },
    logo: {
        fontSize: 56,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: c.textSecondary,
        marginBottom: spacing.md,
    },
    subtitle: {
        fontSize: 14,
        color: c.textMuted,
        textAlign: 'center',
        marginTop: spacing.sm,
        lineHeight: 20,
    },
    formGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: c.primary,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: c.surfaceAlt,
        borderRadius: radius.lg,
        padding: spacing.lg,
        fontSize: 16,
        backgroundColor: c.surface,
        color: c.textPrimary,
    },
    submitButton: {
        marginTop: spacing.xxl,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.sm,
        color: c.textMuted,
    },
});
