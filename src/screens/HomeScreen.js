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
<<<<<<< HEAD
import { useCuidador } from '../estado/CuidadorContext';
import StatsBar from '../components/StatsBar';
import PetCard from '../components/PetCard';
import BottomNav from '../components/BottomNav';

export default function HomeScreen({
  userName,
  activeTab,
=======
import { colors } from '../theme/colors';
import StatsBar from '../components/StatsBar';
import PetCard from '../components/PetCard';
import BottomNav from '../components/BottomNav';
import DogDiscoverySection from '../components/DogDiscoverySection';

export default function HomeScreen({
  userName,
  pets,
  activeTab,
  storageError,
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
  onSelectTab,
  onOpenProfile,
  onOpenPet,
  onAddPet,
}) {
<<<<<<< HEAD
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
=======
  const dogs = pets.filter((pet) => pet.emoji === '🐶' || pet.emoji === '🐕').length;
  const cats = pets.filter((pet) => pet.emoji === '🐱').length;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {userName || 'María'} 👋</Text>
          <Text style={styles.subtitle}>Así están tus mascotas hoy</Text>
        </View>
        <TouchableOpacity style={styles.avatarButton} onPress={onOpenProfile}>
          <Text style={styles.avatarEmoji}>👤</Text>
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
        </TouchableOpacity>
      </View>

      <ScrollView
<<<<<<< HEAD
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
=======
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {storageError ? (
          <Text style={styles.storageError} accessibilityRole="alert">
            {storageError}
          </Text>
        ) : null}

        <StatsBar total={pets.length} dogs={dogs} cats={cats} />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Mis mascotas</Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.addButton}
            onPress={onAddPet}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {pets.length === 0 ? (
            <Text style={styles.emptyMessage}>
              Aún no tienes mascotas. Usa “Agregar” para registrar la primera.
            </Text>
          ) : pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onPress={onOpenPet} />
          ))}
        </View>

        <DogDiscoverySection />
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
      </ScrollView>

      <BottomNav activeTab={activeTab} onSelectTab={onSelectTab} />
    </SafeAreaView>
  );
}

<<<<<<< HEAD
// StyleSheet reservado únicamente para sombras puntuales multiplataforma
const styles = StyleSheet.create({
  avatarSombra: {
=======
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDashboard },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 6,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: colors.textDark },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
<<<<<<< HEAD
});

=======
  avatarEmoji: { fontSize: 20 },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: 18, paddingBottom: 24 },
  storageError: {
    color: '#b23b35',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  list: { paddingBottom: 8 },
  emptyMessage: {
    backgroundColor: colors.white,
    borderRadius: 16,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
    padding: 18,
    textAlign: 'center',
  },
});
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
