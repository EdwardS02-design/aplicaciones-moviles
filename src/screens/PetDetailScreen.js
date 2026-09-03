import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

export default function PetDetailScreen({ pet, onBack }) {
  if (!pet) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.avatar, { backgroundColor: pet.shade }]}>
          <Text style={styles.avatarEmoji}>{pet.emoji}</Text>
        </View>

        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Edad</Text>
            <Text style={styles.infoValue}>{pet.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{pet.weight}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Próxima cita</Text>
            <Text style={styles.infoValue}>{pet.next}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Editar mascota</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDashboard },
  header: { paddingHorizontal: 18, paddingTop: 12 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4 },
  backText: { fontSize: 15, fontWeight: '700', color: colors.brand },
  content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 40 },
  avatar: {
    width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  avatarEmoji: { fontSize: 52 },
  name: { fontSize: 24, fontWeight: '800', color: colors.textDark },
  breed: { fontSize: 15, color: colors.textMuted, marginBottom: 24 },
  infoCard: {
    width: '100%', backgroundColor: colors.white, borderRadius: 18, padding: 18, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#f0f2f0',
  },
  infoLabel: { color: colors.textMuted, fontSize: 14 },
  infoValue: { color: colors.textDark, fontSize: 14, fontWeight: '700' },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
