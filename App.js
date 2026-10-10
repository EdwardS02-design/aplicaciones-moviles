import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { navItems, petList } from './src/data/pets';
import AddPetScreen from './src/screens/AddPetScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PetDetailScreen from './src/screens/PetDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';

const USER_STORAGE_KEY = '@petcare/session:v1';
const PETS_STORAGE_KEY = '@petcare/pets:v1';

function readStoredUser(value) {
  const user = JSON.parse(value);
  if (
    !user ||
    typeof user.name !== 'string' ||
    typeof user.email !== 'string'
  ) {
    throw new Error('El perfil guardado no tiene un formato válido.');
  }
  return user;
}

function readStoredPets(value) {
  const pets = JSON.parse(value);
  const isPet = (pet) =>
    pet &&
    (typeof pet.id === 'string' || typeof pet.id === 'number') &&
    ['name', 'breed', 'age', 'weight', 'next', 'shade', 'emoji'].every(
      (field) => typeof pet[field] === 'string',
    );

  if (!Array.isArray(pets) || !pets.every(isPet)) {
    throw new Error('La lista de mascotas guardada no tiene un formato válido.');
  }
  return pets;
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [storageError, setStorageError] = useState(null);
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState(petList);
  const [view, setView] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPet, setSelectedPet] = useState(null);

  const loadSavedData = useCallback(async () => {
    setIsReady(false);
    setLoadError(null);

    try {
      const storedValues = await AsyncStorage.multiGet([
        USER_STORAGE_KEY,
        PETS_STORAGE_KEY,
      ]);
      const storedUser = storedValues[0][1];
      const storedPets = storedValues[1][1];

      setUser(storedUser === null ? null : readStoredUser(storedUser));
      setPets(storedPets === null ? petList : readStoredPets(storedPets));
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
        const operations = [
          AsyncStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets)),
          user
            ? AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
            : AsyncStorage.removeItem(USER_STORAGE_KEY),
        ];
        await Promise.all(operations);
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
  }, [isReady, pets, user]);

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
      />
    );
  }

  if (view === 'addPet') {
    return (
      <AddPetScreen
        storageError={storageError}
        onBack={() => setView('home')}
        onSave={handleAddPet}
      />
    );
  }

  if (view === 'agenda' || view === 'activities' || view === 'location') {
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
