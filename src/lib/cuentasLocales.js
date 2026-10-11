import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const preferenciasDemo = {
  recordatorios: true,
  avisosCitas: true,
  alertaVacunas: true,
  resumenSemanal: false,
  modoOscuro: false,
  idioma: 'es-PE',
  unidadPeso: 'kg',
};

const CAJA_CUENTAS = 'petcare-cuentas';
const SESION_ACTIVA = 'petcare-sesion-activa';
const PASSWORD_KEY_PREFIX = 'petcare-local-password:';

function idNuevo() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizarCorreo(correo) {
  return (correo || '').trim().toLowerCase();
}

function clavePassword(id) {
  return `${PASSWORD_KEY_PREFIX}${id}`;
}

function asegurarAlmacenamientoSeguro() {
  if (Platform.OS === 'web') {
    throw new Error('Para crear o usar una cuenta local segura, abre PetCare en Android o iOS, o configura Supabase para la versión web.');
  }
}

async function leerCuentas() {
  const crudo = await AsyncStorage.getItem(CAJA_CUENTAS);
  return crudo ? JSON.parse(crudo) : [];
}

async function escribirCuentas(lista) {
  await AsyncStorage.setItem(CAJA_CUENTAS, JSON.stringify(lista));
}

export async function registrarCuentaLocal({ nombre, correo, clave }) {
  const correoLimpio = normalizarCorreo(correo);
  const lista = await leerCuentas();
  if (lista.some((cuenta) => cuenta.correo === correoLimpio)) {
    throw new Error('Ese correo ya tiene una cuenta. Entra con tu contraseña.');
  }

  const nueva = {
    id: idNuevo(),
    nombre: nombre.trim(),
    correo: correoLimpio,
    ciudad: 'Lima, Perú',
    mascotas: [],
    citas: [],
    actividades: [],
    preferencias: preferenciasDemo,
  };

  asegurarAlmacenamientoSeguro();
  await SecureStore.setItemAsync(clavePassword(nueva.id), clave);
  await escribirCuentas([...lista, nueva]);
  await AsyncStorage.setItem(SESION_ACTIVA, nueva.id);
  return nueva;
}

export async function entrarCuentaLocal({ correo, clave }) {
  const correoLimpio = normalizarCorreo(correo);
  const lista = await leerCuentas();
  const cuenta = lista.find((item) => item.correo === correoLimpio);

  if (!cuenta) {
    throw new Error('No hay una cuenta con ese correo. Regístrate primero.');
  }
  asegurarAlmacenamientoSeguro();
  const passwordKey = clavePassword(cuenta.id);
  const savedPassword = await SecureStore.getItemAsync(passwordKey);
  if (savedPassword !== null && savedPassword !== clave) {
    throw new Error('La contraseña no coincide.');
  }
  if (savedPassword === null) {
    if (cuenta.clave !== clave) throw new Error('La contraseña no coincide.');
    await SecureStore.setItemAsync(passwordKey, clave);
  }
  if (Object.prototype.hasOwnProperty.call(cuenta, 'clave')) {
    await escribirCuentas(
      lista.map((item) => {
        if (item.id !== cuenta.id) return item;
        const cuentaSegura = { ...item };
        delete cuentaSegura.clave;
        return cuentaSegura;
      }),
    );
  }

  await AsyncStorage.setItem(SESION_ACTIVA, cuenta.id);
  return cuenta;
}

export async function cuentaLocalActiva() {
  const id = await AsyncStorage.getItem(SESION_ACTIVA);
  if (!id) return null;
  const lista = await leerCuentas();
  return lista.find((cuenta) => cuenta.id === id) || null;
}

export async function guardarCuentaLocal(cuenta) {
  const lista = await leerCuentas();
  const actualizada = lista.map((item) => {
    if (item.id !== cuenta.id) return item;
    const mezclado = { ...item };
    Object.entries(cuenta).forEach(([claveCampo, valor]) => {
      if (valor !== undefined) mezclado[claveCampo] = valor;
    });
    return mezclado;
  });
  await escribirCuentas(actualizada);
}

export async function cerrarSesionLocal() {
  await AsyncStorage.removeItem(SESION_ACTIVA);
}
