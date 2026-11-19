import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCuidador } from '../estado/CuidadorContext';
import ResumenMascotas from '../components/ResumenMascotas';
import TarjetaMascota from '../components/TarjetaMascota';
import ModalNuevaMascota from '../components/ModalNuevaMascota';

export default function MascotasScreen({ navigation }) {
  const { perfil, mascotas, agregarMascota, proximaCitaDe, preferencias } = useCuidador();
  const [modalAbierto, setModalAbierto] = useState(false);
  const primerNombre = (perfil.nombre || 'María').split(' ')[0];

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between items-center px-5 pt-2 pb-1">
        <View>
          <Text className="text-[13px] text-grisTexto">¡Hola, {primerNombre}! 👋</Text>
          <Text className="text-[26px] font-extrabold text-tinta">Mis Mascotas</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Config')}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="person-outline" size={18} color="#2b7a6d" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <ResumenMascotas mascotas={mascotas} />

        {mascotas.map((mascota) => (
          <TarjetaMascota
            key={mascota.id}
            mascota={mascota}
            proxima={proximaCitaDe(mascota.id)}
            unidadPeso={preferencias.unidadPeso}
            onPress={() => navigation.navigate('DetalleMascota', { mascotaId: mascota.id })}
          />
        ))}

        <TouchableOpacity
          onPress={() => setModalAbierto(true)}
          className="border border-dashed border-[#b7ddd4] rounded-[22px] py-4 items-center mt-1 bg-[#f7fbf9]"
        >
          <Text className="text-mentaOscura font-bold">＋  Agregar mascota</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalNuevaMascota
        visible={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onGuardar={agregarMascota}
      />
    </SafeAreaView>
  );
}
