import React, { useState } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCuidador } from '../estado/CuidadorContext';

function mostrarAlerta(titulo, mensaje) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
}

export default function RegistroScreen({ navigation }) {
  const { registrarme } = useCuidador();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);

  async function crearCuenta() {
    setMensaje('');
    if (!nombre.trim() || !correo.trim() || clave.length < 6) {
      setMensaje('Nombre, correo y una clave de al menos 6 caracteres.');
      setEsError(true);
      return;
    }
    setOcupado(true);
    try {
      console.log('[RegistroScreen] llamando registrarme...');
      await registrarme({ nombre: nombre.trim(), correo: correo.trim(), clave });
      console.log('[RegistroScreen] registro exitoso');
      setMensaje('¡Cuenta lista! Ya puedes usar Petcare.');
      setEsError(false);
    } catch (error) {
      console.error('[RegistroScreen] error:', error.message);
      setMensaje(error.message || 'Error desconocido al registrar.');
      setEsError(true);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-fondo items-center justify-center">
      <StatusBar style="dark" />
      <View className="w-[86%] bg-white rounded-[32px] px-6 pt-7 pb-8">
        <Text className="text-[26px] font-extrabold text-tinta mb-1">Crear cuenta</Text>
        <Text className="text-grisTexto mb-5">
          Creamos tu usuario. Luego puedes entrar y ver solo tus mascotas.
        </Text>

        {mensaje ? (
          <View className={`rounded-xl px-4 py-3 mb-4 ${esError ? 'bg-[#fde8e8]' : 'bg-[#e8fde8]'}`}>
            <Text className={`text-[13px] ${esError ? 'text-[#b91c1c]' : 'text-[#166534]'}`}>{mensaje}</Text>
          </View>
        ) : null}

        <Text className="text-[13px] font-semibold mb-2">Nombre</Text>
        <TextInput value={nombre} onChangeText={setNombre} placeholder="María García" className="bg-[#edf3ef] rounded-2xl px-4 py-3.5 mb-3" />
        <Text className="text-[13px] font-semibold mb-2">Correo</Text>
        <TextInput value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" className="bg-[#edf3ef] rounded-2xl px-4 py-3.5 mb-3" />
        <Text className="text-[13px] font-semibold mb-2">Contraseña</Text>
        <TextInput value={clave} onChangeText={setClave} secureTextEntry className="bg-[#edf3ef] rounded-2xl px-4 py-3.5 mb-5" />

        <TouchableOpacity onPress={crearCuenta} disabled={ocupado} className="bg-menta py-4 rounded-2xl items-center">
          <Text className="text-white font-bold">{ocupado ? 'Creando…' : 'Registrarme'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} className="py-3 items-center">
          <Text className="text-mentaOscura font-semibold">Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
