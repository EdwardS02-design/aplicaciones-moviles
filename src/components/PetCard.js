import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

export default function PetCard({ pet, onPress }) {
  return (
    <TouchableOpacity
      style={styles.petCard}
      activeOpacity={0.7}
      onPress={() => onPress?.(pet)}
    >
      {pet.photoUri || pet.fotoUrl ? (
        <Image
          source={{ uri: pet.photoUri || pet.fotoUrl }}
          style={styles.petImage}
          accessibilityLabel={`Foto de ${pet.name}`}
        />
      ) : (
        <View style={[styles.petImage, { backgroundColor: pet.shade }]}>
          <Text style={styles.petEmoji}>{pet.emoji}</Text>
        </View>
      )}

      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petBreed}>{pet.breed}</Text>
        <Text style={styles.petMeta}>{pet.age}   {pet.weight}</Text>
        <View style={styles.nextRow}>
          <Text style={styles.calendarIcon}>🗓️</Text>
          <Text style={styles.nextText}>{pet.next}</Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  petCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  petImage: {
    width: 82,
    height: 82,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  petEmoji: { fontSize: 30 },
  petInfo: { flex: 1, justifyContent: 'center' },
  petName: { fontSize: 18, fontWeight: '800', color: colors.textDark, marginBottom: 2 },
  petBreed: { fontSize: 14, color: '#58635f', marginBottom: 2 },
  petMeta: { fontSize: 12, color: '#6a726f', marginBottom: 5 },
  nextRow: { flexDirection: 'row', alignItems: 'center' },
  calendarIcon: { fontSize: 12, marginRight: 6 },
  nextText: { color: '#3b8f7d', fontSize: 11, fontWeight: '600' },
  chevron: { fontSize: 32, color: colors.primaryDark, marginLeft: 8, fontWeight: '300' },
});
