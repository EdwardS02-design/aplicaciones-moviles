import React, { useState } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCuidador } from '../estado/CuidadorContext';

export default function LoginScreen({ navigation }) {
  const { entrar } = useCuidador();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function iniciar() {
    setMensaje('');
    if (!correo.trim() || !clave.trim()) {
      setMensaje('Escribe tu correo y contraseña para continuar.');
      return;
    }

    setOcupado(true);
    try {
      console.log('[LoginScreen] llamando entrar...');
      await entrar({ correo: correo.trim(), clave });
      console.log('[LoginScreen] login exitoso');
    } catch (error) {
      console.error('[LoginScreen] error:', error.message);
      setMensaje(error.message || 'Revisa tus credenciales o la configuración de Supabase.');
    } finally {
      setOcupado(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-fondo items-center justify-center">
      <StatusBar style="dark" />
      <View className="absolute w-72 h-72 rounded-full bg-[#d6f1e8] -top-10 -left-16 opacity-80" />
      <View className="absolute w-56 h-56 rounded-full bg-[#eef7db] right-[-20] bottom-24 opacity-80" />

      <View className="w-[86%] max-w-[420px] bg-white rounded-[32px] px-6 pt-7 pb-8 border border-[#eef2ef]">
        <Text className="text-[28px] font-extrabold text-mentaOscura text-center mb-4">Petcare</Text>
        <Text className="text-[28px] font-extrabold text-tinta">Iniciar sesión</Text>
        <Text className="text-[15px] text-grisTexto mb-5">
          Entra con el correo de tu cuenta. Tus mascotas quedan guardadas ahí.
        </Text>

        {mensaje ? (
          <View className="rounded-xl px-4 py-3 mb-4 bg-[#fde8e8]">
            <Text className="text-[13px] text-[#b91c1c]">{mensaje}</Text>
          </View>
        ) : null}

        <Text className="text-[13px] text-[#4f5857] mb-2 ml-1 font-semibold">Correo electrónico</Text>
        <TextInput
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
          className="bg-[#edf3ef] border border-[#dfeae5] rounded-2xl px-4 py-3.5 mb-4 text-tinta"
        />

        <Text className="text-[13px] text-[#4f5857] mb-2 ml-1 font-semibold">Contraseña</Text>
        <View className="flex-row items-center bg-[#edf3ef] border border-[#dfeae5] rounded-2xl mb-3 pr-2">
          <TextInput
            value={clave}
            onChangeText={setClave}
            secureTextEntry={!verClave}
            className="flex-1 px-4 py-3.5 text-tinta"
          />
          <TouchableOpacity onPress={() => setVerClave((v) => !v)} className="px-2">
            <Text>{verClave ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={iniciar}
          disabled={ocupado}
          className="bg-menta py-4 rounded-2xl items-center mb-3 mt-2"
        >
          <Text className="text-white font-bold text-base">{ocupado ? 'Entrando…' : 'Iniciar sesión'}</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-[#67736f]">¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
            <Text className="text-mentaOscura font-bold">Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
