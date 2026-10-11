import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { categoriasMascota } from '../constantes/catalogo';

export default function ModalNuevaMascota({ visible, onCerrar, onGuardar }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('perro');
  const [raza, setRaza] = useState('');
  const [edadAnios, setEdadAnios] = useState('');
  const [pesoKg, setPesoKg] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [guardando, setGuardando] = useState(false);

  function limpiar() {
    setNombre('');
    setCategoria('perro');
    setRaza('');
    setEdadAnios('');
    setPesoKg('');
    setFotoUri(null);
  }

  async function abrirGaleria() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Galería', 'Necesitamos permiso para elegir una foto.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!resultado.canceled) setFotoUri(resultado.assets[0].uri);
  }

  async function abrirCamara() {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Cámara', 'Necesitamos permiso para tomar la foto.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!resultado.canceled) setFotoUri(resultado.assets[0].uri);
  }

  async function guardar() {
    if (!nombre.trim() || !raza.trim() || !edadAnios || !pesoKg) {
      Alert.alert('Faltan datos', 'Completa nombre, raza, edad y peso.');
      return;
    }
    setGuardando(true);
    try {
      await onGuardar({
        nombre: nombre.trim(),
        categoria,
        raza: raza.trim(),
        edadAnios,
        pesoKg,
        fotoUri,
      });
      limpiar();
      onCerrar();
    } catch (error) {
      Alert.alert('No se guardó', error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="bg-fondo rounded-t-[28px] px-5 pt-4 pb-8 max-h-[92%]">
            <View className="w-12 h-1.5 bg-[#d7e0db] self-center rounded-full mb-4" />
            <Text className="text-xl font-extrabold text-tinta mb-1">Nueva mascota</Text>
            <Text className="text-grisTexto mb-4">Cuéntanos un poco de ella o él.</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="items-center mb-4">
                <View className="w-24 h-24 rounded-full overflow-hidden bg-mentaSuave items-center justify-center">
                  {fotoUri ? (
                    <Image source={{ uri: fotoUri }} className="w-full h-full" />
                  ) : (
                    <Text className="text-3xl">🐾</Text>
                  )}
                </View>
                <View className="flex-row mt-3">
                  <TouchableOpacity onPress={abrirGaleria} className="bg-white px-3 py-2 rounded-xl mr-2 border border-[#e4eee9]">
                    <Text className="text-mentaOscura font-semibold">Galería</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={abrirCamara} className="bg-white px-3 py-2 rounded-xl border border-[#e4eee9]">
                    <Text className="text-mentaOscura font-semibold">Cámara</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Campo etiqueta="Nombre" valor={nombre} onCambio={setNombre} placeholder="Mango" />
              <Text className="text-[13px] font-semibold text-[#4f5857] mb-2 ml-1">Categoría</Text>
              <View className="flex-row mb-3">
                {categoriasMascota.map((cat) => {
                  const activa = categoria === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategoria(cat.id)}
                      className={`flex-1 mr-2 last:mr-0 py-3 rounded-2xl items-center ${activa ? 'bg-menta' : 'bg-white border border-[#e4eee9]'}`}
                    >
                      <Text className="text-lg">{cat.emoji}</Text>
                      <Text className={`text-xs mt-1 font-semibold ${activa ? 'text-white' : 'text-tinta'}`}>
                        {cat.etiqueta}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Campo etiqueta="Raza" valor={raza} onCambio={setRaza} placeholder="Golden Retriever" />
              <Campo
                etiqueta="Edad (años)"
                valor={edadAnios}
                onCambio={setEdadAnios}
                placeholder="3"
                teclado="decimal-pad"
              />
              <Campo
                etiqueta="Peso (kg)"
                valor={pesoKg}
                onCambio={setPesoKg}
                placeholder="12.5"
                teclado="decimal-pad"
              />

              <TouchableOpacity
                onPress={guardar}
                disabled={guardando}
                className="bg-menta py-4 rounded-2xl items-center mt-2"
              >
                <Text className="text-white font-bold text-base">
                  {guardando ? 'Guardando…' : 'Agregar mascota'}
                </Text>
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
      <Text className="text-[13px] font-semibold text-[#4f5857] mb-2 ml-1">{etiqueta}</Text>
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
