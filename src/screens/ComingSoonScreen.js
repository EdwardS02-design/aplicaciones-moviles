import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import BottomNav from '../components/BottomNav';

// Pantalla temporal para las pestañas que aún no tienen su propia vista
// (Agenda, Actividades, Lugares). Antes al tocarlas no pasaba nada;
// ahora al menos cambian de pestaña y muestran este aviso.
export default function ComingSoonScreen({ label, icon, activeTab, onSelectTab }) {
  return (
    <SafeAreaView className="flex-1 bg-fondo justify-center items-center">
      <StatusBar style="dark" />
      <View className="w-[390px] max-w-[92%] h-[92%] bg-[#f3f5f3] rounded-[36px] overflow-hidden border border-[#dfe6de]">
        <View className="flex-1 items-center justify-center px-[30px]">
          <Text className="text-[48px] mb-4">{icon}</Text>
          <Text className="text-[22px] font-extrabold text-tinta mb-2">{label}</Text>
          <Text className="text-[14px] text-grisTexto text-center">Esta sección todavía no está lista. ¡Pronto!</Text>
        </View>
        <BottomNav activeTab={activeTab} onSelectTab={onSelectTab} />
      </View>
    </SafeAreaView>
  );
}

