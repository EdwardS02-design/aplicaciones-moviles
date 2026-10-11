import React from 'react';
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
});

