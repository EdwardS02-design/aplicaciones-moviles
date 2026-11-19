import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const urlProyecto = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').trim();
const clavePublica = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const urlTieneFormato = /^https:\/\/[a-z0-9-]+\.supabase\.co(?:\/.+)?$/i.test(urlProyecto);
const claveEsPublica =
  clavePublica.length > 20 &&
  !clavePublica.startsWith('sb_secret_') &&
  !clavePublica.startsWith('service_role');
const claveTieneFormato =
  claveEsPublica &&
  (clavePublica.startsWith('eyJ') || clavePublica.startsWith('sb_publishable_') || clavePublica.includes('.'));

export const hayNube = Boolean(urlProyecto && clavePublica && urlTieneFormato && claveTieneFormato);

if (!hayNube) {
  console.warn('Supabase no está configurado correctamente. Revisa EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en el archivo .env.');
}

const memoria = {
  getItem: (clave) =>
    Platform.OS === 'web'
      ? AsyncStorage.getItem(clave)
      : SecureStore.getItemAsync(clave),
  setItem: (clave, valor) =>
    Platform.OS === 'web'
      ? AsyncStorage.setItem(clave, valor)
      : SecureStore.setItemAsync(clave, valor),
  removeItem: (clave) =>
    Platform.OS === 'web'
      ? AsyncStorage.removeItem(clave)
      : SecureStore.deleteItemAsync(clave),
};

export const supabase = hayNube
  ? createClient(urlProyecto, clavePublica, {
      auth: {
        storage: memoria,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
