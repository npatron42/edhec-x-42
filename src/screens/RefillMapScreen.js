import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Platform,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import { colors, spacing, radius, shadow } from '../styles/theme';

const MOCK_STATIONS = [
    {
        id: 'S1',
        name: 'Borne Eco-Refill - Centre Ville',
        coords: { latitude: 48.8566, longitude: 2.3522 },
    },
    {
        id: 'S2',
        name: 'Borne Eco-Refill - Gare',
        coords: { latitude: 48.8582, longitude: 2.2945 },
    },
    {
        id: 'S3',
        name: 'Borne Eco-Refill - Centre Commercial',
        coords: { latitude: 48.8606, longitude: 2.3376 },
    },
    {
        id: 'S4',
        name: 'Borne Eco-Refill - Université',
        coords: { latitude: 48.8422, longitude: 2.3449 },
    },
];

const FALLBACK_REGION = {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
};

export default function RefillMapScreen({ route, navigation }) {
    const selectedProducts = route?.params?.selectedProducts || [];
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== Location.PermissionStatus.GRANTED) {
                    setError('Permission de localisation refusée');
                    setRegion(FALLBACK_REGION);
                    setLoading(false);
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                const coords = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                };
                setLocation(coords);
                setRegion({
                    ...coords,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                });
            } catch (err) {
                setError('Erreur de localisation');
                setRegion(FALLBACK_REGION);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const openQRCode = () =>
        navigation.navigate('QRCode', { selectedProducts });

    return (
        <View style={styles.container}>
            <AppHeader
                title="Bornes de Recharge"
                subtitle="Localisez une borne à proximité"
                onBack={() => navigation.goBack()}
            />

            <View style={styles.mapWrapper}>
                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator color={colors.primary} />
                        <Text style={styles.loaderText}>Localisation en cours…</Text>
                    </View>
                ) : (
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={region || FALLBACK_REGION}
                        onRegionChangeComplete={setRegion}
                        showsUserLocation={!!location}
                        followsUserLocation={false}
                        showsMyLocationButton
                    >
                        {MOCK_STATIONS.map((station) => (
                            <Marker
                                key={station.id}
                                coordinate={station.coords}
                                title={station.name}
                                description="Borne de recharge Eco-Refill"
                            >
                                <AppIcon
                                    name="map-marker"
                                    provider="MaterialCommunityIcons"
                                    size={32}
                                    color={colors.primary}
                                />
                                <Callout onPress={openQRCode}>
                                    <View style={styles.callout}>
                                        <Text style={styles.calloutTitle}>
                                            {station.name}
                                        </Text>
                                        <Text style={styles.calloutDescription}>
                                            Appuyez pour générer votre QR Code
                                        </Text>
                                        <Text style={styles.calloutSubtitle}>
                                            Produits sélectionnés :{' '}
                                            {selectedProducts.length}
                                        </Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                )}
            </View>

            {Platform.OS === 'web' ? (
                <View style={styles.webHelp}>
                    <Text style={styles.webHelpText}>
                        Si la carte ne s'affiche pas, vérifiez les permissions de
                        localisation du navigateur.
                    </Text>
                </View>
            ) : null}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.footer}>
                <AppButton
                    label="Générer mon QR Code"
                    icon={{ name: 'qr-code', provider: 'Ionicons' }}
                    onPress={openQRCode}
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
    mapWrapper: {
        flex: 1,
        marginHorizontal: spacing.xl,
        marginTop: spacing.md,
        marginBottom: spacing.md,
        borderRadius: radius.xl,
        overflow: 'hidden',
        backgroundColor: colors.background,
        ...shadow.soft,
    },
    map: {
        flex: 1,
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    loaderText: {
        marginTop: spacing.sm,
        color: colors.textMuted,
    },
    callout: {
        maxWidth: 220,
    },
    calloutTitle: {
        fontWeight: '700',
        color: colors.textPrimary,
    },
    calloutDescription: {
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    calloutSubtitle: {
        color: colors.primary,
        marginTop: spacing.sm,
        fontWeight: '600',
    },
    webHelp: {
        marginHorizontal: spacing.xl,
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        marginBottom: spacing.sm,
    },
    webHelpText: {
        color: colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
    },
    errorText: {
        textAlign: 'center',
        color: colors.danger,
        marginBottom: spacing.sm,
    },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
});
