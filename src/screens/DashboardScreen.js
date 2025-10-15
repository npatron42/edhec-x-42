import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  getImpactStats,
  getRefillHistory,
  getUserAnswers,
  getSelectedProducts,
  getUserProfile,
} from '../utils/storage';
import { formatImpactStats } from '../utils/recommendations';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    (async () => {
      const p = await getUserProfile();
      setProfile(p);
    })();
  }, []);

  const loadData = async () => {
    const impactStats = await getImpactStats();
    const refillHistory = await getRefillHistory();
    const answers = await getUserAnswers();
    const products = await getSelectedProducts();

    setStats(impactStats);
    setHistory(refillHistory);
    setUserProfile({ answers, products });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formattedStats = stats ? formatImpactStats(stats) : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2e7d32']} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mon Tableau de Bord</Text>
        <Text style={styles.subtitle}>
          Suivez votre impact environnemental 🌍
        </Text>
      </View>

      {/* Lien profil */}
      <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.profileBtnText}>Gérer mon profil et mes récompenses</Text>
        <Text style={styles.profileBtnIcon}>→</Text>
      </TouchableOpacity>

      {/* Statistiques principales */}
      {formattedStats && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Votre Impact Total</Text>
          
          <View style={styles.statsGrid}>
            {Object.values(formattedStats).map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>
                    {stat.value} {stat.unit}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  {stat.equivalence && (
                    <Text style={styles.statEquivalence}>{stat.equivalence}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Progression */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Objectifs 2025</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Réduction plastique</Text>
            <Text style={styles.progressPercent}>
              {stats ? Math.min(100, Math.round((stats.plasticSaved / 20000) * 100)) : 0}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    stats ? Math.min(100, (stats.plasticSaved / 20000) * 100) : 0
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressSubtext}>
            Objectif: 20kg par utilisateur
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Réduction CO₂</Text>
            <Text style={styles.progressPercent}>
              {stats ? Math.min(100, Math.round((stats.co2Saved / 10) * 100)) : 0}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${stats ? Math.min(100, (stats.co2Saved / 10) * 100) : 0}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressSubtext}>
            Objectif: 10kg CO₂ évité
          </Text>
        </View>
      </View>

      {/* Produits préférés */}
      {userProfile?.products && userProfile.products.length > 0 && (
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Vos Produits</Text>
          {userProfile.products.map((product, index) => (
            <View key={index} style={styles.productCard}>
              <Text style={styles.productEmoji}>{product.image}</Text>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productBenefits}>
                  {product.benefits.slice(0, 2).join(' • ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Historique des recharges */}
      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Historique des Recharges</Text>
          {history.slice(0, 5).map((refill, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Text style={styles.historyIconText}>🔄</Text>
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyDate}>
                  {new Date(refill.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={styles.historyProducts}>
                  {refill.products.map(p => p.name).join(', ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Actions rapides */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Questionnaire')}
        >
          <Text style={styles.actionButtonIcon}>🔄</Text>
          <Text style={styles.actionButtonText}>Refaire le questionnaire</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('QRCode', {
            answers: userProfile?.answers || {},
            selectedProducts: userProfile?.products || [],
          })}
        >
          <Text style={styles.actionButtonIcon}>📱</Text>
          <Text style={styles.actionButtonText}>Voir mon QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* Badges et récompenses */}
      <View style={styles.badgesSection}>
        <Text style={styles.sectionTitle}>Vos Récompenses</Text>
        <Text style={{ color: '#2e7d32', fontWeight: '700', marginBottom: 8 }}>
          Points: {profile?.rewards?.points || 0}
        </Text>
        <View style={styles.badgesGrid}>
          {(profile?.rewards?.badges || []).length === 0 ? (
            <Text style={{ color: '#666' }}>Aucun badge débloqué pour le moment</Text>
          ) : (
            profile.rewards.badges.map((b) => (
              <View key={b.id} style={styles.badge}>
                <Text style={styles.badgeEmoji}>{b.icon || '⭐'}</Text>
                <Text style={styles.badgeLabel}>{b.name}</Text>
              </View>
            ))
          )}
        </View>
        {(profile?.rewards?.discounts || []).filter(d => !d.used).length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Réductions disponibles</Text>
            {profile.rewards.discounts.filter(d => !d.used).map((d, i) => (
              <View key={`${d.id}-${i}`} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 6, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: '600', flex: 1 }}>{d.label || '-5% sur produit'}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Utiliser</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Message d'encouragement */}
      <View style={styles.encouragement}>
        <Text style={styles.encouragementTitle}>
          {stats && stats.totalRefills > 0
            ? '🎉 Bravo pour votre engagement !'
            : '🌿 Commencez votre aventure éco-responsable'}
        </Text>
        <Text style={styles.encouragementText}>
          {stats && stats.totalRefills > 0
            ? `Vous avez évité l'équivalent de ${stats.bottlesSaved} bouteilles plastiques. Continuez comme ça !`
            : 'Complétez le questionnaire pour découvrir les produits adaptés à vos besoins.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'auto',
    }),
  },
  content: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra padding at bottom
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
    }),
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  profileBtn: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileBtnText: { color: '#fff', fontWeight: '700', fontSize: 16, marginRight: 8 },
  profileBtnIcon: { color: '#fff', fontSize: 20 },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  statIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  statContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statEquivalence: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2e7d32',
    borderRadius: 5,
  },
  progressSubtext: {
    fontSize: 12,
    color: '#999',
  },
  productsSection: {
    marginBottom: 30,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  productEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  productBenefits: {
    fontSize: 14,
    color: '#666',
  },
  historySection: {
    marginBottom: 30,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyIconText: {
    fontSize: 20,
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  historyProducts: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    marginBottom: 30,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e8f5e9',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  badgesSection: {
    marginBottom: 30,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  encouragement: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
