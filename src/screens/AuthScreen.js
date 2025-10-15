import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { saveUserProfile, getUserProfile } from '../utils/storage';

export default function AuthScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si un profil existe déjà, passer directement au questionnaire
    (async () => {
      const profile = await getUserProfile();
      if (profile) {
        navigation.replace('Questionnaire');
      } else {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !email.trim()) return;
    const profile = {
      id: 'USR-' + Date.now().toString(36),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      rewards: {
        points: 0,
        badges: [],
        discounts: [],
      },
    };
    await saveUserProfile(profile);
    navigation.replace('Questionnaire');
  };

  if (loading) {
    return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><Text>Chargement…</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.logo}>🌿</Text>
      <Text style={styles.title}>Créer mon compte</Text>
      <Text style={styles.subtitle}>Sauvegardez vos préférences et gagnez des récompenses</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Votre nom"
          style={styles.input}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="vous@exemple.com"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor="#888"
        />
      </View>

      <TouchableOpacity style={styles.cta} onPress={handleCreate}>
        <Text style={styles.ctaText}>Continuer</Text>
        <Text style={styles.ctaIcon}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, padding: 24, paddingTop: 80 },
  logo: { fontSize: 56, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, textAlign: 'center', fontWeight: '700', color: '#1a1a1a' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginTop: 6, marginBottom: 24 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#2e7d32', fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 16,
    backgroundColor: '#fafafa', color: '#1a1a1a',
  },
  cta: {
    backgroundColor: '#2e7d32', paddingVertical: 16, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16, marginRight: 8 },
  ctaIcon: { color: '#fff', fontSize: 20 },
});
