import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function StatsBar({ total, dogs, cats }) {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Total mascotas</Text>
        <Text style={styles.statValue}>{total}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Perros</Text>
        <Text style={styles.statValue}>{dogs}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Gatos</Text>
        <Text style={styles.statValue}>{cats}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.statsBg,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statLabel: { color: '#eafaf4', fontSize: 11, marginBottom: 2, textAlign: 'center' },
  statValue: { color: colors.white, fontSize: 21, fontWeight: '800' },
});
