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
  onSelectTab,
  onOpenProfile,
  onOpenPet,
  onAddPet,
  onManagePets,
}) {
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
        </TouchableOpacity>
      </View>

      <ScrollView
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
          <View>
            <Text style={styles.listTitle}>Mis mascotas</Text>
            <TouchableOpacity accessibilityRole="button" onPress={onManagePets}>
              <Text style={styles.manageText}>Administrar y ver citas ›</Text>
            </TouchableOpacity>
          </View>
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
      </ScrollView>

      <BottomNav activeTab={activeTab} onSelectTab={onSelectTab} />
    </SafeAreaView>
  );
}

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
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
  manageText: { color: colors.brand, fontSize: 12, fontWeight: '700', marginTop: 4 },
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
