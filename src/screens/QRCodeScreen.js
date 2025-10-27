import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Share,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import { generateQRData, calculateImpact } from '../utils/recommendations';
import { addRefillToHistory } from '../utils/storage';
import { colors, spacing, radius, shadow, typography } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/ThemeProvider';

export default function QRCodeScreen({ route, navigation }) {
    const { colors: themeColors } = useTheme();
    const { answers = {}, selectedProducts = [] } = route.params || {};
    const safeSelected = Array.isArray(selectedProducts) ? selectedProducts.filter(Boolean) : [];
    const [qrData, setQrData] = useState('');
    const [impact, setImpact] = useState(null);

    useEffect(() => {
        const data = generateQRData(answers, safeSelected);
        setQrData(data);
        const freq = answers.step5 || 'monthly';
        setImpact(calculateImpact(safeSelected, freq));
    }, [JSON.stringify(answers), JSON.stringify(safeSelected)]);

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
        <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}> 
            <ScrollView
            style={[styles.container, { backgroundColor: themeColors.surface }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
        >
             {/* Hero bannière */}
             <LinearGradient
               colors={[themeColors.primary, themeColors.accent]}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
               style={styles.heroBanner}
             >
              <View style={styles.heroHeaderRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour">
                  <AppIcon name="arrow-back" provider="Ionicons" size={22} color={themeColors.onPrimaryText} />
                </TouchableOpacity>
                <View style={{ marginLeft: spacing.sm }}>
                  <Text style={[styles.heroTitle, { color: themeColors.onPrimaryText }]}>Votre QR Code</Text>
                  <Text style={[styles.heroSubtitle, { color: themeColors.onPrimaryTextSoft }]}>À présenter à la borne pour recharger vos produits</Text>
                </View>
              </View>
             </LinearGradient>

            <View style={[styles.qrCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
                <View style={styles.qrWrapper}>
                    {qrData ? (
                        <QRCode value={qrData} size={220} />
                    ) : (
                        <View style={styles.qrPlaceholder}>
                            <AppIcon
                                name="loader"
                                provider="Feather"
                                size={32}
                                color={themeColors.primary}
                            />
                            <Text style={[styles.qrPlaceholderText, { color: themeColors.textMuted }]}> 
                                Génération du QR Code…
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.qrInfo, { color: themeColors.textMuted }]}> 
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
                <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Produits choisis</Text>
                {safeSelected.length === 0 ? (
                    <Text style={[styles.sectionText, { color: themeColors.textMuted }]}>Aucun produit sélectionné</Text>
                ) : (
                    safeSelected.filter(product => product && product.id).map((product, index) => (
                        <View key={`qrcode-product-${product.id}-${index}`} style={styles.productRow}>
                            <Text style={styles.productEmoji}>{product.image || '📦'}</Text>
                            <Text style={[styles.productName, { color: themeColors.textPrimary }]}>{product.name || 'Produit'}</Text>
                        </View>
                    ))
                )}
            </View>

            {impact ? (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Impact estimé</Text>
                    <View style={styles.impactRow}>
                        <AppIcon
                            name="recycle"
                            provider="MaterialCommunityIcons"
                            size={24}
                            color={themeColors.primary}
                        />
                        <Text style={[styles.sectionText, { color: themeColors.textMuted }]}> 
                            Plastique économisé / mois :{' '}
                            {impact.plasticSavedPerMonth.toFixed(0)} g
                        </Text>
                    </View>
                    <View style={styles.impactRow}>
                        <AppIcon
                            name="leaf"
                            provider="MaterialCommunityIcons"
                            size={24}
                            color={themeColors.primarySoft}
                        />
                        <Text style={[styles.sectionText, { color: themeColors.textMuted }]}> 
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
        paddingBottom: spacing.xxxl, // increased to leave space above bottom dock
        ...(Platform.OS === 'web' && {
            minHeight: '100vh',
        }),
    },
    heroBanner: { marginTop: spacing.md, marginBottom: spacing.lg, padding: spacing.xxl, borderRadius: radius.xxl, ...shadow.strong },
    heroHeaderRow: { flexDirection: 'row', alignItems: 'center' },
    heroTitle: { ...typography.h2, marginBottom: spacing.xs },
    heroSubtitle: { ...typography.body },
    qrCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
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
        fontSize: 12,
        marginBottom: spacing.md,
    },
    section: { marginBottom: spacing.xl },
    sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
    sectionText: { ...typography.body, color: colors.textSecondary },
    productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
    productEmoji: { fontSize: 20, marginRight: spacing.md },
    productName: { ...typography.body },
    impactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, gap: spacing.sm },
    cta: { marginTop: spacing.lg, marginBottom: spacing.lg },
});
