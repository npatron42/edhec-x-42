import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { getUserProfile, updateUserProfile, signOutUser, clearAllData, redeemDiscount } from '../utils/storage';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await getUserProfile();
      setProfile(p);
      setName(p?.name || '');
      setEmail(p?.email || '');
    })();
  }, []);

  const save = async () => {
    if (!name.trim() || !email.trim()) return;
    setSaving(true);
    const next = await updateUserProfile({ name: name.trim(), email: email.trim().toLowerCase() });
    setProfile(next);
    setSaving(false);
  };

  const signOut = async () => {
    await signOutUser();
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  const clearAll = async () => {
    Alert.alert('Réinitialiser', 'Supprimer toutes vos données locales ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        await clearAllData();
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      }},
    ]);
  };

  const handleRedeem = async (id) => {
    const ok = await redeemDiscount(id);
    if (ok) {
      const p = await getUserProfile();
      setProfile(p);
    }
  };

  const discounts = (profile?.rewards?.discounts || []).filter(d => !d.used);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mon Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Votre nom" style={styles.input} placeholderTextColor="#888" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="vous@exemple.com" autoCapitalize="none" keyboardType="email-address" style={styles.input} placeholderTextColor="#888" />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Récompenses</Text>
        <Text style={{ color: '#2e7d32', fontWeight: '700', marginBottom: 8 }}>Points: {profile?.rewards?.points || 0}</Text>
        <View style={styles.badges}>
          {(profile?.rewards?.badges || []).length === 0 ? (
            <Text style={{ color: '#666' }}>Aucun badge débloqué</Text>
          ) : (
            profile.rewards.badges.map((b) => (
              <View key={b.id} style={styles.badge}>
                <Text style={styles.badgeEmoji}>{b.icon || '⭐'}</Text>
                <Text style={styles.badgeLabel}>{b.name}</Text>
              </View>
            ))
          )}
        </View>
        {discounts.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Réductions disponibles</Text>
            {discounts.map((d) => (
              <View key={d.id} style={styles.discount}>
                <Text style={{ fontWeight: '600', flex: 1 }}>{d.label}</Text>
                <TouchableOpacity style={styles.redeemBtn} onPress={() => handleRedeem(d.id)}>
                  <Text style={styles.redeemText}>Utiliser</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Session</Text>
        <TouchableOpacity style={styles.sessionBtn} onPress={signOut}>
          <Text style={styles.sessionText}>Se déconnecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sessionBtn, { backgroundColor: '#f44336', borderColor: '#f44336' }]} onPress={clearAll}>
          <Text style={[styles.sessionText, { color: '#fff' }]}>Supprimer mes données</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', ...(Platform.OS === 'web' && { height: '100vh', overflow: 'auto' }) },
  content: { flexGrow: 1, padding: 20, paddingTop: 60, paddingBottom: 100, ...(Platform.OS === 'web' && { minHeight: '100vh' }) },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  backButton: { padding: 10 },
  backText: { fontSize: 28, color: '#2e7d32' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  card: { backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12, marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 },
  formGroup: { marginBottom: 12 },
  label: { fontSize: 13, color: '#2e7d32', fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, backgroundColor: '#fff', color: '#1a1a1a' },
  saveBtn: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  saveText: { color: '#fff', fontWeight: '700' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: { backgroundColor: '#fff', padding: 12, borderRadius: 10, alignItems: 'center', minWidth: 90 },
  badgeEmoji: { fontSize: 28, marginBottom: 6 },
  badgeLabel: { fontSize: 12, color: '#666', fontWeight: '600', textAlign: 'center' },
  discount: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 6, flexDirection: 'row', alignItems: 'center' },
  redeemBtn: { backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  redeemText: { color: '#fff', fontWeight: '700' },
  sessionBtn: { borderWidth: 2, borderColor: '#2e7d32', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8, backgroundColor: '#fff' },
  sessionText: { color: '#2e7d32', fontWeight: '700' },
});
