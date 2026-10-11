import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCuidador } from '../estado/CuidadorContext';
import { tiposActividad } from '../constantes/catalogo';
import ModalNuevaActividad from '../components/ModalNuevaActividad';

const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export default function ActividadesScreen({ onBack }) {
  const { actividades, mascotas, agregarActividad } = useCuidador();
  const [filtro, setFiltro] = useState('todas');
  const [modalAbierto, setModalAbierto] = useState(false);

  const filtradas = useMemo(
    () => (filtro === 'todas' ? actividades : actividades.filter((a) => a.mascotaId === filtro)),
    [actividades, filtro]
  );

  const porDia = useMemo(() => {
    const grupos = {};
    filtradas.forEach((a) => {
      if (!grupos[a.fecha]) grupos[a.fecha] = [];
      grupos[a.fecha].push(a);
    });
    return Object.entries(grupos).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtradas]);

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between items-center px-5 pt-2 pb-2">
        <View>
          {onBack ? (
            <TouchableOpacity onPress={onBack} className="py-2 self-start">
              <Text className="text-mentaOscura font-semibold">‹ Volver</Text>
            </TouchableOpacity>
          ) : null}
          <Text className="text-[13px] text-grisTexto">Registro de</Text>
          <Text className="text-[26px] font-extrabold text-tinta">Actividades</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalAbierto(true)}
          className="w-11 h-11 rounded-full bg-menta items-center justify-center"
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-3" contentContainerStyle={{ paddingRight: 24 }}>
        <Chip activo={filtro === 'todas'} onPress={() => setFiltro('todas')} texto="Todos" />
        {mascotas.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setFiltro(m.id)}
            className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 border ${
              filtro === m.id ? 'bg-menta border-menta' : 'bg-white border-[#e4eee9]'
            }`}
          >
            {m.fotoUrl ? <Image source={{ uri: m.fotoUrl }} className="w-5 h-5 rounded-full mr-2" /> : null}
            <Text className={filtro === m.id ? 'text-white font-semibold' : 'text-tinta'}>{m.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 28 }}>
        {porDia.map(([fecha, lista]) => {
          const dia = Number(fecha.slice(8, 10));
          const mes = meses[Number(fecha.slice(5, 7)) - 1];
          return (
            <View key={fecha} className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-[12px] font-bold text-grisTexto tracking-wide">
                  {dia} {mes}
                </Text>
                <Text className="text-[12px] text-grisTexto">{lista.length}</Text>
              </View>
              {lista
                .slice()
                .sort((a, b) => b.hora.localeCompare(a.hora))
                .map((act) => {
                  const tipo = tiposActividad.find((t) => t.id === act.tipo);
                  const mascota = mascotas.find((m) => m.id === act.mascotaId);
                  return (
                    <View key={act.id} className="flex-row items-center bg-white rounded-[20px] p-3 mb-2">
                      <View

                        className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                        style={{ backgroundColor: tipo?.color || '#eef3ef' }}
                      >
                        <Text>{tipo?.icono || '✨'}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-tinta">{act.titulo}</Text>
                        <Text className="text-[12px] text-grisTexto">
                          {mascota?.nombre}
                          {act.duracionMin ? `  ·  ${act.duracionMin} min` : ''}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-[12px] text-grisTexto">{act.hora}</Text>
                        <Text className="text-[11px] text-naranjaCita mt-1">{tipo?.etiqueta}</Text>
                      </View>
                    </View>
                  );
                })}
            </View>
          );
        })}
      </ScrollView>

      <ModalNuevaActividad
        visible={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onGuardar={agregarActividad}
        mascotas={mascotas}
      />
    </SafeAreaView>
  );
}

function Chip({ activo, onPress, texto }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-1.5 rounded-full mr-2 ${activo ? 'bg-menta' : 'bg-white border border-[#e4eee9]'}`}
    >
      <Text className={activo ? 'text-white font-semibold' : 'text-tinta'}>{texto}</Text>
    </TouchableOpacity>
  );
}
