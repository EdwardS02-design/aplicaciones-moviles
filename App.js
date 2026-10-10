import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { navItems, petList } from './src/data/pets';
import AgendaScreen from './src/screens/AgendaScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import AddPetScreen from './src/screens/AddPetScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PetDetailScreen from './src/screens/PetDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import {
  parseStoredPets,
  parseStoredReminders,
  parseStoredUser,
} from './src/data/petcareValidation';
import { cancelPetReminder } from './src/services/deviceFeatures';
import { colors } from './src/theme/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const USER_STORAGE_KEY = '@petcare/session:v1';
const PETS_STORAGE_KEY = '@petcare/pets:v1';
const REMINDERS_STORAGE_KEY = '@petcare/reminders:v1';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [storageError, setStorageError] = useState(null);
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState(petList);
  const [reminders, setReminders] = useState([]);
  const [view, setView] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPet, setSelectedPet] = useState(null);
  const persistenceQueue = useRef(Promise.resolve());

  const loadSavedData = useCallback(async () => {
    setIsReady(false);
    setLoadError(null);

    try {
      const storedValues = await AsyncStorage.multiGet([
        USER_STORAGE_KEY,
        PETS_STORAGE_KEY,
        REMINDERS_STORAGE_KEY,
      ]);
      const storedUser = storedValues[0][1];
      const storedPets = storedValues[1][1];
      const storedReminders = storedValues[2][1];

      setUser(storedUser === null ? null : parseStoredUser(storedUser));
      setPets(storedPets === null ? petList : parseStoredPets(storedPets));
      setReminders(
        storedReminders === null ? [] : parseStoredReminders(storedReminders),
      );
      setIsReady(true);
    } catch (error) {
      console.error('No se pudieron recuperar los datos locales de PetCare.', error);
      setLoadError(
        'No se pudieron recuperar tus datos guardados. Comprueba el almacenamiento e inténtalo de nuevo.',
      );
    }
  }, []);

  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  useEffect(() => {
    if (!isReady) return undefined;

    let isCurrent = true;
    const persistData = async () => {
      try {
        const currentSave = persistenceQueue.current.catch(() => {}).then(async () => {
          await AsyncStorage.multiSet([
            [PETS_STORAGE_KEY, JSON.stringify(pets)],
            [REMINDERS_STORAGE_KEY, JSON.stringify(reminders)],
          ]);
          if (user) {
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          } else {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
          }
        });
        persistenceQueue.current = currentSave.catch(() => {});
        await currentSave;
        if (isCurrent) setStorageError(null);
      } catch (error) {
        console.error('No se pudieron guardar los datos locales de PetCare.', error);
        if (isCurrent) {
          setStorageError(
            'No se pudieron guardar los cambios en este dispositivo. Comprueba el espacio disponible.',
          );
        }
      }
    };

    persistData();
    return () => {
      isCurrent = false;
    };
  }, [isReady, pets, reminders, user]);

  function handleLogin({ email }) {
    const normalizedEmail = email.trim().toLowerCase();
    setUser({
      name: normalizedEmail.split('@')[0] || 'Usuario',
      email: normalizedEmail,
    });
    setView('home');
    setActiveTab('home');
  }

  function handleLogout() {
    setUser(null);
    setView('home');
    setActiveTab('home');
  }

  function handleSelectTab(tabId) {
    setActiveTab(tabId);
    setView(tabId === 'config' ? 'profile' : tabId);
  }

  function handleOpenPet(pet) {
    setSelectedPet(pet);
    setView('petDetail');
  }

  function handleAddPet(pet) {
    setPets((currentPets) => [...currentPets, pet]);
    setView('home');
    setActiveTab('home');
  }

  function handleUpdatePet(updatedPet) {
    setPets((currentPets) =>
      currentPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)),
    );
    setSelectedPet(updatedPet);
    setView('home');
    setActiveTab('home');
  }

  function handleAddReminder(reminder) {
    setReminders((currentReminders) =>
      [...currentReminders, reminder].sort(
        (left, right) => Date.parse(left.date) - Date.parse(right.date),
      ),
    );
  }

  async function handleRemoveReminder(reminder) {
    if (reminder.notificationId) {
      await cancelPetReminder(reminder.notificationId);
    }
    setReminders((currentReminders) =>
      currentReminders.filter((item) => item.id !== reminder.id),
    );
  }

  if (!isReady) {
    return (
      <SafeAreaView style={styles.statusScreen}>
        <StatusBar style="dark" />
        {loadError ? (
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>No se pudieron cargar tus datos</Text>
            <Text style={styles.statusMessage}>{loadError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadSavedData}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.statusMessage}>Cargando PetCare…</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} storageError={storageError} />;
  }

  if (view === 'profile') {
    return (
      <ProfileScreen
        userName={user.name}
        userEmail={user.email}
        storageError={storageError}
        onBack={() => {
          setView('home');
          setActiveTab('home');
        }}
        onLogout={handleLogout}
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
        storageError={storageError}
        onBack={() => handleSelectTab('home')}
        onAddReminder={handleAddReminder}
        onRemoveReminder={handleRemoveReminder}
      />
    );
  }

  if (view === 'activities') {
    return <ActivitiesScreen onBack={() => handleSelectTab('home')} />;
  }

  if (view === 'addPet' || view === 'editPet') {
    return (
      <AddPetScreen
        pet={view === 'editPet' ? selectedPet : null}
        storageError={storageError}
        onBack={() => setView('home')}
        onSave={view === 'editPet' ? handleUpdatePet : handleAddPet}
      />
    );
  }

  if (view === 'location') {
    const tab = navItems.find((item) => item.id === view);
    return (
      <ComingSoonScreen
        label={tab.label}
        icon={tab.icon}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />
    );
  }

  return (
    <HomeScreen
      userName={user.name}
      pets={pets}
      activeTab={activeTab}
      storageError={storageError}
      onSelectTab={handleSelectTab}
      onOpenProfile={() => setView('profile')}
      onOpenPet={handleOpenPet}
      onAddPet={() => setView('addPet')}
    />
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
