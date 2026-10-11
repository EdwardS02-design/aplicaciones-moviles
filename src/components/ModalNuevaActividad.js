import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { tiposActividad } from '../constantes/catalogo';
import { fechaHoyLocal } from '../lib/fechas';

export default function ModalNuevaActividad({ visible, onCerrar, onGuardar, mascotas }) {
  const [mascotaId, setMascotaId] = useState(mascotas[0]?.id || '');
  const [tipo, setTipo] = useState('desayuno');
  const [titulo, setTitulo] = useState('');
  const [hora, setHora] = useState('08:00');
  const [duracionMin, setDuracionMin] = useState('');
  const [fecha, setFecha] = useState(fechaHoyLocal);

  async function guardar() {
    if (!mascotaId || !titulo.trim()) {
      Alert.alert('Faltan datos', 'Elige mascota y escribe qué hicieron.');
      return;
    }
    try {
      await onGuardar({
        mascotaId,
        tipo,
        titulo: titulo.trim(),
        hora,
        duracionMin,
        fecha,
      });
      setTitulo('');
      setDuracionMin('');
      onCerrar();
    } catch (error) {
      Alert.alert('No se guardó', error.message);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="bg-fondo rounded-t-[28px] px-5 pt-4 pb-8 max-h-[90%]">
            <Text className="text-xl font-extrabold text-tinta mb-4">Nueva actividad</Text>
            <ScrollView>
              <Text className="text-[13px] font-semibold text-[#4f5857] mb-2">Mascota</Text>
              <View className="flex-row flex-wrap mb-3">
                {mascotas.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setMascotaId(m.id)}
                    className={`px-3 py-2 rounded-full mr-2 mb-2 ${mascotaId === m.id ? 'bg-menta' : 'bg-white border border-[#e4eee9]'}`}
                  >
                    <Text className={mascotaId === m.id ? 'text-white font-semibold' : 'text-tinta'}>{m.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-[13px] font-semibold text-[#4f5857] mb-2">Tipo</Text>
              <View className="flex-row flex-wrap mb-3">
                {tiposActividad.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setTipo(t.id);
                      if (!titulo) setTitulo(t.etiqueta);
                    }}
                    className={`px-3 py-2 rounded-full mr-2 mb-2 ${tipo === t.id ? 'bg-menta' : 'bg-white border border-[#e4eee9]'}`}
                  >
                    <Text className={tipo === t.id ? 'text-white' : 'text-tinta'}>
                      {t.icono} {t.etiqueta}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Campo etiqueta="Detalle" valor={titulo} onCambio={setTitulo} placeholder="Paseo en el parque" />
              <Campo etiqueta="Fecha (AAAA-MM-DD)" valor={fecha} onCambio={setFecha} />
              <Campo etiqueta="Hora" valor={hora} onCambio={setHora} />
              <Campo etiqueta="Duración (min, opcional)" valor={duracionMin} onCambio={setDuracionMin} teclado="number-pad" />

              <TouchableOpacity onPress={guardar} className="bg-menta py-4 rounded-2xl items-center mt-2">
                <Text className="text-white font-bold">Añadir al registro</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCerrar} className="py-3 items-center">
                <Text className="text-grisTexto">Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function Campo({ etiqueta, valor, onCambio, placeholder, teclado }) {
  return (
    <View className="mb-3">
      <Text className="text-[13px] font-semibold text-[#4f5857] mb-2">{etiqueta}</Text>
      <TextInput
        value={valor}
        onChangeText={onCambio}
        placeholder={placeholder}
        keyboardType={teclado || 'default'}
        className="bg-white border border-[#dfeae5] rounded-2xl px-4 py-3 text-tinta"
      />
    </View>
  );
}
