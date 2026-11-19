import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen({ userName, userEmail, onBack, onLogout }) {
  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <StatusBar style="dark" />
      <View className="px-[18px] pt-3">
        <TouchableOpacity onPress={onBack} className="self-start py-2 px-1">
          <Text className="text-[15px] font-bold text-mentaOscura">‹ Volver</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-5 justify-center items-center">
        <View
          className="bg-white rounded-[18px] p-6 items-center w-full mb-5"
          style={styles.cardSombra}
        >
          <View className="w-[90px] h-[90px] rounded-full mb-3 bg-[#dff5ee] items-center justify-center">
            <Text className="text-[38px]">👤</Text>
          </View>
          <Text className="text-[20px] font-extrabold text-tinta">{userName || 'María'}</Text>
          <Text className="text-[14px] text-mentaOscura mb-4">{userEmail || 'hola@maria.com'}</Text>

          <View className="flex-row justify-between w-full pt-3 border-t border-[#eee]">
            <Text className="font-semibold text-[#555]">App</Text>
            <Text className="text-[#777]">PetCare</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-white border border-[#f0d0d0] py-3.5 px-10 rounded-2xl"
          onPress={onLogout}
        >
          <Text className="text-[#c0453f] font-bold text-[15px]">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// StyleSheet reservado únicamente para sombras puntuales multiplataforma
const styles = StyleSheet.create({
  cardSombra: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
});

