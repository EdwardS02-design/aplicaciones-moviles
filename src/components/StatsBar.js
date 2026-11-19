import React from 'react';
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
      </View>
    </View>
  );
}

