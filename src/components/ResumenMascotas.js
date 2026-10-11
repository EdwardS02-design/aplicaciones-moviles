import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResumenMascotas({ mascotas }) {
  const total = mascotas.length;
  const perros = mascotas.filter((m) => m.categoria === 'perro').length;
  const gatos = mascotas.filter((m) => m.categoria === 'gato').length;

  return (
    <View className="bg-menta rounded-[22px] px-4 py-4 mb-5 flex-row items-center">
      <View className="flex-1">
        <Text className="text-white/90 text-[11px]">Total mascotas</Text>
        <Text className="text-white text-[28px] font-extrabold">{total}</Text>
      </View>
      <View className="w-[1px] h-10 bg-white/30 mx-2" />
      <View className="flex-1 items-center">
        <Text className="text-white/90 text-[11px]">Perros</Text>
        <Text className="text-white text-[22px] font-extrabold">{perros}</Text>
      </View>
      <View className="flex-1 items-center">
        <Text className="text-white/90 text-[11px]">Gatos</Text>
        <Text className="text-white text-[22px] font-extrabold">{gatos}</Text>
      </View>
      <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center ml-2">
        <Ionicons name="paw" size={22} color="#fff" />
      </View>
    </View>
  );
}
