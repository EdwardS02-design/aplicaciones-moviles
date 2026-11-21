import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
<<<<<<< HEAD

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
=======
import { colors } from '../theme/colors';

export default function ProfileScreen({
  userName,
  userEmail,
  storageError,
  onBack,
  onLogout,
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.name}>{userName || 'María'}</Text>
          <Text style={styles.role}>{userEmail || 'hola@maria.com'}</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>App</Text>
            <Text style={styles.infoValue}>PetCare</Text>
          </View>
        </View>

        <Text style={styles.demoNotice}>
          Perfil de demostración. La sesión se guarda localmente y no reemplaza una autenticación real.
        </Text>
        {storageError ? (
          <Text style={styles.errorMessage} accessibilityRole="alert">
            {storageError}
          </Text>
        ) : null}

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

<<<<<<< HEAD
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

=======
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDashboard },
  header: { paddingHorizontal: 18, paddingTop: 12 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4 },
  backText: { fontSize: 15, fontWeight: '700', color: colors.brand },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  profileCard: {
    backgroundColor: colors.white, borderRadius: 18, padding: 24, alignItems: 'center',
    width: '100%', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 4,
  },
  avatar: {
    width: 90, height: 90, borderRadius: 45, marginBottom: 12, backgroundColor: '#dff5ee',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 38 },
  name: { fontSize: 20, fontWeight: '800', color: colors.textDark },
  role: { fontSize: 14, color: colors.brand, marginBottom: 16 },
  infoContainer: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee',
  },
  infoLabel: { fontWeight: '600', color: '#555' },
  infoValue: { color: '#777' },
  demoNotice: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#b23b35',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: '#f0d0d0',
    paddingVertical: 14, paddingHorizontal: 40, borderRadius: 16,
  },
  logoutText: { color: '#c0453f', fontWeight: '700', fontSize: 15 },
});
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
