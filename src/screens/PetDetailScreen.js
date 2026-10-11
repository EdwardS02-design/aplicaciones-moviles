import React from 'react';
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
      </ScrollView>
    </SafeAreaView>
  );
}

function Fila({ etiqueta, valor, ultimo }) {
  return (
    <View className={`flex-row justify-between py-2 ${ultimo ? '' : 'border-b border-[#f0f2f0]'}`}>
      <Text className="text-grisTexto">{etiqueta}</Text>
      <Text className="font-bold text-tinta">{valor}</Text>
    </View>
  );
}
