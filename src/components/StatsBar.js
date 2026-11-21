import React from 'react';
<<<<<<< HEAD
import { Text, View } from 'react-native';

export default function StatsBar({ total, dogs, cats }) {
  return (
    <View className="flex-row bg-[#6ec4b3] rounded-[18px] mx-[18px] py-4 px-3.5 justify-between mb-5">
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#eafaf4] text-[11px] mb-0.5 text-center">Total mascotas</Text>
        <Text className="text-white text-[21px] font-extrabold">{total}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#eafaf4] text-[11px] mb-0.5 text-center">Perros</Text>
        <Text className="text-white text-[21px] font-extrabold">{dogs}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#eafaf4] text-[11px] mb-0.5 text-center">Gatos</Text>
        <Text className="text-white text-[21px] font-extrabold">{cats}</Text>
=======
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
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
      </View>
    </View>
  );
}

<<<<<<< HEAD
=======
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
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
