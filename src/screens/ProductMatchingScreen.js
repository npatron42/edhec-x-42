import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { getRecommendedProducts, getMatchMessage } from '../utils/recommendations';
import { saveSelectedProducts } from '../utils/storage';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function ProductMatchingScreen({ route, navigation }) {
  const { answers } = route.params;
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState([]);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const recommended = getRecommendedProducts(answers);
    setProducts(recommended);
  }, [answers]);

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
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width + 100, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      const currentProduct = products[currentIndex];
      setLikedProducts([...likedProducts, currentProduct]);
      nextCard();
    });
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width - 100, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const nextCard = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const handleLike = () => {
    swipeRight();
  };

  const handlePass = () => {
    swipeLeft();
  };

  const handleFinish = async () => {
    await saveSelectedProducts(likedProducts);
    navigation.navigate('QRCode', { 
      answers, 
      selectedProducts: likedProducts 
    });
  };

  if (currentIndex >= products.length) {
    return (
      <View style={styles.finishedContainer}>
        <Text style={styles.finishedEmoji}>🎉</Text>
        <Text style={styles.finishedTitle}>Sélection terminée !</Text>
        <Text style={styles.finishedText}>
          Vous avez sélectionné {likedProducts.length} produit(s)
        </Text>
        
        <View style={styles.selectedProducts}>
          {likedProducts.map((product, index) => (
            <View key={index} style={styles.selectedProduct}>
              <Text style={styles.selectedProductEmoji}>{product.image}</Text>
              <Text style={styles.selectedProductName}>{product.name}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Générer mon QR Code</Text>
          <Text style={styles.finishButtonIcon}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentIndex(0)} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Recommencer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentProduct = products[currentIndex];
  const matchInfo = getMatchMessage(currentProduct.matchScore || 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vos Recommandations</Text>
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {products.length}
          </Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        {/* Next Card (preview) */}
        {currentIndex < products.length - 1 && (
          <View style={[styles.card, styles.nextCard]}>
            <Text style={styles.cardEmoji}>{products[currentIndex + 1].image}</Text>
          </View>
        )}

        {/* Current Card */}
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
          {/* Like/Nope overlays */}
          <Animated.View style={[styles.likeOverlay, { opacity: likeOpacity }]}>
            <Text style={styles.likeText}>J'AIME</Text>
          </Animated.View>
          <Animated.View style={[styles.nopeOverlay, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeText}>PASSER</Text>
          </Animated.View>

          {/* Card content */}
          <View style={styles.cardContent}>
            <View style={[styles.matchBadge, { backgroundColor: matchInfo.color }]}>
              <Text style={styles.matchBadgeText}>{matchInfo.title}</Text>
            </View>

            <Text style={styles.cardEmoji}>{currentProduct.image}</Text>
            <Text style={styles.cardTitle}>{currentProduct.name}</Text>
            <Text style={styles.cardDescription}>{currentProduct.description}</Text>

            <View style={styles.benefits}>
              {currentProduct.benefits.slice(0, 3).map((benefit, index) => (
                <View key={index} style={styles.benefitTag}>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.impact}>
              <View style={styles.impactItem}>
                <Text style={styles.impactIcon}>♻️</Text>
                <Text style={styles.impactText}>{currentProduct.plasticSaved}g plastique</Text>
              </View>
              <View style={styles.impactItem}>
                <Text style={styles.impactIcon}>🌱</Text>
                <Text style={styles.impactText}>{currentProduct.co2Saved}kg CO₂</Text>
              </View>
            </View>

            <View style={styles.matchInfo}>
              <View style={styles.matchBar}>
                <View
                  style={[
                    styles.matchBarFill,
                    { 
                      width: `${currentProduct.matchScore}%`,
                      backgroundColor: matchInfo.color 
                    },
                  ]}
                />
              </View>
              <Text style={styles.matchMessage}>{matchInfo.message}</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handlePass}>
          <Text style={styles.actionButtonIcon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike}>
          <Text style={styles.actionButtonIcon}>❤️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.likedCount}>
        <Text style={styles.likedCountText}>
          ❤️ {likedProducts.length} produit(s) sélectionné(s)
        </Text>
      </View>

      {/* Bouton pour localiser les bornes */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#2e7d32', borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
          onPress={() => navigation.navigate('RefillMap', { selectedProducts: likedProducts })}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Trouver une borne à proximité</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: '#2e7d32',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  counter: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: width - 40,
    height: height * 0.6,
    backgroundColor: '#fff',
    borderRadius: 20,
    position: 'absolute',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.5,
  },
  likeOverlay: {
    position: 'absolute',
    top: 50,
    right: 30,
    transform: [{ rotate: '20deg' }],
    zIndex: 1,
  },
  likeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    borderWidth: 4,
    borderColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  nopeOverlay: {
    position: 'absolute',
    top: 50,
    left: 30,
    transform: [{ rotate: '-20deg' }],
    zIndex: 1,
  },
  nopeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f44336',
    borderWidth: 4,
    borderColor: '#f44336',
    padding: 10,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchBadge: {
    position: 'absolute',
    top: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  matchBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  benefitTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
  },
  benefitText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  impact: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  impactItem: {
    alignItems: 'center',
  },
  impactIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  impactText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  matchInfo: {
    width: '100%',
  },
  matchBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  matchBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  matchMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 40,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f44336',
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonIcon: {
    fontSize: 32,
  },
  likedCount: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  likedCountText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  finishedEmoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  finishedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  finishedText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  selectedProducts: {
    width: '100%',
    marginBottom: 30,
  },
  selectedProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  selectedProductEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  selectedProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  finishButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  finishButtonIcon: {
    color: '#fff',
    fontSize: 24,
  },
  retryButton: {
    padding: 15,
  },
  retryButtonText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
