import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Platform, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import { getRecommendedProducts, getMatchMessage } from '../utils/recommendations';
import { saveSelectedProducts } from '../utils/storage';
import { spacing, radius, shadow, typography } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.xl * 2;
const SWIPE_THRESHOLD = 120;

export default function ProductMatchingScreen({ route, navigation }) {
    const { colors, isDark } = useTheme();
    const { answers = {} } = route.params || {};
    const { width: winW, height: winH } = useWindowDimensions();
    const scrollRef = useRef(null);

    // Dimensions responsives pour les cartes
    const horizontalPadding = spacing.xl;
    const cardWidth = Math.max(320, Math.min(winW - horizontalPadding * 2, 600));
    const baseCardHeight = winH < 700 ? winH * 0.55 : winH * 0.58;
    const maxCardHeight = Math.max(400, winH - 340);
    const cardHeight = Math.max(400, Math.min(baseCardHeight, maxCardHeight));
    const emojiSize = Math.max(56, Math.min(100, Math.floor(cardHeight * 0.18)));
    const contentPadding = winH < 700 ? spacing.lg : spacing.xxl;
    const contentMinHeight = Math.max(320, cardHeight - contentPadding * 2);

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
            // Ne capte que les gestes majoritairement horizontaux
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gesture) => {
                const dx = Math.abs(gesture.dx);
                const dy = Math.abs(gesture.dy);
                return dx > 12 && dx > dy * 1.2;
            },
            onPanResponderMove: (_, gesture) => {
                position.setValue({ x: gesture.dx, y: 0 });
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
    }, [JSON.stringify(answers)]);

    // Toujours revenir en haut quand on change de carte
    useEffect(() => {
        if (scrollRef.current) {
            try { scrollRef.current.scrollTo({ y: 0, animated: false }); } catch {}
        }
    }, [currentIndex]);

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
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
                <AppHeader
                    title="Vos Recommandations"
                    subtitle="Résultats"
                    onBack={() => navigation.goBack()}
                    compact
                />
                <ScrollView 
                    style={[styles.finishedContainer, { backgroundColor: colors.surface }]}
                    contentContainerStyle={styles.finishedContentContainer}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    <View style={styles.finishedContent}>
                        <View style={[styles.celebrationIconWrapper, { backgroundColor: colors.primaryLight }]}>
                            <AppIcon
                                name="party-popper"
                                provider="MaterialCommunityIcons"
                                size={64}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={[styles.finishedTitle, { color: colors.textPrimary }]}>Sélection terminée !</Text>
                        <Text style={[styles.finishedText, { color: colors.textSecondary }]}>
                            Vous avez sélectionné {likedProducts.length} produit(s) personnalisé(s)
                        </Text>
                        
                        <View style={styles.selectedProducts}>
                            {likedProducts.filter(p => p).map((product, index) => (
                                <View key={`selected-${index}`} style={[styles.selectedProduct, { borderRadius: radius.xl }]}>
                                    <LinearGradient
                                        colors={
                                            index % 2 === 0
                                                ? [colors.surface, colors.primaryLight]
                                                : [colors.surface, colors.accentLight]
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.selectedProductGradient}
                                    >
                                        <Text style={styles.selectedProductEmoji}>
                                            {product?.image || '🧴'}
                                        </Text>
                                        <View style={styles.selectedProductInfo}>
                                            <Text style={[styles.selectedProductName, { color: colors.textPrimary }]}>
                                                {product?.name || 'Produit'}
                                            </Text>
                                            <Text style={[styles.selectedProductBenefits, { color: colors.textSecondary }]}>
                                                {product?.benefits?.slice(0, 2).join(' • ') || ''}
                                            </Text>
                                        </View>
                                        <View style={styles.selectedProductCheck}>
                                            <AppIcon
                                                name="checkmark-circle"
                                                provider="Ionicons"
                                                size={28}
                                                color={colors.primary}
                                            />
                                        </View>
                                    </LinearGradient>
                                </View>
                            ))}
                        </View>

                        <View style={styles.buttonsContainer}>
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
                </ScrollView>
            </SafeAreaView>
        );
    }

    const currentProduct = products[currentIndex];
    const matchInfo = getMatchMessage(currentProduct.matchScore || 0, isDark);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.inlineHeader, { paddingHorizontal: spacing.xl, paddingTop: spacing.md }]}>
              <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour">
                <AppIcon name="arrow-back" provider="Ionicons" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={{ ...typography.h4, color: colors.textPrimary, marginLeft: spacing.sm, flex: 1 }}>Vos Recommandations</Text>
              <View style={[styles.counter, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.counterText, { color: colors.primary }]}>
                    {currentIndex + 1} / {products.length}
                </Text>
              </View>
            </View>

            <View style={[styles.cardContainer, { paddingHorizontal: horizontalPadding, paddingTop: spacing.md, marginTop: spacing.sm }]}> 
                {currentIndex < products.length - 1 && products[currentIndex + 1] && (
                    <View style={[styles.card, { backgroundColor: colors.surface }, styles.nextCard, { width: cardWidth, height: cardHeight, transform: [{ scale: 0.94 }] }]}> 
                        {/* Intentionally left empty to avoid showing the next product logo */}
                    </View>
                )}

                {currentProduct && (
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.card,
                        { width: cardWidth, height: cardHeight, backgroundColor: colors.surface },
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
                                    backgroundColor: colors.primary,
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
                            <Text style={[styles.overlayText, { color: colors.background }]}>J'aime</Text>
                        </Animated.View>
                    </View>
                    <View style={styles.nopeOverlay}>
                        <Animated.View
                            style={[
                                styles.overlayBadge,
                                styles.nopeBadge,
                                {
                                    backgroundColor: colors.textMuted,
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
                            <Text style={[styles.overlayText, { color: colors.background }]}>Passer</Text>
                        </Animated.View>
                    </View>

                    <ScrollView ref={scrollRef} style={styles.cardScroll} contentContainerStyle={[styles.cardContent, { padding: contentPadding, minHeight: contentMinHeight }] } showsVerticalScrollIndicator={false} bounces>
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
                            <Text style={[styles.matchBadgeText, { color: colors.onPrimaryText }]}>{matchInfo.title}</Text>
                        </View>
                        <Text style={[styles.cardEmoji, { fontSize: emojiSize }]}>{currentProduct?.image || '🧴'}</Text>
                        <Text numberOfLines={2} style={[styles.cardTitle, { color: colors.textPrimary }]}>{currentProduct?.name || ''}</Text>
                        <Text numberOfLines={3} style={[styles.cardDescription, { color: colors.textSecondary, lineHeight: 22 }]}>
                            {currentProduct?.description || ''}
                        </Text>

                        <View style={styles.benefits}>
                            {(currentProduct?.benefits || []).slice(0, 3).map((benefit, index) => (
                                 <View key={`${currentIndex}-${index}`} style={[styles.benefitTag, { backgroundColor: colors.primaryLight }]}>
                                     <Text style={[styles.benefitText, { color: colors.primary }]}>{benefit}</Text>
                                 </View>
                             ))}
                        </View>

                        {/* Raisons explicables issues du profil IA */}
                        {Array.isArray(currentProduct._reasons) && currentProduct._reasons.length > 0 ? (
                          <View style={[styles.reasonsBox, { backgroundColor: colors.background }]}>
                            <View style={styles.reasonsHeader}>
                              <AppIcon provider="Ionicons" name="information-circle" size={16} color={colors.primary} />
                              <Text style={[styles.reasonsTitle, { color: colors.textSecondary }]}>Pourquoi ce produit</Text>
                            </View>
                            {currentProduct._reasons.slice(0,3).map((r, i) => (
                              <View key={`reason-${currentIndex}-${i}`} style={styles.reasonItem}>
                                <View style={[styles.reasonDot, { backgroundColor: colors.primary }]} />
                                <Text style={[styles.reasonText, { color: colors.textSecondary }]}>{r}</Text>
                              </View>
                            ))}
                          </View>
                        ) : null}

                        <View style={styles.impact}>
                             <View style={styles.impactItem}>
                                 <AppIcon
                                     name='recycle'
                                     provider='MaterialCommunityIcons'
                                     size={24}
                                     color={colors.primary}
                                     style={styles.impactIcon}
                                 />
                                 <Text style={[styles.impactLabel, { color: colors.textMuted }]}>Plastique</Text>
                                 <Text style={[styles.impactValue, { color: colors.textPrimary }]}>
                                    {currentProduct?.plasticSaved ?? 0} g
                                 </Text>
                             </View>
                             <View style={styles.impactItem}>
                                 <AppIcon
                                     name='leaf'
                                     provider='MaterialCommunityIcons'
                                     size={24}
                                     color={colors.primary}
                                     style={styles.impactIcon}
                                 />
                                 <Text style={[styles.impactLabel, { color: colors.textMuted }]}>CO₂</Text>
                                 <Text style={[styles.impactValue, { color: colors.textPrimary }]}>
                                    {currentProduct?.co2Saved ?? 0} kg
                                 </Text>
                             </View>
                         </View>

                         <View style={styles.matchInfo}>
                             <View style={[styles.matchBar, { backgroundColor: colors.surfaceAlt }]}>
                                 <View
                                     style={[
                                         styles.matchBarFill,
                                         {
                                            width: `${currentProduct?.matchScore ?? 0}%`,
                                             backgroundColor: matchInfo.color,
                                         },
                                     ]}
                                 />
                             </View>
                             <Text style={[styles.matchMessage, { color: colors.textSecondary }]}>
                                 {matchInfo.message}
                             </Text>
                         </View>
                    </ScrollView>
                </Animated.View>
                )}
            </View>

            <View style={styles.actions}>
                <AppButton
                    variant="outline"
                    icon={{ name: 'close', provider: 'Ionicons', size: 28 }}
                    onPress={handlePass}
                    style={[styles.actionButton, { backgroundColor: colors.surface }]}
                />
                <AppButton
                    icon={{ name: 'heart', provider: 'Ionicons', size: 26 }}
                    onPress={handleLike}
                    style={[styles.primaryAction, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                />
            </View>

            <View style={[styles.likedCount, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <AppIcon
                    name="heart"
                    provider="Ionicons"
                    size={18}
                    color={colors.primary}
                    style={styles.likedIcon}
                />
                <Text style={[styles.likedCountText, { color: colors.textPrimary }]}>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
    },
    finishedContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        ...(Platform.OS === 'web' && { height: '100vh', overflow: 'auto' }),
    },
    finishedContentContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxxl,
        ...(Platform.OS === 'web' && { minHeight: '100vh' }),
    },
    buttonsContainer: {
        width: '100%',
        paddingTop: spacing.lg,
    },
    celebrationIconWrapper: {
        width: 120,
        height: 120,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: spacing.lg,
        ...shadow.soft,
    },
    finishedTitle: {
        ...typography.h1,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    finishedText: {
        ...typography.body,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    selectedProducts: {
        width: '100%',
        marginBottom: spacing.xl,
    },
    selectedProduct: {
        marginBottom: spacing.md,
        overflow: 'hidden',
        ...shadow.card,
    },
    selectedProductGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
    },
    selectedProductEmoji: {
        fontSize: 40,
        marginRight: spacing.md,
    },
    selectedProductInfo: {
        flex: 1,
    },
    selectedProductName: {
        ...typography.h4,
    },
    selectedProductBenefits: {
        ...typography.body,
        marginTop: spacing.xs,
    },
    selectedProductCheck: {
        marginLeft: spacing.md,
    },
    ctaButton: {
        width: '100%',
        marginBottom: spacing.md,
        ...shadow.soft,
    },
    secondaryButton: {
        width: '100%',
        marginBottom: spacing.md,
    },
    counter: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
    },
    counterText: {
        ...typography.label,
        fontWeight: '700',
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        marginTop: spacing.sm,
        zIndex: 1,
    },
    card: {
        width: CARD_WIDTH,
        height: height * 0.62,
        borderRadius: radius.xxl,
        ...shadow.card,
        position: 'absolute',
        overflow: 'hidden',
    },
    cardScroll: { flex: 1 },
    cardContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardEmoji: {
        fontSize: 80,
        marginBottom: spacing.lg,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    cardTitle: {
        ...typography.h2,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    cardDescription: {
        ...typography.body,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 22,
    },
    benefits: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    benefitTag: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
    },
    benefitText: {
        ...typography.caption,
        fontWeight: '600',
    },
    impact: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: spacing.lg,
        paddingVertical: spacing.lg,
        borderRadius: radius.xl,
        ...shadow.soft,
    },
    impactItem: {
        alignItems: 'center',
    },
    impactIcon: {
        marginBottom: spacing.xs,
    },
    impactLabel: {
        ...typography.caption,
    },
    impactValue: {
        ...typography.label,
        marginTop: spacing.xs,
    },
    matchInfo: {
        width: '100%',
    },
    matchBadge: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        maxWidth: '70%',
        ...shadow.soft,
    },
    matchBadgeText: {
        ...typography.caption,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    matchBar: {
        height: 10,
        borderRadius: radius.full,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    matchBarFill: {
        height: '100%',
        borderRadius: radius.full,
    },
    matchMessage: {
        ...typography.body,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    likeOverlay: {
        position: 'absolute',
        top: spacing.lg,
        left: spacing.lg,
        zIndex: 1,
    },
    nopeOverlay: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        zIndex: 1,
    },
    overlayBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.xl,
        ...shadow.soft,
    },
    likeBadge: {},
    nopeBadge: {},
    overlayText: {
        ...typography.label,
        textTransform: 'uppercase',
    },
    overlayIcon: {
        marginRight: spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl,
        gap: spacing.xl,
    },
    actionButton: {
        width: 64,
        height: 64,
        borderRadius: radius.full,
        paddingHorizontal: 0,
        ...shadow.soft,
    },
    primaryAction: {
        width: 72,
        height: 72,
        borderRadius: radius.full,
        justifyContent: 'center',
        paddingHorizontal: 0,
        ...shadow.strong,
    },
    likedCount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: spacing.md,
        marginHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
        borderWidth: 1,
        ...shadow.soft,
    },
    likedIcon: {
        marginRight: spacing.sm,
    },
    likedCountText: {
        ...typography.label,
    },
    bottomCta: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
    },
    reasonsBox: {
      width: '100%',
      borderRadius: radius.xl,
      padding: spacing.md,
      marginBottom: spacing.lg,
      ...shadow.soft,
    },
    reasonsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
    reasonsTitle: { ...typography.caption, fontWeight: '700' },
    reasonItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.xs },
    reasonDot: { width: 6, height: 6, borderRadius: radius.full, marginTop: 8 },
    reasonText: { ...typography.caption, flex: 1 },
    inlineHeader: { flexDirection: 'row', alignItems: 'center' },
});
