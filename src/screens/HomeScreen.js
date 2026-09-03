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
import { petList } from '../data/pets';
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
  const dogs = petList.filter((p) => p.emoji === '🐶' || p.emoji === '🐕').length;
  const cats = petList.filter((p) => p.emoji === '🐱').length;

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
        <StatsBar total={petList.length} dogs={dogs} cats={cats} />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Mis mascotas</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddPet}>
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {petList.map((pet) => (
            <PetCard key={pet.id} pet={pet} onPress={onOpenPet} />
          ))}
        </View>
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
});
