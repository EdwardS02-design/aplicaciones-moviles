import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCuidador } from '../estado/CuidadorContext';
import { tiposCita } from '../constantes/catalogo';
import ModalNuevaCita from '../components/ModalNuevaCita';

const mesesCortos = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function claveMes(fecha = new Date()) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

function moverMes(fecha, cambio) {
  const [anio, mes] = fecha.split('-').map(Number);
  return claveMes(new Date(anio, mes - 1 + cambio, 1));
}

export default function AgendaScreen() {
  const { citas, mascotas, agregarCita } = useCuidador();
  const [mesActivo, setMesActivo] = useState(() => claveMes());
  const [modalAbierto, setModalAbierto] = useState(false);

  const mesesChip = [-1, 0, 1].map((cambio) => {
    const fecha = moverMes(mesActivo, cambio);
    const [anio, mes] = fecha.split('-').map(Number);
    return { fecha, etiqueta: `${mesesCortos[mes - 1]} ${anio}` };
  });

  const citasDelMes = useMemo(
    () =>
      citas
        .filter((c) => c.fecha.startsWith(mesActivo))
        .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)),
    [citas, mesActivo]
  );

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between items-center px-5 pt-2 pb-2">
        <View>
          <Text className="text-[13px] text-grisTexto">Próximas citas</Text>
          <Text className="text-[26px] font-extrabold text-tinta">Agenda</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalAbierto(true)}
          className="w-11 h-11 rounded-full bg-menta items-center justify-center"
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center px-5 mb-4">
        <TouchableOpacity
          onPress={() => setMesActivo((actual) => moverMes(actual, -1))}
          accessibilityLabel="Mes anterior"
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={18} color="#2b7a6d" />
        </TouchableOpacity>
        <View className="flex-1 flex-row justify-center">
          {mesesChip.map((m) => {
            const activo = m.fecha === mesActivo;
            return (
            <TouchableOpacity
              key={m.fecha}
              onPress={() => setMesActivo(m.fecha)}
              className={`px-3 py-2 rounded-full mx-1 ${activo ? 'bg-menta' : 'bg-white'}`}
            >
              <Text className={activo ? 'text-white font-bold' : 'text-grisTexto'}>{m.etiqueta}</Text>
            </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => setMesActivo((actual) => moverMes(actual, 1))}
          accessibilityLabel="Mes siguiente"
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-forward" size={18} color="#2b7a6d" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 28 }}>
        {citasDelMes.length === 0 ? (
          <Text className="text-grisTexto mt-8 text-center">Este mes todavía no hay nada anotado.</Text>
        ) : (
          citasDelMes.map((cita) => {
            const mascota = mascotas.find((m) => m.id === cita.mascotaId);
            const tipo = tiposCita.find((t) => t.id === cita.tipo);
            const dia = Number(cita.fecha.slice(8, 10));
            const mes = mesesCortos[Number(cita.fecha.slice(5, 7)) - 1];
            return (
              <View key={cita.id} className="flex-row mb-3">
                <View className="w-12 items-center mr-2 pt-2">
                  <Text className="text-xl font-extrabold text-tinta">{dia}</Text>
                  <Text className="text-[11px] text-grisTexto">{mes}</Text>
                </View>
                <View className="flex-1 bg-white rounded-[20px] p-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                      <Text className="text-xs mr-1">{tipo?.icono || '📌'}</Text>
                      <Text style={{ color: tipo?.color || '#5ebfae' }} className="font-semibold text-[12px]">
                        {tipo?.etiqueta || cita.tipo}
                      </Text>
                    </View>
                    <Text className="text-grisTexto text-[12px]">{cita.hora}</Text>
                  </View>
                  <Text className="text-[15px] font-bold text-tinta">{cita.titulo}</Text>
                  {cita.lugar ? <Text className="text-[12px] text-grisTexto mt-0.5">{cita.lugar}</Text> : null}
                  <View className="flex-row items-center mt-2">
                    <View
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: mascota?.colorFicha || '#5ebfae' }}
                    />
                    <Text className="text-[12px] text-tinta mr-auto">{mascota?.nombre}</Text>
                    {mascota?.fotoUrl ? (
                      <Image source={{ uri: mascota.fotoUrl }} className="w-8 h-8 rounded-full" />
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <ModalNuevaCita
        visible={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onGuardar={agregarCita}
        mascotas={mascotas}
      />
    </SafeAreaView>
  );
}
