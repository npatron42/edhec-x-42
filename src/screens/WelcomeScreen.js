import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>🌿</Text>
        <Text style={styles.title}>Eco-Refill</Text>
        <Text style={styles.subtitle}>AI Station</Text>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroEmoji}>♻️</Text>
        <Text style={styles.heroTitle}>
          Rechargez vos produits Dove de manière intelligente
        </Text>
        <Text style={styles.heroDescription}>
          Découvrez des recommandations personnalisées et suivez votre impact environnemental
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📋</Text>
          <Text style={styles.featureTitle}>Questionnaire personnalisé</Text>
          <Text style={styles.featureText}>
            Analysez vos besoins et votre type de peau
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✨</Text>
          <Text style={styles.featureTitle}>Recommandations IA</Text>
          <Text style={styles.featureText}>
            Match avec les produits les plus adaptés
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📱</Text>
          <Text style={styles.featureTitle}>QR Code unique</Text>
          <Text style={styles.featureText}>
            Utilisez-le aux bornes de recharge
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🌍</Text>
          <Text style={styles.featureTitle}>Impact environnemental</Text>
          <Text style={styles.featureText}>
            Suivez le plastique et CO₂ économisés
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>20 500</Text>
          <Text style={styles.statLabel}>tonnes de plastique économisées/an</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>480</Text>
          <Text style={styles.statLabel}>tonnes d'aluminium économisées/an</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Questionnaire')}
      >
        <Text style={styles.buttonText}>Commencer</Text>
        <Text style={styles.buttonIcon}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.skipButtonText}>J'ai déjà un profil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'auto',
    }),
  },
  content: {
    flexGrow: 1,
    paddingVertical: 60,
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra padding at bottom
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '300',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 15,
  },
  heroDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    paddingVertical: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 15,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  skipButton: {
    padding: 15,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
