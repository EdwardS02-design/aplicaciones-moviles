import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const petList = [
  {
    id: 1,
    name: 'Mango',
    breed: 'Golden Retriever',
    age: '3 años',
    weight: '28 kg',
    next: '5 sep. Vacuna antirrábica',
    shade: '#f0d1a0',
    emoji: '🐶',
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Persa',
    age: '5 años',
    weight: '4.2 kg',
    next: '10 sep. Revisión general',
    shade: '#f1d9c6',
    emoji: '🐱',
  },
  {
    id: 3,
    name: 'Rocky',
    breed: 'Beagle',
    age: '1 año',
    weight: '9.5 kg',
    next: '15 sep. Desparasitación',
    shade: '#d4b79d',
    emoji: '🐕',
  },
];

const navItems = [
  { id: 'home', label: 'Mascotas', icon: '🐾' },
  { id: 'agenda', label: 'Agenda', icon: '🗓️' },
  { id: 'activities', label: 'Actividades', icon: '📍' },
  { id: 'location', label: 'Lugares', icon: '📍' },
  { id: 'config', label: 'Config', icon: '⚙️' },
];

function LoginScreen({ onLogin }) {
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

        <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
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

function PetDashboard({ onLogout }) {
  return (
    <SafeAreaView style={styles.dashboardScreen}>
      <StatusBar style="dark" />

      <View style={styles.phoneFrame}>
        <View style={styles.statusBar}>
          <Text style={styles.timeText}>9:41</Text>
          <View style={styles.statusIcons}>
            <Text style={styles.signalText}>◔</Text>
            <Text style={styles.signalText}>📶</Text>
            <Text style={styles.signalText}>🔋</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingSmall}>¡Hola, María! </Text>
            <Text style={styles.greetingTitle}>Mis Mascotas</Text>
          </View>
          <TouchableOpacity style={styles.avatarButton} onPress={onLogout}>
            <Text style={styles.avatarText}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total mascotas</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Perros</Text>
            <Text style={styles.statValue}>2</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Gatos</Text>
            <Text style={styles.statValue}>1</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.petList}>
          {petList.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              <View style={[styles.petImage, { backgroundColor: pet.shade }]}>
                <Text style={styles.petEmoji}>{pet.emoji}</Text>
              </View>

              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed}</Text>
                <Text style={styles.petMeta}>{pet.age}   {pet.weight}</Text>
                <View style={styles.nextRow}>
                  <Text style={styles.calendarIcon}>🗓️</Text>
                  <Text style={styles.nextText}>{pet.next}</Text>
                </View>
              </View>

              <Text style={styles.chevron}>›</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.addPetButton}>
            <Text style={styles.addPetIcon}>＋</Text>
            <Text style={styles.addPetText}>Agregar mascota</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomNav}>
          {navItems.map((item, index) => (
            <TouchableOpacity key={item.id} style={[styles.navItem, index === 0 && styles.navItemActive]}>
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navText, index === 0 && styles.navTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? <PetDashboard onLogout={() => setIsLoggedIn(false)} /> : <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
}

const styles = StyleSheet.create({
  loginScreen: {
    flex: 1,
    backgroundColor: '#e8ece8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBgGlowOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#d6f1e8',
    top: 60,
    left: -60,
    opacity: 0.8,
  },
  loginBgGlowTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#eef7db',
    right: -30,
    bottom: 100,
    opacity: 0.8,
  },
  loginCard: {
    width: '86%',
    maxWidth: 420,
    backgroundColor: '#f7f9f7',
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
    borderColor: '#eef2ef',
  },
  loginBrand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2b7a6d',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1d2a2b',
    marginBottom: 6,
  },
  loginSubtitle: {
    fontSize: 15,
    color: '#64726d',
    marginBottom: 22,
  },
  inputWrap: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    color: '#4f5857',
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#edf3ef',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dfeae5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1d2a2b',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf3ef',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dfeae5',
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    paddingRight: 12,
  },
  eyeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeText: {
    fontSize: 18,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#2d8c7d',
    fontWeight: '700',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#2db7a0',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2db7a0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#f3f7f3',
    borderWidth: 1,
    borderColor: '#dfeae5',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 15,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  registerText: {
    color: '#67736f',
    fontSize: 14,
  },
  registerLink: {
    color: '#2b7a6d',
    fontWeight: '700',
    fontSize: 14,
  },
  dashboardScreen: {
    flex: 1,
    backgroundColor: '#e9ece9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneFrame: {
    width: 390,
    maxWidth: '92%',
    height: '92%',
    backgroundColor: '#f3f5f3',
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dfe6de',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 10,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202120',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalText: {
    fontSize: 12,
    color: '#202120',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  greetingSmall: {
    fontSize: 14,
    color: '#5a655f',
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1d2a2b',
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#dff5ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#5fc4b3',
    borderRadius: 18,
    marginHorizontal: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: '#eafaf4',
    fontSize: 11,
    marginBottom: 2,
    textAlign: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '800',
  },
  petList: {
    flex: 1,
    paddingHorizontal: 18,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  petImage: {
    width: 82,
    height: 82,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  petEmoji: {
    fontSize: 30,
  },
  petInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1d2a2b',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 14,
    color: '#58635f',
    marginBottom: 2,
  },
  petMeta: {
    fontSize: 12,
    color: '#6a726f',
    marginBottom: 5,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  nextText: {
    color: '#3b8f7d',
    fontSize: 11,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 32,
    color: '#135a51',
    marginLeft: 8,
    fontWeight: '300',
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5fbf9',
    borderWidth: 2,
    borderColor: '#69d3ba',
    borderRadius: 18,
    borderStyle: 'dashed',
    paddingVertical: 18,
    marginTop: 8,
    marginBottom: 18,
  },
  addPetIcon: {
    fontSize: 26,
    color: '#2db7a0',
    marginRight: 10,
    fontWeight: '700',
  },
  addPetText: {
    color: '#2db7a0',
    fontWeight: '700',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9f8',
    borderTopWidth: 1,
    borderColor: '#e7ece7',
    paddingTop: 10,
    paddingBottom: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#eafaf5',
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    color: '#64726d',
  },
  navTextActive: {
    color: '#2b7a6d',
    fontWeight: '700',
  },
});
