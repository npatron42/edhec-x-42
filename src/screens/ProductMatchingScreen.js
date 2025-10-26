import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { AppButton, AppHeader, AppIcon } from '../components/common';
//import { getRecommendedProducts, getMatchMessage } from '../utils/recommendations';
import { saveSelectedProducts } from '../utils/storage';
import { colors, spacing, radius, shadow } from '../styles/theme';
import { createQRCodeData } from '../utils/qrGenerator';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.xl * 2;
const SWIPE_THRESHOLD = 120;

export default function ProductMatchingScreen({ route, navigation }) {
    const { answers } = route.params;
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedProducts, setLikedProducts] = useState([]);

    const position = useRef(new Animated.ValueXY()).current;
    const rotate = useRef(
        position.x.interpolate({
            inputRange: [-width / 2, 0, width / 2],
            outputRange: ['-10deg', '0deg', '10deg'],
            extrapolate: 'clamp',
        }),
    ).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    swipeRight();
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    swipeLeft();
                } else {
                    resetPosition();
                }
            },
        }),
    ).current;

    useEffect(() => {
        const recommended = getRecommendedProducts(answers);
        setProducts(recommended);
    }, [answers]);

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
    };

    const swipeRight = () => {
        Animated.timing(position, {
            toValue: { x: width + 100, y: 0 },
            duration: 260,
            useNativeDriver: false,
        }).start(() => {
            const currentProduct = products[currentIndex];
            setLikedProducts((prev) => [...prev, currentProduct]);
            nextCard();
        });
    };

    const swipeLeft = () => {
        Animated.timing(position, {
            toValue: { x: -width - 100, y: 0 },
            duration: 260,
            useNativeDriver: false,
        }).start(() => {
            nextCard();
        });
    };

    const nextCard = () => {
        position.setValue({ x: 0, y: 0 });
        setCurrentIndex((prev) => prev + 1);
    };

    const handlePass = () => swipeLeft();
    const handleLike = () => swipeRight();

    const handleFinish = async () => {
        await saveSelectedProducts(likedProducts);
        navigation.navigate('QRCode', {
            answers,
            selectedProducts: likedProducts,
        });
    };

    const handleFindStation = () => {
        navigation.navigate('RefillMap', { selectedProducts: likedProducts });
    };

    if (!products.length || currentIndex >= products.length) {
        return (
            <View style={styles.finishedContainer}>
                <AppHeader
                    title="Vos Recommandations"
                    subtitle="Résultats"
                    onBack={() => navigation.goBack()}
                />
                <View style={styles.finishedContent}>
                    <AppIcon
                        name="party-popper"
                        provider="MaterialCommunityIcons"
                        size={76}
                        color={colors.primary}
                    />
                    <Text style={styles.finishedTitle}>Sélection terminée !</Text>
                    <Text style={styles.finishedText}>
                        Vous avez sélectionné {likedProducts.length} produit(s)
                    </Text>
                    <View style={styles.selectedProducts}>
                        {likedProducts.map((product) => (
                            <View key={product.id} style={styles.selectedProduct}>
                                <Text style={styles.selectedProductEmoji}>
                                    {product.image}
                                </Text>
                                <View style={styles.selectedProductInfo}>
                                    <Text style={styles.selectedProductName}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.selectedProductBenefits}>
                                        {product.benefits.slice(0, 2).join(' • ')}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <AppButton
                        label="Générer mon QR Code"
                        icon={{ name: 'qr-code', provider: 'Ionicons' }}
                        onPress={handleFinish}
                        style={styles.ctaButton}
                    />
                    <AppButton
                        label="Trouver une borne à proximité"
                        icon={{
                            name: 'map-marker-radius',
                            provider: 'MaterialCommunityIcons',
                        }}
                        variant="outline"
                        onPress={handleFindStation}
                        style={styles.secondaryButton}
                    />
                    <AppButton
                        label="Recommencer la sélection"
                        variant="subtle"
                        icon={{ name: 'refresh', provider: 'MaterialCommunityIcons' }}
                        onPress={() => {
                            setCurrentIndex(0);
                            setLikedProducts([]);
                        }}
                    />
                </View>
            </View>
        );
    }

    const currentProduct = products[currentIndex];
    const matchInfo = getMatchMessage(currentProduct.matchScore || 0);

    return (
        <View style={styles.container}>
            <AppHeader
                title="Vos Recommandations"
                onBack={() => navigation.goBack()}
                rightComponent={
                    <View style={styles.counter}>
                        <Text style={styles.counterText}>
                            {currentIndex + 1} / {products.length}
                        </Text>
                    </View>
                }
            />

            <View style={styles.cardContainer}>
                {currentIndex < products.length - 1 && (
                    <View style={[styles.card, styles.nextCard]}>
                        <Text style={styles.cardEmoji}>
                            {products[currentIndex + 1].image}
                        </Text>
                    </View>
                )}

                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.card,
                        {
                            transform: [
                                { translateX: position.x },
                                { translateY: position.y },
                                { rotate },
                            ],
                        },
                    ]}
                >
                    <View style={styles.likeOverlay}>
                        <Animated.View
                            style={[
                                styles.overlayBadge,
                                styles.likeBadge,
                                {
                                    opacity: position.x.interpolate({
                                        inputRange: [0, SWIPE_THRESHOLD],
                                        outputRange: [0, 1],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ]}
                        >
                            <AppIcon
                                name="heart"
                                provider="Ionicons"
                                size={28}
                                color={colors.background}
                                style={styles.overlayIcon}
                            />
                            <Text style={styles.overlayText}>J'aime</Text>
                        </Animated.View>
                    </View>
                    <View style={styles.nopeOverlay}>
                        <Animated.View
                            style={[
                                styles.overlayBadge,
                                styles.nopeBadge,
                                {
                                    opacity: position.x.interpolate({
                                        inputRange: [-SWIPE_THRESHOLD, 0],
                                        outputRange: [1, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ]}
                        >
                            <AppIcon
                                name="close"
                                provider="Ionicons"
                                size={28}
                                color={colors.background}
                                style={styles.overlayIcon}
                            />
                            <Text style={styles.overlayText}>Passer</Text>
                        </Animated.View>
                    </View>

                    <View style={styles.cardContent}>
                        <View
                            style={[
                                styles.matchBadge,
                                { backgroundColor: matchInfo.color },
                            ]}
                        >
                            <AppIcon
                                name={matchInfo.icon.name}
                                provider={matchInfo.icon.provider}
                                size={12}
                                color={colors.background}
                            />
                            <Text style={styles.matchBadgeText}>{matchInfo.title}</Text>
                        </View>
                        <Text style={styles.cardEmoji}>{currentProduct.image}</Text>
                        <Text style={styles.cardTitle}>{currentProduct.name}</Text>
                        <Text style={styles.cardDescription}>
                            {currentProduct.description}
                        </Text>

                        <View style={styles.benefits}>
                            {currentProduct.benefits.slice(0, 3).map((benefit) => (
                                <View key={benefit} style={styles.benefitTag}>
                                    <Text style={styles.benefitText}>{benefit}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.impact}>
                            <View style={styles.impactItem}>
                                <AppIcon
                                    name='recycle'
                                    provider='MaterialCommunityIcons'
                                    size={24}
                                    color={colors.primary}
                                    style={styles.impactIcon}
                                />
                                <Text style={styles.impactLabel}>Plastique</Text>
                                <Text style={styles.impactValue}>
                                    {currentProduct.plasticSaved} g
                                </Text>
                            </View>
                            <View style={styles.impactItem}>
                                <AppIcon
                                    name='leaf'
                                    provider='Feather'
                                    size={24}
                                    color={colors.primarySoft}
                                    style={styles.impactIcon}
                                />
                                <Text style={styles.impactLabel}>CO₂</Text>
                                <Text style={styles.impactValue}>
                                    {currentProduct.co2Saved} kg
                                </Text>
                            </View>
                        </View>

                        <View style={styles.matchInfo}>
                            <View style={styles.matchBar}>
                                <View
                                    style={[
                                        styles.matchBarFill,
                                        {
                                            width: `${currentProduct.matchScore}%`,
                                            backgroundColor: matchInfo.color,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.matchMessage}>
                                {matchInfo.message}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            <View style={styles.actions}>
                <AppButton
                    variant="outline"
                    icon={{ name: 'close', provider: 'Ionicons', size: 28 }}
                    onPress={handlePass}
                    style={styles.actionButton}
                />
                <AppButton
                    icon={{ name: 'heart', provider: 'Ionicons', size: 26 }}
                    onPress={handleLike}
                    style={styles.primaryAction}
                />
            </View>

            <View style={styles.likedCount}>
                <AppIcon
                    name="heart"
                    provider="Ionicons"
                    size={18}
                    color={colors.primary}
                    style={styles.likedIcon}
                />
                <Text style={styles.likedCountText}>
                    {likedProducts.length} produit(s) sélectionné(s)
                </Text>
            </View>

            <View style={styles.bottomCta}>
                <AppButton
                    label="Trouver une borne à proximité"
                    icon={{
                        name: 'map-marker-radius',
                        provider: 'MaterialCommunityIcons',
                    }}
                    onPress={handleFindStation}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    finishedContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    finishedContent: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    finishedTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: spacing.lg,
    },
    finishedText: {
        fontSize: 16,
        color: colors.textMuted,
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    selectedProducts: {
        width: '100%',
        marginBottom: spacing.xl,
    },
    selectedProduct: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.sm,
    },
    selectedProductEmoji: {
        fontSize: 32,
        marginRight: spacing.lg,
    },
    selectedProductInfo: {
        flex: 1,
    },
    selectedProductName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    selectedProductBenefits: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    ctaButton: {
        width: '100%',
        marginBottom: spacing.md,
    },
    secondaryButton: {
        width: '100%',
        marginBottom: spacing.md,
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    card: {
        width: CARD_WIDTH,
        height: height * 0.62,
        backgroundColor: colors.background,
        borderRadius: radius.xl,
        ...shadow.card,
        position: 'absolute',
        overflow: 'hidden',
    },
    nextCard: {
        transform: [{ scale: 0.96 }],
        opacity: 0.4,
    },
    cardContent: {
        flex: 1,
        padding: spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardEmoji: {
        fontSize: 76,
        marginBottom: spacing.lg,
    },
    cardTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    cardDescription: {
        fontSize: 16,
        color: colors.textMuted,
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
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.xl,
    },
    impactItem: {
        alignItems: 'center',
    },
    impactIcon: {
        marginBottom: spacing.xs,
    },
    impactLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
    },
    impactValue: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: spacing.xs,
    },
    matchInfo: {
        width: '100%',
    },
    matchBadge: {
        position: 'absolute',
        top: spacing.xl,
        right: spacing.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radius.xl,
    },
    matchBadgeText: {
        color: colors.background,
        fontWeight: '700',
        fontSize: 13,
        textTransform: 'uppercase',
    },
    matchBar: {
        height: 8,
        backgroundColor: colors.surfaceAlt,
        borderRadius: radius.md,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    matchBarFill: {
        height: '100%',
        borderRadius: radius.md,
    },
    matchMessage: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    likeOverlay: {
        position: 'absolute',
        top: spacing.xl,
        left: spacing.xl,
        zIndex: 1,
    },
    nopeOverlay: {
        position: 'absolute',
        top: spacing.xl,
        right: spacing.xl,
        zIndex: 1,
    },
    overlayBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
    },
    likeBadge: {
        backgroundColor: colors.primary,
    },
    nopeBadge: {
        backgroundColor: colors.primaryPale,
    },
    overlayText: {
        color: colors.background,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginLeft: spacing.xs,
    },
    overlayIcon: {
        marginRight: spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    actionButton: {
        width: 68,
        height: 68,
        borderRadius: 34,
        marginRight: spacing.lg,
        backgroundColor: colors.background,
        paddingHorizontal: 0,
    },
    primaryAction: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        borderColor: 'transparent',
        paddingHorizontal: 0,
    },
    likedCount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: spacing.sm,
    },
    likedIcon: {
        marginRight: spacing.sm,
    },
    likedCountText: {
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: '600',
    },
    bottomCta: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
});
