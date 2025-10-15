import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Share,
    Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import { generateQRData, calculateImpact } from '../utils/recommendations';
import { addRefillToHistory } from '../utils/storage';
import { colors, spacing, radius, shadow } from '../styles/theme';

export default function QRCodeScreen({ route, navigation }) {
    const { answers = {}, selectedProducts = [] } = route.params || {};
    const [qrData, setQrData] = useState('');
    const [impact, setImpact] = useState(null);

    useEffect(() => {
        const data = generateQRData(answers, selectedProducts);
        setQrData(data);
        setImpact(calculateImpact(selectedProducts, answers.step5 || 'monthly'));
    }, [answers, selectedProducts]);

    const handleShare = async () => {
        if (!qrData) {
            return;
        }
        try {
            await Share.share({ message: qrData });
        } catch (error) {
            // no-op: native share errors are silently ignored
        }
    };

    const handleSimulateRefill = async () => {
        await addRefillToHistory({ products: selectedProducts });
        navigation.navigate('Dashboard');
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
        >
            <AppHeader
                title="Votre QR Code"
                subtitle="À présenter à la borne pour recharger vos produits"
                onBack={() => navigation.goBack()}
            />

            <View style={styles.qrCard}>
                <View style={styles.qrWrapper}>
                    {qrData ? (
                        <QRCode value={qrData} size={220} />
                    ) : (
                        <View style={styles.qrPlaceholder}>
                            <AppIcon
                                name="loader"
                                provider="Feather"
                                size={32}
                                color={colors.primary}
                            />
                            <Text style={styles.qrPlaceholderText}>
                                Génération du QR Code…
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={styles.qrInfo}>
                    Contient vos préférences et les produits sélectionnés
                </Text>
                <AppButton
                    label="Partager"
                    icon={{ name: 'share-social-outline', provider: 'Ionicons' }}
                    variant="outline"
                    onPress={handleShare}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Produits choisis</Text>
                {selectedProducts.length === 0 ? (
                    <Text style={styles.sectionText}>Aucun produit sélectionné</Text>
                ) : (
                    selectedProducts.map((product) => (
                        <View key={product.id} style={styles.productRow}>
                            <Text style={styles.productEmoji}>{product.image}</Text>
                            <Text style={styles.productName}>{product.name}</Text>
                        </View>
                    ))
                )}
            </View>

            {impact ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Impact estimé</Text>
                    <View style={styles.impactRow}>
                        <AppIcon
                            name="recycle"
                            provider="MaterialCommunityIcons"
                            size={24}
                            color={colors.primary}
                        />
                        <Text style={styles.sectionText}>
                            Plastique économisé / mois :{' '}
                            {impact.plasticSavedPerMonth.toFixed(0)} g
                        </Text>
                    </View>
                    <View style={styles.impactRow}>
                        <AppIcon
                            name="leaf"
                            provider="Feather"
                            size={24}
                            color={colors.primarySoft}
                        />
                        <Text style={styles.sectionText}>
                            CO₂ évité / mois : {impact.co2SavedPerMonth.toFixed(2)} kg
                        </Text>
                    </View>
                </View>
            ) : null}

            <AppButton
                label="J'ai rechargé (simuler)"
                icon={{ name: 'checkmark-done-outline', provider: 'Ionicons' }}
                onPress={handleSimulateRefill}
                style={styles.cta}
            />

            <AppButton
                label="Localiser une borne"
                icon={{ name: 'map-marker-radius', provider: 'MaterialCommunityIcons' }}
                variant="outline"
                onPress={() =>
                    navigation.navigate('RefillMap', { selectedProducts })
                }
            />
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
    qrCard: {
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.xxl,
        alignItems: 'center',
        ...shadow.soft,
    },
    qrWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        minHeight: 240,
    },
    qrPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrPlaceholderText: {
        marginTop: spacing.sm,
        color: colors.textMuted,
    },
    qrInfo: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    section: {
        marginBottom: spacing.xxl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },
    sectionText: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: spacing.sm,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    productEmoji: {
        fontSize: 32,
        marginRight: spacing.lg,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    impactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cta: {
        marginBottom: spacing.md,
    },
});
