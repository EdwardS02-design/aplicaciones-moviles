import './global.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import AgendaScreen from './src/screens/AgendaScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import AddPetScreen from './src/screens/AddPetScreen';
import ActividadesScreen from './src/screens/ActividadesScreen';
import ConfiguracionScreen from './src/screens/ConfiguracionScreen';
import HomeScreen from './src/screens/HomeScreen';
import LugaresScreen from './src/screens/LugaresScreen';
import LoginScreen from './src/screens/LoginScreen';
import MascotasScreen from './src/screens/MascotasScreen';
import PetDetailScreen from './src/screens/PetDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import {
  parseStoredPets,
  parseStoredReminders,
  parseStoredUser,
} from './src/data/petcareValidation';
import { cancelPetReminder } from './src/services/deviceFeatures';
import { CuidadorProvider, useCuidador } from './src/estado/CuidadorContext';
import { colors } from './src/theme/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const LEGACY_REMINDERS_STORAGE_KEY = '@petcare/reminders:v1';
const LEGACY_USER_STORAGE_KEY = '@petcare/session:v1';
const LEGACY_PETS_STORAGE_KEY = '@petcare/pets:v1';

function toMainPet(pet, proximaCitaDe) {
  const cita = proximaCitaDe(pet.id);
  const age = Number(pet.edadAnios);
  const weight = Number(pet.pesoKg);
  return {
    id: pet.id,
    name: pet.nombre,
    breed: pet.raza,
    age: age ? `${age} ${age === 1 ? 'año' : 'años'}` : 'No indicada',
    weight: weight ? `${weight} kg` : 'No registrado',
    next: cita ? `${cita.fecha} ${cita.titulo}` : 'Sin cita programada',
    shade: pet.colorFicha || '#f0d1a0',
    emoji: pet.categoria === 'cat' || pet.categoria === 'gato'
      ? '🐱'
      : pet.categoria === 'conejo'
        ? '🐰'
        : '🐶',
    ...(pet.fotoUrl ? { photoUri: pet.fotoUrl } : {}),
    ...(pet.ubicacion ? { location: pet.ubicacion } : {}),
  };
}

function AppContent() {
  const {
    cargando,
    sesion,
    perfil,
    aviso,
    mascotas: caregiverPets,
    proximaCitaDe,
    agregarMascota,
    importarMascotas,
    actualizarMascota,
    salir,
  } = useCuidador();
  const [loadError, setLoadError] = useState(null);
  const [storageError, setStorageError] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [remindersLoadedKey, setRemindersLoadedKey] = useState(null);
  const [view, setView] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPet, setSelectedPet] = useState(null);
  const migratedAccounts = useRef(new Set());
  const reminderLoadRequest = useRef(0);
  const importarMascotasActual = useRef(importarMascotas);
  importarMascotasActual.current = importarMascotas;

  const pets = caregiverPets.map((pet) => toMainPet(pet, proximaCitaDe));
  const reminderStorageKey = sesion?.user?.id
    ? `@petcare/reminders:v2:${sesion.user.id}`
    : null;

  const loadReminders = useCallback(async () => {
    if (!reminderStorageKey) return;
    const requestId = ++reminderLoadRequest.current;
    setLoadError(null);
    setRemindersLoadedKey(null);
    try {
      const saved = await AsyncStorage.getItem(reminderStorageKey);
      let loaded = saved === null ? null : parseStoredReminders(saved);
      if (loaded === null) {
        const migrationKey = `@petcare/reminders-migrated:${sesion.user.id}`;
        const migrated = await AsyncStorage.getItem(migrationKey);
        if (!migrated) {
          const [savedUser, savedReminders] = await AsyncStorage.multiGet([
            LEGACY_USER_STORAGE_KEY,
            LEGACY_REMINDERS_STORAGE_KEY,
          ]);
          const previousUser = savedUser[1] ? parseStoredUser(savedUser[1]) : null;
          if (previousUser?.email?.toLowerCase() === sesion.user.email?.toLowerCase()) {
            loaded = savedReminders[1] ? parseStoredReminders(savedReminders[1]) : [];
          }
          await AsyncStorage.setItem(migrationKey, 'true');
        }
      }
      if (reminderLoadRequest.current !== requestId) return;
      setReminders(loaded || []);
      setRemindersLoadedKey(reminderStorageKey);
    } catch (error) {
      if (reminderLoadRequest.current !== requestId) return;
      console.error('No se pudieron recuperar los recordatorios locales de PetCare.', error);
      setLoadError('No se pudieron recuperar tus recordatorios guardados. Comprueba el almacenamiento e inténtalo de nuevo.');
    }
  }, [reminderStorageKey, sesion?.user?.email]);

  useEffect(() => {
    setRemindersLoadedKey(null);
    if (!reminderStorageKey) {
      reminderLoadRequest.current += 1;
      setReminders([]);
      return undefined;
    }
    loadReminders();
    return undefined;
  }, [loadReminders, reminderStorageKey]);

  useEffect(() => {
    if (!sesion?.user?.id || migratedAccounts.current.has(sesion.user.id)) return;

    let current = true;
    const migrateLegacyPets = async () => {
      const marker = `@petcare/legacy-migrated:${sesion.user.id}`;
      try {
        if (await AsyncStorage.getItem(marker)) {
          migratedAccounts.current.add(sesion.user.id);
          return;
        }
        const [savedUser, savedPets] = await AsyncStorage.multiGet([
          LEGACY_USER_STORAGE_KEY,
          LEGACY_PETS_STORAGE_KEY,
        ]);
        const legacyUser = savedUser[1] ? parseStoredUser(savedUser[1]) : null;
        const legacyPets = savedPets[1] ? parseStoredPets(savedPets[1]) : [];
        if (legacyUser?.email?.toLowerCase() === sesion.user.email?.toLowerCase()) {
          await importarMascotasActual.current(legacyPets.map((pet) => ({
              nombre: pet.name,
              categoria: pet.emoji === '🐱' ? 'gato' : pet.emoji === '🐰' ? 'conejo' : 'perro',
              raza: pet.breed,
              edadAnios: Number.parseFloat(pet.age) || 0,
              pesoKg: Number.parseFloat(pet.weight) || 0,
              fotoUri: pet.photoUri || null,
              ubicacion: pet.location || null,
          })));
        }
        if (current) {
          await AsyncStorage.setItem(marker, 'true');
          migratedAccounts.current.add(sesion.user.id);
        }
      } catch (error) {
        console.error('No se pudieron migrar las mascotas guardadas previamente.', error);
        if (current) {
          setStorageError('No se pudieron importar tus mascotas anteriores. Tus datos originales se conservaron.');
          migratedAccounts.current.add(sesion.user.id);
        }
      }
    };

    migrateLegacyPets();
    return () => {
      current = false;
    };
  }, [sesion?.user?.id, sesion?.user?.email]);

  useEffect(() => {
    if (!reminderStorageKey || remindersLoadedKey !== reminderStorageKey) return;
    AsyncStorage.setItem(reminderStorageKey, JSON.stringify(reminders))
      .then(() => setStorageError(null))
      .catch((error) => {
        console.error('No se pudieron guardar los recordatorios locales de PetCare.', error);
        setStorageError('No se pudieron guardar los recordatorios en este dispositivo. Comprueba el espacio disponible.');
      });
  }, [reminders, remindersLoadedKey, reminderStorageKey]);

  function handleSelectTab(tabId) {
    setActiveTab(tabId);
    setView(tabId === 'config' ? 'settings' : tabId === 'location' ? 'lugares' : tabId);
  }

  function handleOpenPet(pet) {
    setSelectedPet(pet);
    setView('petDetail');
  }

  async function handleSavePet(pet) {
    const datos = {
      nombre: pet.name,
      categoria: pet.emoji === '🐱' ? 'gato' : pet.emoji === '🐰' ? 'conejo' : 'perro',
      raza: pet.breed,
      edadAnios: Number.parseFloat(pet.age) || 0,
      pesoKg: Number.parseFloat(pet.weight) || 0,
      fotoUri: pet.photoUri || null,
      ubicacion: pet.location || null,
    };
    try {
      if (view === 'editPet') {
        await actualizarMascota(selectedPet.id, datos);
      } else {
        await agregarMascota(datos);
      }
      setView('home');
      setActiveTab('home');
    } catch (error) {
      console.error('No se pudo guardar la mascota en PetCare.', error);
      setStorageError(error.message || 'No se pudo guardar la mascota. Inténtalo de nuevo.');
    }
  }

  function handleAddReminder(reminder) {
    setReminders((current) =>
      [...current, reminder].sort((left, right) => Date.parse(left.date) - Date.parse(right.date)),
    );
  }

  async function handleRemoveReminder(reminder) {
    if (reminder.notificationId) await cancelPetReminder(reminder.notificationId);
    setReminders((current) => current.filter((item) => item.id !== reminder.id));
  }

  if (cargando) {
    return (
      <SafeAreaView style={styles.statusScreen}>
        <StatusBar style="dark" />
        <View style={styles.statusContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.statusMessage}>Cargando PetCare…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.statusScreen}>
        <StatusBar style="dark" />
        <View style={styles.statusContent}>
          <Text style={styles.statusTitle}>No se pudieron cargar tus datos</Text>
          <Text style={styles.statusMessage}>{loadError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadReminders}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!sesion) {
    if (view === 'register') {
      return <RegistroScreen navigation={{ goBack: () => setView('login') }} />;
    }
    return <LoginScreen onRegister={() => setView('register')} />;
  }

  if (view === 'profile') {
    return (
      <ProfileScreen
        userName={perfil.nombre}
        userEmail={perfil.correo}
        storageError={storageError || aviso}
        isCloudAccount={!sesion.local}
        onBack={() => {
          setView('home');
          setActiveTab('home');
        }}
        onLogout={salir}
      />
    );
  }

  if (view === 'settings') {
    return <ConfiguracionScreen onBack={() => setView('home')} />;
  }

  if (view === 'mascotas') {
    return (
      <MascotasScreen
        onBack={() => setView('home')}
        navigation={{
          navigate: (target, params) => {
            if (target === 'Config') setView('settings');
            if (target === 'DetalleMascota') {
              const pet = pets.find((item) => String(item.id) === String(params?.mascotaId));
              if (pet) handleOpenPet(pet);
            }
          },
        }}
      />
    );
  }

  if (view === 'petDetail') {
    return (
      <PetDetailScreen
        pet={selectedPet}
        onBack={() => setView('home')}
        onEdit={() => setView('editPet')}
      />
    );
  }

  if (view === 'agenda') {
    return (
      <AgendaScreen
        pets={pets}
        reminders={reminders}
        storageError={storageError || aviso}
        onBack={() => handleSelectTab('home')}
        onAddReminder={handleAddReminder}
        onRemoveReminder={handleRemoveReminder}
      />
    );
  }

  if (view === 'activities') {
    return (
      <ActivitiesScreen
        onBack={() => handleSelectTab('home')}
        onOpenRutinas={() => setView('careActivities')}
      />
    );
  }

  if (view === 'careActivities') {
    return <ActividadesScreen onBack={() => setView('activities')} />;
  }

  if (view === 'lugares') {
    return <LugaresScreen onBack={() => handleSelectTab('home')} />;
  }

  if (view === 'addPet' || view === 'editPet') {
    return (
      <AddPetScreen
        pet={view === 'editPet' ? selectedPet : null}
        storageError={storageError || aviso}
        onBack={() => setView('home')}
        onSave={handleSavePet}
      />
    );
  }

  return (
    <HomeScreen
      userName={perfil.nombre}
      pets={pets}
      activeTab={activeTab}
      storageError={storageError || aviso}
      onSelectTab={handleSelectTab}
      onOpenProfile={() => setView('profile')}
      onOpenPet={handleOpenPet}
      onAddPet={() => setView('addPet')}
      onManagePets={() => setView('mascotas')}
    />
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CuidadorProvider>
          <AppContent />
        </CuidadorProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  statusScreen: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
    backgroundColor: colors.bgDashboard,
  },
  statusContent: { alignItems: 'center' },
  statusTitle: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusMessage: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  retryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
