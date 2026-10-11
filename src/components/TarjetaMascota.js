import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoriasMascota } from '../constantes/catalogo';

function textoEdad(anios) {
  if (anios === 1) return '1 año';
  return `${anios} años`;
}

export default function TarjetaMascota({ mascota, proxima, onPress, unidadPeso }) {
  const categoria = categoriasMascota.find((c) => c.id === mascota.categoria);
  const peso =
    unidadPeso === 'lb'
      ? `${(mascota.pesoKg * 2.205).toFixed(1)} lb`
      : `${mascota.pesoKg} kg`;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-row bg-white rounded-[22px] p-3 mb-3 items-center"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      <View className="w-[78px] h-[78px] rounded-[18px] overflow-hidden mr-3" style={{ backgroundColor: mascota.colorFicha }}>
        {mascota.fotoUrl ? (
          <Image source={{ uri: mascota.fotoUrl }} className="w-full h-full" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-3xl">{categoria?.emoji || '🐾'}</Text>
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text className="text-[17px] font-extrabold text-tinta">{mascota.nombre}</Text>
        <Text className="text-[13px] text-[#58635f]">{mascota.raza}</Text>
        <View className="flex-row mt-1 mb-1">
          <View className="bg-[#f3f6f3] px-2 py-[2px] rounded-md mr-2">
            <Text className="text-[11px] text-[#5c6663]">{textoEdad(mascota.edadAnios)}</Text>
          </View>
          <View className="bg-[#f3f6f3] px-2 py-[2px] rounded-md">
            <Text className="text-[11px] text-[#5c6663]">{peso}</Text>
          </View>
        </View>
        {proxima ? (
          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: mascota.categoria === 'gato' ? '#7b6ad6' : '#e08a3a' }}
            />
            <Ionicons name="calendar-outline" size={12} color="#d9853b" />
            <Text className="text-[11px] text-naranjaCita ml-1 font-semibold">
              {formatearCita(proxima)}
            </Text>
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9aa8a4" />
    </TouchableOpacity>
  );
}

function formatearCita(cita) {
  const [anio, mes, dia] = cita.fecha.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${Number(dia)} ${meses[Number(mes) - 1]}. · ${cita.titulo}`;
}
