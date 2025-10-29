import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { AppButton } from '../components/common';
import { spacing } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';

export default function CameraCaptureScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const screenHeight = Dimensions.get('screen').height;
  const headerHeight = screenHeight / 5;
  const headerOffset = Math.ceil(headerHeight) + spacing.xl; // offset accru sous le header

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!permission) return;
    if (permission.status === 'undetermined') {
      requestPermission();
    }
  }, [permission?.status]);

  const navigateWithBase64 = async (base64) => {
    // Demande perm localisation pour enrichir l'analyse environnementale
    let coords = null;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === Location.PermissionStatus.GRANTED) {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      }
    } catch {}
    navigation.navigate({ name: 'BeautyAnalysis', params: { base64, coords }, merge: true });
  };

  const capture = async () => {
    if (!cameraRef.current || busy || !ready) return;
    try {
      setBusy(true);
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.55, skipProcessing: true });
      const base64 = photo?.base64;
      if (!base64) { setBusy(false); return; }
      await navigateWithBase64(base64);
    } catch (e) {
      // ignore
    } finally {
      setBusy(false);
    }
  };

  const openGalleryFallback = async () => {
    try {
      setBusy(true);
      const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libPerm.status !== 'granted') return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true, quality: 0.6 });
      if (res.canceled) return;
      const base64 = res.assets?.[0]?.base64;
      if (!base64) return;
      await navigateWithBase64(base64);
    } finally {
      setBusy(false);
    }
  };

  // Sur Web uniquement → Forcer la galerie
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }] }>
        <Header
          headerTitle="Analyse visage"
          headerSubtitle="Choisissez une photo depuis la galerie."
          navigation={navigation}
        />
        <View style={{ width: '100%', paddingHorizontal: spacing.lg, paddingTop: headerOffset }}>
          <Text style={{ color: colors.textPrimary, marginBottom: spacing.md, textAlign: 'center', paddingHorizontal: spacing.xl, fontSize: 15, lineHeight: 22 }}>
            La caméra n'est pas disponible sur la version Web. Utilisez la galerie.
          </Text>
          <AppButton 
            label={busy ? 'Chargement...' : 'Choisir une photo dans la galerie'} 
            onPress={openGalleryFallback} 
            disabled={busy}
            icon={{ name: 'image', provider: 'Ionicons' }}
          />
          <Text style={{ color: colors.textMuted, marginTop: spacing.lg, textAlign: 'center', paddingHorizontal: spacing.xl, fontSize: 13 }}>
            💡 Astuce : Sélectionnez un selfie bien éclairé avec votre visage centré
          </Text>
        </View>
      </View>
    );
  }

  if (!permission) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (!permission.granted) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }] }>
        <Header
          headerTitle="Autoriser la caméra"
          headerSubtitle="Nous en avons besoin pour analyser votre peau."
          navigation={navigation}
        />
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: headerOffset, width: '100%' }}>
          <Text style={{ color: colors.textPrimary, marginBottom: spacing.md, textAlign: 'center' }}>Autorisez l'accès à la caméra</Text>
          <AppButton label="Autoriser" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        headerTitle="Prendre une photo"
        headerSubtitle="Centrez votre visage pour des recommandations personnalisées"
        navigation={navigation}
      />
      <View style={{ flex: 1, paddingTop: headerOffset }}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front" onCameraReady={() => setReady(true)} />
        {/* Overlay de cadrage */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={styles.overlayContainer}>
            <View style={styles.faceGuide} />
            <Text style={styles.tips}>Centrez votre visage, regardez la caméra, lumière homogène.</Text>
          </View>
        </View>
      </View>
      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <AppButton 
          label={busy ? 'Traitement...' : (ready ? 'Capturer' : 'Préparation…')} 
          onPress={capture} 
          disabled={!ready || busy}
          icon={{ name: 'camera', provider: 'Ionicons' }}
        />
        <AppButton 
          label="Ou choisir dans la galerie" 
          onPress={openGalleryFallback} 
          variant="outline"
          style={{ marginTop: spacing.sm }}
          icon={{ name: 'image', provider: 'Ionicons' }}
        />
      </SafeAreaView>
    </View>
  );
}

const getStyles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  camera: { flex: 1 },
  footer: { padding: spacing.lg, paddingBottom: spacing.xl },
  overlayContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  faceGuide: {
    width: '60%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: 'transparent',
  },
  tips: { position: 'absolute', bottom: spacing.xl, color: c.onPrimaryText, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 6 },
});
