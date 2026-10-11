import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCuidador } from '../estado/CuidadorContext';
import Interruptor from '../components/Interruptor';

export default function ConfiguracionScreen({ onBack }) {
  const { perfil, mascotas, preferencias, actualizarPreferencias, actualizarPerfil, salir, hayNube } = useCuidador();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(perfil.nombre);

  async function guardarNombre() {
    await actualizarPerfil({ nombre });
    setEditando(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      <StatusBar style={preferencias.modoOscuro ? 'light' : 'dark'} />
      <View className="px-5 pt-2 pb-3">
        {onBack ? (
          <TouchableOpacity onPress={onBack} className="py-2 self-start">
            <Text className="text-mentaOscura font-semibold">‹ Volver</Text>
          </TouchableOpacity>
        ) : null}
        <Text className="text-[26px] font-extrabold text-tinta">Configuración</Text>
      </View>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="bg-white rounded-[22px] p-4 flex-row items-center mb-5">
          <View className="w-14 h-14 rounded-full bg-mentaSuave items-center justify-center mr-3">
            <Text className="text-2xl">👩</Text>
          </View>
          <View className="flex-1">
            {editando ? (
              <TextInput value={nombre} onChangeText={setNombre} className="border-b border-[#dfeae5] text-tinta font-bold" />
            ) : (
              <Text className="font-extrabold text-[16px] text-tinta">{perfil.nombre}</Text>
            )}
            <Text className="text-[12px] text-grisTexto">{perfil.correo}</Text>
            <Text className="text-[12px] text-grisTexto">
              {mascotas.length} mascotas · {perfil.ciudad}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => (editando ? guardarNombre() : setEditando(true))}
            className="w-9 h-9 rounded-xl bg-[#f3f7f4] items-center justify-center"
          >
            <Ionicons name={editando ? 'checkmark' : 'pencil-outline'} size={16} color="#2b7a6d" />
          </TouchableOpacity>
        </View>

        <TarjetaSeccion titulo="NOTIFICACIONES">
          <Fila
            titulo="Recordatorios"
            detalle="Tareas y cuidados diarios"
            valor={preferencias.recordatorios}
            onCambio={(v) => actualizarPreferencias({ recordatorios: v })}
          />
          <Fila
            titulo="Citas veterinarias"
            detalle="Avisos previos a cada cita"
            valor={preferencias.avisosCitas}
            onCambio={(v) => actualizarPreferencias({ avisosCitas: v })}
          />
          <Fila
            titulo="Vacunas por vencer"
            detalle="Alerta 30 días antes"
            valor={preferencias.alertaVacunas}
            onCambio={(v) => actualizarPreferencias({ alertaVacunas: v })}
          />
          <Fila
            titulo="Resumen de actividad"
            detalle="Reporte semanal"
            valor={preferencias.resumenSemanal}
            onCambio={(v) => actualizarPreferencias({ resumenSemanal: v })}
            ultimo
          />
        </TarjetaSeccion>

        <TarjetaSeccion titulo="PREFERENCIAS">
          <Fila
            titulo="Modo oscuro"
            detalle="Aún en prueba, cambia el contraste"
            valor={preferencias.modoOscuro}
            onCambio={(v) => actualizarPreferencias({ modoOscuro: v })}
          />
          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-[#f0f3f1]"
            onPress={() =>
              Alert.alert('Idioma', 'Por ahora la app está en español (Perú).')
            }
          >
            <View className="flex-1">
              <Text className="text-tinta font-semibold">Idioma</Text>
              <Text className="text-[12px] text-grisTexto">Español (Perú)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9aa8a4" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() =>
              actualizarPreferencias({
                unidadPeso: preferencias.unidadPeso === 'kg' ? 'lb' : 'kg',
              })
            }
          >
            <View className="flex-1">
              <Text className="text-tinta font-semibold">Unidades de peso</Text>
              <Text className="text-[12px] text-grisTexto">
                {preferencias.unidadPeso === 'kg' ? 'Kilogramos (kg)' : 'Libras (lb)'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9aa8a4" />
          </TouchableOpacity>
        </TarjetaSeccion>

        <TarjetaSeccion titulo="ACERCA DE">
          <View className="py-3">
            <Text className="text-tinta font-semibold">Petcare</Text>
            <Text className="text-[12px] text-grisTexto mt-1">
              Versión 1.0 · {hayNube ? 'Datos en la nube (Supabase)' : 'Datos en este teléfono'}
            </Text>
          </View>
        </TarjetaSeccion>

        <TouchableOpacity onPress={salir} className="bg-white border border-[#f0d0d0] py-4 rounded-2xl items-center mt-2">
          <Text className="text-[#c0453f] font-bold">Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function TarjetaSeccion({ titulo, children }) {
  return (
    <View className="mb-5">
      <Text className="text-[11px] tracking-widest text-grisTexto font-bold mb-2 ml-1">{titulo}</Text>
      <View className="bg-white rounded-[22px] px-4">{children}</View>
    </View>
  );
}

function Fila({ titulo, detalle, valor, onCambio, ultimo }) {
  return (
    <View className={`flex-row items-center py-3 ${ultimo ? '' : 'border-b border-[#f0f3f1]'}`}>
      <View className="flex-1 pr-3">
        <Text className="text-tinta font-semibold">{titulo}</Text>
        <Text className="text-[12px] text-grisTexto">{detalle}</Text>
      </View>
      <Interruptor valor={valor} onCambio={onCambio} />
    </View>
  );
}
