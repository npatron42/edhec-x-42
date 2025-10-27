import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRefillHistory } from '../utils/storage';
import { AppHeader, AppIcon } from '../components/common';
import { colors, spacing, radius, shadow, typography } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/ThemeProvider';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const h = await getRefillHistory();
      if (mounted) setHistory(h);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}> 
      <ScrollView style={[styles.container, { backgroundColor: themeColors.surface }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator>
        {/* Hero Dashboard-like */}
        <LinearGradient
          colors={[themeColors.primary, themeColors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroHeaderRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour">
              <AppIcon name="arrow-back" provider="Ionicons" size={22} color={themeColors.onPrimaryText} />
            </TouchableOpacity>
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={[styles.heroTitle, { color: themeColors.onPrimaryText }]}>Historique des recharges</Text>
              <Text style={[styles.heroSubtitle, { color: themeColors.onPrimaryTextSoft }]}>Votre parcours éco-responsable</Text>
            </View>
          </View>
        </LinearGradient>

        {history.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
            <AppIcon name="history" provider="MaterialCommunityIcons" size={28} color={themeColors.textMuted} />
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>Aucune recharge pour le moment</Text>
          </View>
        ) : (
          history.map((refill) => (
            <View key={refill.id || refill.date} style={[styles.item, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
              <View style={[styles.itemIcon, { backgroundColor: themeColors.primaryLight }]}> 
                <AppIcon name="refresh" provider="MaterialCommunityIcons" size={20} color={themeColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemDate, { color: themeColors.textPrimary }]}> 
                  {new Date(refill.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
                <Text style={[styles.itemProducts, { color: themeColors.textSecondary }]}> 
                  {(refill.products || []).map((p) => p.name).join(', ')}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    ...(Platform.OS === 'web' && { height: '100vh', overflow: 'auto' }),
  },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl, ...(Platform.OS === 'web' && { minHeight: '100vh' }) },
  heroBanner: { marginTop: spacing.md, marginBottom: spacing.lg, padding: spacing.xxl, borderRadius: radius.xxl, ...shadow.strong },
  heroHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  heroTitle: { ...typography.h2, marginBottom: spacing.xs },
  heroSubtitle: { ...typography.body },
  emptyCard: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, ...shadow.soft },
  emptyText: { marginTop: spacing.sm, color: colors.textMuted },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm, ...shadow.soft },
  itemIcon: { width: 44, height: 44, borderRadius: radius.full, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  itemDate: { ...typography.label, color: colors.textPrimary },
  itemProducts: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
