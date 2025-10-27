import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { AppButton, AppIcon } from '../components/common';
import { spacing, radius, shadow, typography } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

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
        name: "Borne Eco-Refill - Université",
        coords: { latitude: 48.8422, longitude: 2.3449 },
    },
];

export default function RefillMapScreen({ route, navigation }) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const selectedProducts = route?.params?.selectedProducts || [];
    const [center, setCenter] = useState({
        latitude: 48.8566,
        longitude: 2.3522,
    });

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (!isMounted || status !== Location.PermissionStatus.GRANTED) {
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({});
                if (isMounted) {
                    setCenter({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    });
                }
            } catch (error) {
                // ignore: fallback already defined
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const embedUrl = `https://maps.google.com/maps?q=${center.latitude},${center.longitude}&z=13&output=embed`;

    const openDirections = (lat, lng) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    };

    return (
        <View style={styles.container}>
            {/* Hero compact avec sous-titre */}
            <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBanner}
            >
                <View style={styles.heroHeaderRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour">
                        <AppIcon name="arrow-back" provider="Ionicons" size={20} color={colors.onPrimaryText} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: spacing.sm }}>
                        <Text style={[styles.heroTitle, { color: colors.onPrimaryText }]}>Borne de recharge</Text>
                        <Text style={[styles.heroSubtitle, { color: colors.onPrimaryTextSoft }]}>Localiser les bornes et leur contenu</Text>
                    </View>
                </View>
            </LinearGradient>

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
                {MOCK_STATIONS.map((station) => (
                    <View key={station.id} style={styles.stationCard}>
                        <View style={styles.stationIcon}>
                            <AppIcon
                                name="map-marker"
                                provider="MaterialCommunityIcons"
                                size={22}
                                color={colors.primary}
                            />
                        </View>
                        <View style={styles.stationInfo}>
                            <Text style={styles.stationName}>{station.name}</Text>
                            <Text style={styles.stationHint}>
                                Cliquez pour obtenir l'itinéraire
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.navigateBtn}
                            onPress={() =>
                                openDirections(
                                    station.coords.latitude,
                                    station.coords.longitude,
                                )
                            }
                        >
                            <Text style={styles.navigateText}>Itinéraire</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.footer}>
                <AppButton
                    label="Générer mon QR Code"
                    icon={{ name: 'qr-code', provider: 'Ionicons' }}
                    onPress={() =>
                        navigation.navigate('QRCode', { selectedProducts })
                    }
                />
            </View>
        </View>
    );
}

const getStyles = (c) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: c.background,
        },
        heroBanner: { marginTop: spacing.sm, marginBottom: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.xl, ...shadow.soft },
        heroHeaderRow: { flexDirection: 'row', alignItems: 'center' },
        heroTitle: { fontSize: 18, fontWeight: '700' },
        heroSubtitle: { ...typography.bodySmall },
        mapBox: {
            height: 320,
            marginHorizontal: spacing.xl,
            borderRadius: radius.xl,
            overflow: 'hidden',
            backgroundColor: c.background,
            ...shadow.soft,
        },
        iframe: {
            border: 0,
            width: '100%',
            height: '100%',
        },
        stationList: {
            paddingHorizontal: spacing.xl,
            marginTop: spacing.lg,
        },
        stationCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: c.background,
            padding: spacing.lg,
            borderRadius: radius.lg,
            marginBottom: spacing.sm,
            ...shadow.soft,
        },
        stationIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: c.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.lg,
        },
        stationInfo: {
            flex: 1,
        },
        stationName: {
            fontSize: 15,
            fontWeight: '600',
            color: c.textPrimary,
        },
        stationHint: {
            fontSize: 12,
            color: c.textMuted,
            marginTop: spacing.xs,
        },
        navigateBtn: {
            backgroundColor: c.primary,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.md,
        },
        navigateText: {
            color: c.background,
            fontWeight: '600',
        },
        footer: {
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.xl,
        },
        // Add or override modal styles if present on web version (if you use a modal here later)
        // Keeping consistency note.
    });
