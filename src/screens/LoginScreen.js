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
import { colors } from '../theme/colors';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('hola@maria.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.loginScreen}>
      <StatusBar style="dark" />

      <View style={styles.loginBgGlowOne} />
      <View style={styles.loginBgGlowTwo} />

      <View style={styles.loginCard}>
        <Text style={styles.loginBrand}>PetCare</Text>

        <Text style={styles.loginTitle}>Iniciar sesión</Text>
        <Text style={styles.loginSubtitle}>Cuida a tus mascotas con tranquilidad.</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeButton}>
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={() => onLogin?.({ email })}>
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Continuar con Google</Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginScreen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  loginBgGlowOne: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: colors.glowGreen, top: 60, left: -60, opacity: 0.8,
  },
  loginBgGlowTwo: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: colors.glowYellow, right: -30, bottom: 100, opacity: 0.8,
  },
  loginCard: {
    width: '86%', maxWidth: 420, backgroundColor: colors.card, borderRadius: 32,
    paddingHorizontal: 24, paddingTop: 28, paddingBottom: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.12,
    shadowRadius: 22, elevation: 10, borderWidth: 1, borderColor: colors.cardBorder,
  },
  loginBrand: { fontSize: 28, fontWeight: '800', color: colors.brand, textAlign: 'center', marginBottom: 16 },
  loginTitle: { fontSize: 30, fontWeight: '800', color: colors.textDark, marginBottom: 6 },
  loginSubtitle: { fontSize: 15, color: colors.textMuted, marginBottom: 22 },
  inputWrap: { marginBottom: 18 },
  inputLabel: { fontSize: 13, color: '#4f5857', marginBottom: 8, marginLeft: 4, fontWeight: '600' },
  input: {
    backgroundColor: colors.inputBg, borderRadius: 16, borderWidth: 1, borderColor: colors.inputBorder,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.textDark,
  },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg, borderRadius: 16,
    borderWidth: 1, borderColor: colors.inputBorder, paddingRight: 10,
  },
  passwordInput: { flex: 1, backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 0, paddingRight: 12 },
  eyeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  eyeText: { fontSize: 18 },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#2d8c7d', fontWeight: '700', fontSize: 13 },
  primaryButton: {
    backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center',
    marginBottom: 14, shadowColor: colors.primary, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 14, elevation: 5,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: {
    backgroundColor: '#f3f7f3', borderWidth: 1, borderColor: colors.inputBorder,
    paddingVertical: 15, borderRadius: 16, alignItems: 'center', marginBottom: 18,
  },
  secondaryButtonText: { color: '#333', fontWeight: '700', fontSize: 15 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  registerText: { color: '#67736f', fontSize: 14 },
  registerLink: { color: colors.brand, fontWeight: '700', fontSize: 14 },
});
