import React, { useState } from 'react';
<<<<<<< HEAD
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
      await entrar({ correo: correo.trim(), clave });
    } catch (error) {
      console.warn('No se pudo iniciar sesión.', error.message);
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
=======
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

export default function LoginScreen({ onLogin, storageError }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);

  function handleContinue() {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError('Ingresa un correo electrónico válido.');
      return;
    }

    setEmailError(null);
    onLogin({ email: normalizedEmail });
  }

  return (
    <SafeAreaView style={styles.loginScreen}>
      <StatusBar style="dark" />

      <View style={styles.loginBgGlowOne} />
      <View style={styles.loginBgGlowTwo} />

      <View style={styles.loginCard}>
        <Text style={styles.loginBrand}>PetCare</Text>
        <Text style={styles.loginTitle}>Bienvenido</Text>
        <Text style={styles.loginSubtitle}>
          Ingresa un correo para abrir tu espacio de cuidado.
        </Text>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (emailError) setEmailError(null);
            }}
            onSubmitEditing={handleContinue}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        {emailError ? (
          <Text style={styles.errorMessage} accessibilityRole="alert">
            {emailError}
          </Text>
        ) : null}
        {storageError ? (
          <Text style={styles.errorMessage} accessibilityRole="alert">
            {storageError}
          </Text>
        ) : null}

        <View style={styles.demoNotice}>
          <Text style={styles.demoNoticeText}>
            Modo de demostración: no se valida una contraseña ni se envían datos a un servidor.
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          style={styles.primaryButton}
          onPress={handleContinue}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
      </View>
    </SafeAreaView>
  );
}
<<<<<<< HEAD
=======

const styles = StyleSheet.create({
  loginScreen: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  loginBgGlowOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.glowGreen,
    top: 60,
    left: -60,
    opacity: 0.8,
  },
  loginBgGlowTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.glowYellow,
    right: -30,
    bottom: 100,
    opacity: 0.8,
  },
  loginCard: {
    width: '86%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  loginBrand: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.brand,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginTitle: { fontSize: 30, fontWeight: '800', color: colors.textDark, marginBottom: 6 },
  loginSubtitle: { fontSize: 15, color: colors.textMuted, marginBottom: 22, lineHeight: 21 },
  inputWrap: { marginBottom: 14 },
  inputLabel: {
    fontSize: 13,
    color: '#4f5857',
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textDark,
  },
  errorMessage: { color: '#b23b35', fontSize: 13, lineHeight: 19, marginBottom: 10 },
  demoNotice: {
    backgroundColor: '#f3f7f3',
    borderRadius: 14,
    marginBottom: 18,
    padding: 12,
  },
  demoNoticeText: { color: '#58635f', fontSize: 12, lineHeight: 18 },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
