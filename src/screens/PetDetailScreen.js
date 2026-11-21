import React from 'react';
<<<<<<< HEAD
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCuidador } from '../estado/CuidadorContext';
import { categoriasMascota } from '../constantes/catalogo';

export default function PetDetailScreen({ route, navigation }) {
  const { mascotaId } = route.params;
  const { mascotas, citas, actividades, preferencias } = useCuidador();
  const mascota = mascotas.find((m) => m.id === mascotaId);
  if (!mascota) return null;

  const categoria = categoriasMascota.find((c) => c.id === mascota.categoria);
  const peso =
    preferencias.unidadPeso === 'lb'
      ? `${(mascota.pesoKg * 2.205).toFixed(1)} lb`
      : `${mascota.pesoKg} kg`;
  const susCitas = citas.filter((c) => c.mascotaId === mascota.id);
  const susActividades = actividades.filter((a) => a.mascotaId === mascota.id).slice(0, 4);

  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <StatusBar style="dark" />
      <TouchableOpacity onPress={() => navigation.goBack()} className="px-5 py-2">
        <Text className="text-mentaOscura font-bold">‹ Volver</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 24, paddingBottom: 40 }}>
        <View
          className="w-28 h-28 rounded-full overflow-hidden items-center justify-center mb-3"
          style={{ backgroundColor: mascota.colorFicha }}
        >
          {mascota.fotoUrl ? (
            <Image source={{ uri: mascota.fotoUrl }} className="w-full h-full" />
          ) : (
            <Text className="text-5xl">{categoria?.emoji}</Text>
          )}
        </View>
        <Text className="text-2xl font-extrabold text-tinta">{mascota.nombre}</Text>
        <Text className="text-grisTexto mb-5">{mascota.raza}</Text>

        <View className="w-full bg-white rounded-[22px] p-4 mb-4">
          <Fila etiqueta="Categoría" valor={categoria?.etiqueta} />
          <Fila etiqueta="Edad" valor={`${mascota.edadAnios} años`} />
          <Fila etiqueta="Peso" valor={peso} ultimo />
        </View>

        <View className="w-full bg-white rounded-[22px] p-4 mb-4">
          <Text className="font-bold text-tinta mb-2">Citas</Text>
          {susCitas.length === 0 ? (
            <Text className="text-grisTexto text-[13px]">Todavía no tiene citas.</Text>
          ) : (
            susCitas.map((c) => (
              <Text key={c.id} className="text-[13px] text-grisTexto mb-1">
                {c.fecha} · {c.titulo}
              </Text>
            ))
          )}
        </View>

        <View className="w-full bg-white rounded-[22px] p-4">
          <Text className="font-bold text-tinta mb-2">Últimas actividades</Text>
          {susActividades.map((a) => (
            <Text key={a.id} className="text-[13px] text-grisTexto mb-1">
              {a.hora} · {a.titulo}
            </Text>
          ))}
        </View>
=======
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

export default function PetDetailScreen({ pet, onBack, onEdit }) {
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
        {pet.photoUri ? (
          <Image
            source={{ uri: pet.photoUri }}
            style={styles.avatar}
            accessibilityLabel={`Foto de ${pet.name}`}
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: pet.shade }]}>
            <Text style={styles.avatarEmoji}>{pet.emoji}</Text>
          </View>
        )}

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

        {pet.location ? (
          <View style={styles.locationCard}>
            <Text style={styles.locationTitle}>Ubicación guardada</Text>
            <Text style={styles.locationText}>
              {pet.location.latitude.toFixed(5)}, {pet.location.longitude.toFixed(5)}
            </Text>
            <TouchableOpacity
              accessibilityRole="link"
              onPress={() =>
                Linking.openURL(
                  `https://maps.google.com/?q=${pet.location.latitude},${pet.location.longitude}`,
                ).catch((error) =>
                  console.error('No se pudo abrir el mapa de la mascota.', error),
                )
              }
              style={styles.mapButton}
            >
              <Text style={styles.mapButtonText}>Abrir en el mapa</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity accessibilityRole="button" onPress={onEdit} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Editar mascota</Text>
        </TouchableOpacity>
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
      </ScrollView>
    </SafeAreaView>
  );
}

<<<<<<< HEAD
function Fila({ etiqueta, valor, ultimo }) {
  return (
    <View className={`flex-row justify-between py-2 ${ultimo ? '' : 'border-b border-[#f0f2f0]'}`}>
      <Text className="text-grisTexto">{etiqueta}</Text>
      <Text className="font-bold text-tinta">{valor}</Text>
    </View>
  );
}
=======
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
  locationCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
  },
  locationTitle: { color: colors.textDark, fontSize: 14, fontWeight: '700' },
  locationText: { color: colors.textMuted, fontSize: 12, marginTop: 5 },
  mapButton: { alignSelf: 'flex-start', marginTop: 10, paddingVertical: 5 },
  mapButtonText: { color: colors.brand, fontSize: 13, fontWeight: '700' },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
