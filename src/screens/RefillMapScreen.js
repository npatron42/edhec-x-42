import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// Points simulés des bornes de recharge (latitude/longitude fictives autour de Paris)
const MOCK_STATIONS = [
  { id: 'S1', name: 'Borne Eco-Refill - Centre Ville', coords: { latitude: 48.8566, longitude: 2.3522 }, emoji: '🏙️' },
  { id: 'S2', name: 'Borne Eco-Refill - Gare', coords: { latitude: 48.8582, longitude: 2.2945 }, emoji: '🚉' },
  { id: 'S3', name: 'Borne Eco-Refill - Centre Commercial', coords: { latitude: 48.8606, longitude: 2.3376 }, emoji: '🛍️' },
  { id: 'S4', name: "Borne Eco-Refill - Université", coords: { latitude: 48.8422, longitude: 2.3449 }, emoji: '🎓' },
];

export default function RefillMapScreen({ route, navigation }) {
  const selectedProducts = route?.params?.selectedProducts || [];
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg("Permission de localisation refusée");
          // Fallback sur Paris
          const fallback = { latitude: 48.8566, longitude: 2.3522 };
          setLocation(fallback);
          setRegion({ ...fallback, latitudeDelta: 0.08, longitudeDelta: 0.08 });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setLocation(coords);
        setRegion({ ...coords, latitudeDelta: 0.08, longitudeDelta: 0.08 });
      } catch (e) {
        setErrorMsg('Erreur localisation');
        const fallback = { latitude: 48.8566, longitude: 2.3522 };
        setLocation(fallback);
        setRegion({ ...fallback, latitudeDelta: 0.08, longitudeDelta: 0.08 });
      }
    })();
  }, []);

  const openQRCode = () => navigation.navigate('QRCode', { selectedProducts });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bornes de Recharge à Proximité</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Carte */}
      <View style={styles.mapWrapper}>
        {!region ? (
          <View style={styles.loader}>
            <ActivityIndicator color="#2e7d32" />
            <Text style={{ color: '#666', marginTop: 8 }}>Localisation en cours…</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={!!location}
            followsUserLocation={false}
            showsMyLocationButton
          >
            {MOCK_STATIONS.map((s) => (
              <Marker key={s.id} coordinate={s.coords} title={s.name} description="Borne de recharge Eco-Refill">
                <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
                <Callout onPress={openQRCode}>
                  <View style={{ maxWidth: 220 }}>
                    <Text style={{ fontWeight: '700' }}>{s.name}</Text>
                    <Text style={{ color: '#666', marginTop: 4 }}>Appuyez pour générer votre QR Code</Text>
                    <Text style={{ color: '#2e7d32', marginTop: 6 }}>Produits sélectionnés: {selectedProducts.length}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}
      </View>

      {/* Aide web / permissions */}
      {Platform.OS === 'web' && (
        <View style={styles.webHelp}>
          <Text style={styles.webHelpText}>Si la carte ne s'affiche pas, vérifiez les permissions de localisation du navigateur.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.qrBtn} onPress={openQRCode}>
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

  mapWrapper: { flex: 1, marginHorizontal: 20, marginBottom: 10, borderRadius: 16, overflow: 'hidden' },
  map: { flex: 1 },
  loader: { height: 260, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f5e9', borderRadius: 16 },

  webHelp: { marginHorizontal: 20, marginTop: 10, backgroundColor: '#f8f9fa', padding: 12, borderRadius: 10 },
  webHelpText: { color: '#666', fontSize: 12, textAlign: 'center' },

  qrBtn: {
    backgroundColor: '#2e7d32', margin: 20, paddingVertical: 16, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  qrBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  qrBtnIcon: { color: '#fff', fontSize: 20 },
});
