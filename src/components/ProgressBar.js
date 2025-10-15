import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ current, total, color = '#2e7d32' }) {
  const percentage = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.text}>
        {current} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});
