import React from 'react';
<<<<<<< HEAD
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PetCard({ pet, onPress }) {
  return (
    <TouchableOpacity
      className="flex-row bg-white rounded-[18px] p-3 items-center mb-3"
      style={styles.sombra}
      activeOpacity={0.7}
      onPress={() => onPress?.(pet)}
    >
      <View
        className="w-[82px] h-[82px] rounded-[18px] items-center justify-center mr-3"
        style={{ backgroundColor: pet.shade }}
      >
        <Text className="text-[30px]">{pet.emoji}</Text>
      </View>

      <View className="flex-1 justify-center">
        <Text className="text-[18px] font-extrabold text-tinta mb-0.5">{pet.name}</Text>
        <Text className="text-[14px] text-[#58635f] mb-0.5">{pet.breed}</Text>
        <Text className="text-[12px] text-[#6a726f] mb-1">{pet.age}   {pet.weight}</Text>
        <View className="flex-row items-center">
          <Text className="text-[12px] mr-1.5">🗓️</Text>
          <Text className="text-[#3b8f7d] text-[11px] font-semibold">{pet.next}</Text>
        </View>
      </View>

      <Text className="text-[32px] text-mentaOscura ml-2 font-light">›</Text>
    </TouchableOpacity>
  );
}

// StyleSheet reservado únicamente para sombras puntuales multiplataforma
const styles = StyleSheet.create({
  sombra: {
=======
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

export default function PetCard({ pet, onPress }) {
  return (
      <TouchableOpacity
          style={styles.petCard}
          activeOpacity={0.7}
          onPress={() => onPress?.(pet)}
      >
        {pet.photoUri ? (
          <Image
            source={{ uri: pet.photoUri }}
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
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
<<<<<<< HEAD
});

=======
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
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
