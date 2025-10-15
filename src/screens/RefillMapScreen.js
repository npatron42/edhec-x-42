import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';

// Points simulés des bornes de recharge (latitude/longitude fictives)
const MOCK_STATIONS = [
  { id: 'S1', name: 'Borne Eco-Refill - Centre Ville', coords: { lat: 48.8566, lng: 2.3522 }, distance: '0.8 km', emoji: '🏙️' },
  { id: 'S2', name: 'Borne Eco-Refill - Gare', coords: { lat: 48.8582, lng: 2.2945 }, distance: '1.4 km', emoji: '🚉' },
  { id: 'S3', name: 'Borne Eco-Refill - Centre Commercial', coords: { lat: 48.8606, lng: 2.3376 }, distance: '2.1 km', emoji: '🛍️' },
  { id: 'S4', name: "Borne Eco-Refill - Université", coords: { lat: 48.8422, lng: 2.3449 }, distance: '3.0 km', emoji: '🎓' },
];

export default function RefillMapScreen({ route, navigation }) {
  const selectedProducts = route?.params?.selectedProducts || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bornes de Recharge à Proximité</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Carte simulée */}
      <View style={styles.map}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapHelp}>Carte simulée (points de recharge)</Text>
        <View style={styles.mapPoints}>
          {MOCK_STATIONS.map((s) => (
            <View key={s.id} style={styles.point}>
              <Text style={styles.pointEmoji}>📍</Text>
              <Text style={styles.pointLabel}>{s.name} — {s.distance}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Liste des stations */}
      <ScrollView style={styles.stationList} contentContainerStyle={{ paddingBottom: 20 }}>
        {MOCK_STATIONS.map((s) => (
          <View key={s.id} style={styles.stationCard}>
            <Text style={styles.stationEmoji}>{s.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stationName}>{s.name}</Text>
              <Text style={styles.stationDistance}>Distance: {s.distance}</Text>
            </View>
            <TouchableOpacity style={styles.navigateBtn} onPress={() => {/* open maps deep link later */}}>
              <Text style={styles.navigateText}>Itinéraire</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.qrBtn}
        onPress={() => navigation.navigate('QRCode', { selectedProducts })}
      >
        <Text style={styles.qrBtnText}>Générer mon QR Code</Text>
        <Text style={styles.qrBtnIcon}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff',
  },
  backButton: { padding: 10 },
  backButtonText: { fontSize: 28, color: '#2e7d32' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },

  map: {
    marginHorizontal: 20, marginBottom: 10, borderRadius: 16, backgroundColor: '#e8f5e9',
    padding: 20,
  },
  mapEmoji: { fontSize: 40, textAlign: 'center' },
  mapHelp: { fontSize: 12, color: '#2e7d32', textAlign: 'center', marginTop: 6 },
  mapPoints: { marginTop: 12 },
  point: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  pointEmoji: { marginRight: 8 },
  pointLabel: { fontSize: 13, color: '#1a1a1a' },

  stationList: { paddingHorizontal: 20 },
  stationCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 14,
    borderRadius: 12, marginBottom: 10,
  },
  stationEmoji: { fontSize: 24, marginRight: 12 },
  stationName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  stationDistance: { fontSize: 12, color: '#666' },

  navigateBtn: {
    backgroundColor: '#2e7d32', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10,
  },
  navigateText: { color: '#fff', fontWeight: '600' },

  qrBtn: {
    backgroundColor: '#2e7d32', margin: 20, paddingVertical: 16, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  qrBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  qrBtnIcon: { color: '#fff', fontSize: 20 },
});
