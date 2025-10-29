import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../styles/ThemeProvider';
import { spacing, radius } from '../../styles/theme';
import AppIcon from '../common/AppIcon';

export default function ScanSkinCard({ style }){
  const navigation = useNavigation();
  const colors = useTheme();
  const styles = getStyles(colors);

  const onPress = () => navigation.navigate('CameraCapture');

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Scan de la peau"
      style={[style, styles.specialGridItem]}
    >
      <LinearGradient colors={["#235A93", "#212F59"]} style={styles.gradientContainer}>
        <View style={[styles.iconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <AppIcon name="face-recognition" provider="MaterialCommunityIcons" color="white" size={22} />
        </View>
        <Text style={[styles.cardTitle, { color: 'white' }]}>Scan de la peau</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const getStyles = (colors) => StyleSheet.create({
  specialGridItem: { backgroundColor: 'transparent', padding: 0, borderRadius: radius.md, overflow: 'hidden' },
  gradientContainer: { flex: 1, padding: spacing.md, alignItems: 'flex-start', gap: spacing.xs, borderRadius: radius.md },
  iconBadge: { alignSelf: 'flex-start', borderRadius: radius.full, padding: spacing.sm, marginBottom: spacing.sm },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: spacing.xs },
});
