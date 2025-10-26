// src/screens/QRCodeScreen.js - VERSION AMÉLIORÉE
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Share,
    Alert,
    ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import { createQRCodeData } from '../utils/qrGenerator';
import { calculateImpact } from '../utils/recommendations';
import { getUserProfile } from '../utils/storage';
import { colors, spacing, radius, shadow } from '../styles/theme';

export default function QRCodeScreen({ route, navigation }) {
    const { answers = {}, selectedProducts = [] } = route.params || {};
    
    const [qrData, setQrData] = useState('');
    const [rawData, setRawData] = useState(null);
    const [impact, setImpact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        initializeQRCode();
    }, [answers, selectedProducts]);

    const initializeQRCode = async () => {
        try {
            setLoading(true);
            setError(null);

            // Récupérer le profil utilisateur
            const profile = await getUserProfile();
            setUserProfile(profile);

            // Générer les données du QR Code
            const { qrString, rawData: data } = createQRCodeData(
                answers,
                selectedProducts,
                profile,
                { encrypt: false } // Mettre à true pour chiffrer
            );

            setQrData(qrString);
            setRawData(data);

            // Calculer l'impact environnemental
            const impactData = calculateImpact(
                selectedProducts,
                answers.step5 || 'monthly'
            );
            setImpact(impactData);

        } catch (err) {
            console.error('Erreur génération QR:', err);
            setError(err.message);
            Alert.alert(
                'Erreur',
                'Impossible de générer le QR Code. Veuillez réessayer.',
                [
                    { text: 'Réessayer', onPress: initializeQRCode },
                    { text: 'Retour', onPress: () => navigation.goBack() },
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!qrData || !rawData) return;

        try {
            const message = `
🌿 Vaseline Eco-Refill 🌿

Mon QR Code personnel pour recharger mes produits :
📱 Scannez ce code à la borne

Produits sélectionnés :
${selectedProducts.map(p => `• ${p.name}`).join('\n')}

Impact estimé par mois :
♻️ ${impact?.plasticSavedPerMonth?.toFixed(0) || 0}g de plastique économisé
🌱 ${impact?.co2SavedPerMonth?.toFixed(2) || 0}kg de CO₂ évité

#EcoResponsable #Vaseline
            `.trim();

            await Share.share({
                message: message,
                title: 'Mon QR Code Vaseline',
            });
        } catch (err) {
            console.error('Erreur partage:', err);
        }
    };

    const handleRefresh = () => {
        initializeQRCode();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <AppHeader
                    title="Génération du QR Code"
                    onBack={() => navigation.goBack()}
                />
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Préparation de votre QR Code...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <AppHeader
                    title="Erreur"
                    onBack={() => navigation.goBack()}
                />
                <View style={styles.centerContent}>
                    <AppIcon
                        name="alert-circle"
                        provider="Feather"
                        size={64}
                        color={colors.error}
                    />
                    <Text style={styles.errorText}>{error}</Text>
                    <AppButton
                        label="Réessayer"
                        onPress={handleRefresh}
                        icon={{ name: 'refresh', provider: 'Feather' }}
                    />
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <AppHeader
                title="Votre QR Code"
                subtitle="À scanner à la borne pour récupérer vos produits"
                onBack={() => navigation.goBack()}
            />

            {/* QR Code Card */}
            <View style={styles.qrCard}>
                <Text style={styles.qrTitle}>Scannez ce code à la borne</Text>
                <View style={styles.qrWrapper}>
                    {qrData ? (
                        <QRCode
                            value={qrData}
                            size={240}
                            backgroundColor="white"
                            color={colors.primary}
                        />
                    ) : (
                        <View style={styles.qrPlaceholder}>
                            <ActivityIndicator color={colors.primary} />
                        </View>
                    )}
                </View>
                <Text style={styles.qrInfo}>
                    ✓ Contient vos préférences et produits
                </Text>
                <Text style={styles.qrId}>
                    ID: {rawData?.userId?.slice(-8) || 'N/A'}
                </Text>
                
                <View style={styles.qrActions}>
                    <AppButton
                        label="Partager"
                        icon={{ name: 'share-outline', provider: 'Ionicons' }}
                        variant="outline"
                        onPress={handleShare}
                        style={styles.actionButton}
                    />
                    <AppButton
                        label="Actualiser"
                        icon={{ name: 'refresh', provider: 'Feather' }}
                        variant="outline"
                        onPress={handleRefresh}
                        style={styles.actionButton}
                    />
                </View>
            </View>

            {/* Produits sélectionnés */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    📦 Produits sélectionnés ({selectedProducts.length})
                </Text>
                {selectedProducts.length === 0 ? (
                    <Text style={styles.emptyText}>Aucun produit sélectionné</Text>
                ) : (
                    selectedProducts.map((product, index) => (
                        <View key={product.id || index} style={styles.productRow}>
                            <Text style={styles.productEmoji}>{product.image || '📦'}</Text>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productCategory}>{product.category}</Text>
                            </View>
                            <Text style={styles.productQuantity}>
                                {product.quantity || 1}L
                            </Text>
                        </View>
                    ))
                )}
            </View>

            {/* Impact environnemental */}
            {impact && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🌍 Impact estimé / mois</Text>
                    <View style={styles.impactGrid}>
                        <View style={styles.impactCard}>
                            <AppIcon
                                name="recycle"
                                provider="MaterialCommunityIcons"
                                size={32}
                                color={colors.primary}
                            />
                            <Text style={styles.impactValue}>
                                {impact.plasticSavedPerMonth?.toFixed(0) || 0}g
                            </Text>
                            <Text style={styles.impactLabel}>Plastique économisé</Text>
                        </View>
                        <View style={styles.impactCard}>
                            <AppIcon
                                name="leaf"
                                provider="Feather"
                                size={32}
                                color={colors.success}
                            />
                            <Text style={styles.impactValue}>
                                {impact.co2SavedPerMonth?.toFixed(2) || 0}kg
                            </Text>
                            <Text style={styles.impactLabel}>CO₂ évité</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Informations utilisateur */}
            {rawData?.profile && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👤 Profil</Text>
                    <View style={styles.profileInfo}>
                        <InfoRow label="Type de peau" value={rawData.profile.skinType} />
                        <InfoRow label="Environnement" value={rawData.profile.environment} />
                        <InfoRow label="Fréquence" value={rawData.profile.frequency} />
                    </View>
                </View>
            )}

            {/* Bouton d'action principal */}
            <View style={styles.footer}>
                <AppButton
                    label="Trouver une borne à proximité"
                    icon={{ name: 'map-marker-radius', provider: 'MaterialCommunityIcons' }}
                    onPress={() => navigation.navigate('RefillMap', { selectedProducts })}
                    style={styles.ctaButton}
                />
            </View>
        </ScrollView>
    );
}

// Composant helper pour afficher les infos
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: 16,
        color: colors.textSecondary,
    },
    errorText: {
        fontSize: 16,
        color: colors.error,
        textAlign: 'center',
        marginVertical: spacing.lg,
    },
    
    // QR Card
    qrCard: {
        backgroundColor: 'white',
        borderRadius: radius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadow.md,
        marginBottom: spacing.lg,
    },
    qrTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.md,
    },
    qrWrapper: {
        padding: spacing.lg,
        backgroundColor: 'white',
        borderRadius: radius.md,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    qrPlaceholder: {
        width: 240,
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrInfo: {
        marginTop: spacing.md,
        fontSize: 14,
        color: colors.success,
        textAlign: 'center',
    },
    qrId: {
        marginTop: spacing.xs,
        fontSize: 12,
        color: colors.textSecondary,
        fontFamily: 'monospace',
    },
    qrActions: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.lg,
        width: '100%',
    },
    actionButton: {
        flex: 1,
    },
    
    // Sections
    section: {
        backgroundColor: 'white',
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadow.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.md,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingVertical: spacing.lg,
    },
    
    // Produits
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    productEmoji: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    productCategory: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    productQuantity: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    
    // Impact
    impactGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    impactCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.backgroundLight,
        borderRadius: radius.md,
    },
    impactValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: spacing.sm,
    },
    impactLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    
    // Profil
    profileInfo: {
        gap: spacing.sm,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    
    // Footer
    footer: {
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
    ctaButton: {
        // Styles personnalisés si nécessaire
    },
});