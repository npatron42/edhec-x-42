import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProductCard({ product, onLike, onPass }) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{product.image}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      
      <View style={styles.benefits}>
        {product.benefits.slice(0, 3).map((benefit, index) => (
          <View key={index} style={styles.benefitTag}>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      <View style={styles.impact}>
        <View style={styles.impactItem}>
          <Text style={styles.impactIcon}>♻️</Text>
          <Text style={styles.impactText}>{product.plasticSaved}g</Text>
        </View>
        <View style={styles.impactItem}>
          <Text style={styles.impactIcon}>🌱</Text>
          <Text style={styles.impactText}>{product.co2Saved}kg</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.passButton} onPress={onPass}>
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={onLike}>
          <Text style={styles.buttonText}>❤️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  benefitTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
  },
  benefitText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  impact: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  impactItem: {
    alignItems: 'center',
  },
  impactIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  impactText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 28,
  },
});
