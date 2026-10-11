import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCuidador } from '../estado/CuidadorContext';
import StatsBar from '../components/StatsBar';
import PetCard from '../components/PetCard';
import BottomNav from '../components/BottomNav';

export default function HomeScreen({
  userName,
  activeTab,
  onSelectTab,
  onOpenProfile,
  onOpenPet,
  onAddPet,
}) {
  const { mascotas, proximaCitaDe } = useCuidador();

  const emojiPorCategoria = { perro: '🐶', gato: '🐱' };

  const petList = mascotas.map((m) => {
    const cita = proximaCitaDe(m.id);
    return {
      id: m.id,
      name: m.nombre,
      breed: m.raza,
      age: m.edadAnios === 1 ? '1 año' : `${m.edadAnios} años`,
      weight: `${m.pesoKg} kg`,
      next: cita ? `${cita.fecha} ${cita.titulo}` : 'Sin citas próximas',
      shade: m.colorFicha,
      emoji: emojiPorCategoria[m.categoria] || '🐾',
    };
  });

  const dogs = petList.filter((p) => p.emoji === '🐶' || p.emoji === '🐕').length;
  const cats = petList.filter((p) => p.emoji === '🐱').length;

  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <StatusBar style="dark" />

      <View className="flex-row justify-between items-center px-[18px] pt-3 pb-1.5">
        <View>
          <Text className="text-[20px] font-extrabold text-tinta">Hola, {userName || 'María'} 👋</Text>
          <Text className="text-[13px] text-grisTexto mt-0.5">Así están tus mascotas hoy</Text>
        </View>
        <TouchableOpacity
          className="w-[42px] h-[42px] rounded-full bg-white items-center justify-center"
          style={styles.avatarSombra}
          onPress={onOpenProfile}
        >
          <Text className="text-[20px]">👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StatsBar total={petList.length} dogs={dogs} cats={cats} />

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[16px] font-extrabold text-tinta">Mis mascotas</Text>
          <TouchableOpacity className="bg-menta py-2 px-3.5 rounded-xl" onPress={onAddPet}>
            <Text className="text-white font-bold text-[12px]">+ Agregar</Text>
          </TouchableOpacity>
        </View>

        <View className="pb-2">
          {petList.map((pet) => (
            <PetCard key={pet.id} pet={pet} onPress={onOpenPet} />
          ))}
        </View>
      </ScrollView>

      <BottomNav activeTab={activeTab} onSelectTab={onSelectTab} />
    </SafeAreaView>
  );
}

// StyleSheet reservado únicamente para sombras puntuales multiplataforma
const styles = StyleSheet.create({
  avatarSombra: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
});

