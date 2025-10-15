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
import { colors, spacing, radius } from '../styles/theme';
import { AppButton, AppIcon } from '../components/common';

export default function AuthScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const profile = await getUserProfile();
            if (profile) {
                navigation.replace('Questionnaire');
            } else {
                setLoading(false);
            }
        })();
    }, [navigation]);

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
        navigation.replace('Questionnaire');
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
                <Text style={styles.logo}>🌿</Text>
                <Text style={styles.title}>Créer mon compte</Text>
                <Text style={styles.subtitle}>
                    Sauvegardez vos préférences et gagnez des récompenses
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
        justifyContent: 'center',
        ...(Platform.OS === 'web' && {
            minHeight: '100vh',
        }),
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logo: {
        fontSize: 56,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
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
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.surfaceAlt,
        borderRadius: radius.lg,
        padding: spacing.lg,
        fontSize: 16,
        backgroundColor: colors.surface,
        color: colors.textPrimary,
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
        color: colors.textMuted,
    },
});
