import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCuidador } from '../estado/CuidadorContext';
import { colors } from '../theme/colors';

export default function LoginScreen({ onRegister }) {
  const { entrar, hayNube } = useCuidador();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleContinue() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !password) {
      setError('Ingresa un correo válido y tu contraseña.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await entrar({ correo: normalizedEmail, clave: password });
    } catch (loginError) {
      console.error('No se pudo iniciar sesión en PetCare.', loginError);
      setError(loginError.message || 'No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
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
          Entra a tu cuenta para consultar los datos de tus mascotas.
        </Text>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleContinue}
            placeholder="Tu contraseña"
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            style={styles.input}
          />
        </View>

        {error ? (
          <Text style={styles.errorMessage} accessibilityRole="alert">{error}</Text>
        ) : null}

        <View style={styles.demoNotice}>
          <Text style={styles.demoNoticeText}>
            {hayNube
              ? 'Tu cuenta se sincroniza de forma segura con Supabase.'
              : 'Modo local: tu cuenta y tus datos se guardan en este dispositivo.'}
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.primaryButton, busy && styles.disabledButton]}
          onPress={handleContinue}
          disabled={busy}
        >
          <Text style={styles.primaryButtonText}>{busy ? 'Ingresando…' : 'Iniciar sesión'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
          <Text style={styles.registerText}>Crear una cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginScreen: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  loginBgGlowOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.glowGreen,
    top: -90,
    left: -70,
  },
  loginBgGlowTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.glowYellow,
    right: -60,
    bottom: 30,
  },
  loginCard: {
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  loginBrand: {
    color: colors.brand,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 18,
  },
  loginTitle: { color: colors.textDark, fontSize: 28, fontWeight: '800' },
  loginSubtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  inputWrap: { marginBottom: 14 },
  inputLabel: { color: colors.textDark, fontSize: 12, fontWeight: '700', marginBottom: 7 },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.textDark,
    fontSize: 14,
  },
  errorMessage: { color: '#b91c1c', fontSize: 13, marginBottom: 12 },
  demoNotice: { backgroundColor: '#edf8f4', borderRadius: 14, padding: 12, marginBottom: 16 },
  demoNoticeText: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  primaryButton: { backgroundColor: colors.brand, borderRadius: 15, paddingVertical: 15, alignItems: 'center' },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { color: colors.white, fontSize: 14, fontWeight: '800' },
  registerButton: { paddingVertical: 14, alignItems: 'center' },
  registerText: { color: colors.primaryDark, fontSize: 14, fontWeight: '700' },
});
