import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

const MOCK_STATIONS = [
  { id: 'S1', name: 'Borne Eco-Refill - Centre Ville', coords: { latitude: 48.8566, longitude: 2.3522 }, emoji: '🏙️' },
  { id: 'S2', name: 'Borne Eco-Refill - Gare', coords: { latitude: 48.8582, longitude: 2.2945 }, emoji: '🚉' },
  { id: 'S3', name: 'Borne Eco-Refill - Centre Commercial', coords: { latitude: 48.8606, longitude: 2.3376 }, emoji: '🛍️' },
  { id: 'S4', name: "Borne Eco-Refill - Université", coords: { latitude: 48.8422, longitude: 2.3449 }, emoji: '🎓' },
];

export default function RefillMapScreen({ route, navigation }) {
  const selectedProducts = route?.params?.selectedProducts || [];
  const [center, setCenter] = useState({ latitude: 48.8566, longitude: 2.3522 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setReady(true);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setCenter({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        setReady(true);
      } catch (e) {
        setReady(true);
      }
    })();
  }, []);

  const embedUrl = `https://maps.google.com/maps?q=${center.latitude},${center.longitude}&z=13&output=embed`;
  const openDirections = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bornes de Recharge à Proximité</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapBox}>
        <iframe
          title="map"
          src={embedUrl}
          style={styles.iframe}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </View>

      <View style={styles.stationList}>
        {MOCK_STATIONS.map((s) => (
          <View key={s.id} style={styles.stationCard}>
            <Text style={styles.stationEmoji}>{s.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stationName}>{s.name}</Text>
              <Text style={styles.stationDistance}>Cliquez pour l'itinéraire</Text>
            </View>
            <TouchableOpacity style={styles.navigateBtn} onPress={() => openDirections(s.coords.latitude, s.coords.longitude)}>
              <Text style={styles.navigateText}>Itinéraire</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.qrBtn} onPress={() => navigation.navigate('QRCode', { selectedProducts })}>
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

  mapBox: { height: 320, marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', backgroundColor: '#e8f5e9' },
  iframe: { border: 0, width: '100%', height: '100%' },

  stationList: { paddingHorizontal: 20, marginTop: 12 },
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
