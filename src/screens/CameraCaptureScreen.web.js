import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppButton, AppHeader } from '../components/common';
import { spacing } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

export default function CameraCaptureScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [busy, setBusy] = useState(false);

  const openGallery = async () => {
    try {
      setBusy(true);
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true, quality: 0.6 });
      if (res.canceled) return;
      const base64 = res.assets?.[0]?.base64;
      if (!base64) return;
      navigation.navigate({ name: 'BeautyAnalysis', params: { base64, coords: null }, merge: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }] }>
      <AppHeader title="Analyse visage" onBack={() => navigation.goBack()} compact />
      <Text style={{ color: colors.textPrimary, marginBottom: spacing.md, textAlign: 'center', paddingHorizontal: spacing.xl, fontSize: 15, lineHeight: 22 }}>
        La caméra n'est pas disponible sur la version Web. Utilisez la galerie.
      </Text>
      <AppButton 
        label={busy ? 'Chargement...' : 'Choisir une photo dans la galerie'} 
        onPress={openGallery} 
        disabled={busy}
        icon={{ name: 'image', provider: 'Ionicons' }}
      />
      <Text style={{ color: colors.textMuted, marginTop: spacing.lg, textAlign: 'center', paddingHorizontal: spacing.xl, fontSize: 13 }}>
        💡 Astuce : Sélectionnez un selfie bien éclairé avec votre visage centré
      </Text>
    </View>
  );
}

const getStyles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
});
