import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { generateQRData, calculateImpact } from '../utils/recommendations';
import { addRefillToHistory } from '../utils/storage';

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
    try {
      await Share.share({ message: qrData });
    } catch (e) {}
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator
      scrollEnabled
      nestedScrollEnabled
    >
      <View style={styles.header}>
        <Text style={styles.title}>Votre QR Code</Text>
        <Text style={styles.subtitle}>À présenter à la borne pour recharger vos produits</Text>
      </View>

      <View style={styles.qrWrapper}>
        {qrData ? (
          <QRCode value={qrData} size={220} />
        ) : (
          <Text>Génération du QR Code…</Text>
        )}
      </View>
      <Text style={styles.qrInfo}>Contient vos préférences et les produits sélectionnés</Text>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareText}>Partager</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produits choisis</Text>
        {selectedProducts.length === 0 ? (
          <Text style={styles.sectionText}>Aucun produit sélectionné</Text>
        ) : (
          selectedProducts.map((p) => (
            <View key={p.id} style={styles.productRow}>
              <Text style={styles.productEmoji}>{p.image}</Text>
              <Text style={styles.productName}>{p.name}</Text>
            </View>
          ))
        )}
      </View>

      {impact && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impact estimé</Text>
          <Text style={styles.sectionText}>Plastique économisé/mois: {impact.plasticSavedPerMonth.toFixed(0)} g</Text>
          <Text style={styles.sectionText}>CO₂ évité/mois: {impact.co2SavedPerMonth.toFixed(2)} kg</Text>
        </View>
      )}

      {/* Simuler une recharge pour débloquer récompenses */}
      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: '#1e88e5' }]}
        onPress={async () => {
          await addRefillToHistory({ products: selectedProducts });
          navigation.navigate('Dashboard');
        }}
      >
        <Text style={styles.shareText}>J'ai rechargé (simuler)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: '#2e7d32' }]}
        onPress={() => navigation.navigate('RefillMap', { selectedProducts })}
      >
        <Text style={styles.shareText}>Localiser une borne</Text>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100, // Extra padding at bottom
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  qrWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  qrInfo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  shareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
