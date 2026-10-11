import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { pedirLugaresCercanos } from '../lib/lugares';

const Mapas = Platform.OS === 'web' ? null : require('react-native-maps');
const MapView = Mapas?.default;
const Marker = Mapas?.Marker;

const filtros = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'veterinaria', etiqueta: 'Veterinaria', icono: 'medkit-outline' },
  { id: 'peluqueria', etiqueta: 'Peluquería', icono: 'cut-outline' },
  { id: 'tienda', etiqueta: 'Tienda', icono: 'bag-outline' },
  { id: 'parque', etiqueta: 'Parque', icono: 'leaf-outline' },
];

const iconoTipo = {
  parque: { emoji: '🌳', color: '#3d8f62' },
  veterinaria: { emoji: '🏥', color: '#3a6fb0' },
  peluqueria: { emoji: '✂️', color: '#8a5aad' },
  tienda: { emoji: '🛍️', color: '#c48a2b' },
};

export default function LugaresScreen() {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [region, setRegion] = useState({
    latitude: -12.1211,
    longitude: -77.0297,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });
  const [miPosicion, setMiPosicion] = useState(null);

  useEffect(() => {
    ubicarYBuscar(filtro);
  }, [filtro]);

  async function ubicarYBuscar(tipo) {
    setCargando(true);
    try {
      const permiso = await Location.requestForegroundPermissionsAsync();
      let lat = region.latitude;
      let lng = region.longitude;
      if (permiso.status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        setMiPosicion({ latitude: lat, longitude: lng });
        setRegion((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      }
      const lista = await pedirLugaresCercanos({ latitud: lat, longitud: lng, filtro: tipo });
      setLugares(lista);
    } catch {
      const lista = await pedirLugaresCercanos({
        latitud: region.latitude,
        longitud: region.longitude,
        filtro: tipo,
      }).catch(() => []);
      setLugares(lista);
    } finally {
      setCargando(false);
    }
  }

  const visibles = lugares.filter((l) =>
    `${l.nombre} ${l.direccion}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      <StatusBar style="dark" />
      <View className="px-5 pt-2 pb-2">
        <Text className="text-[13px] text-grisTexto">Servicios para tu mascota</Text>
        <Text className="text-[26px] font-extrabold text-tinta">Lugares Cercanos</Text>
      </View>

      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-white rounded-2xl px-3 py-2 border border-[#e4eee9]">
          <Ionicons name="search" size={16} color="#8a9692" />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar lugares..."
            className="flex-1 ml-2 py-1 text-tinta"
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-3" contentContainerStyle={{ paddingRight: 20 }}>
        {filtros.map((f) => {
          const activo = filtro === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFiltro(f.id)}
              className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 ${activo ? 'bg-menta' : 'bg-white border border-[#e4eee9]'}`}
            >
              {f.icono ? <Ionicons name={f.icono} size={14} color={activo ? '#fff' : '#2b7a6d'} /> : null}
              <Text className={`ml-1 ${activo ? 'text-white font-semibold' : 'text-tinta'}`}>{f.etiqueta}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {MapView ? (
        <View className="h-44 mx-5 mb-3 rounded-[22px] overflow-hidden">
          <MapView style={{ flex: 1 }} region={region}>
            {miPosicion ? <Marker coordinate={miPosicion} title="Estás aquí" pinColor="#5ebfae" /> : null}
            {visibles.map((lugar) => (
              <Marker
                key={lugar.id}
                coordinate={{ latitude: lugar.lat, longitude: lugar.lng }}
                title={lugar.nombre}
                description={lugar.direccion}
              />
            ))}
          </MapView>
        </View>
      ) : null}

      {cargando ? (
        <ActivityIndicator color="#5ebfae" className="mt-6" />
      ) : (
        <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 28 }}>
          {visibles.map((lugar) => {
            const visual = iconoTipo[lugar.tipo] || { emoji: '📍', color: '#5ebfae' };
            return (
              <View key={lugar.id} className="bg-white rounded-[20px] p-3 mb-3">
                <View className="flex-row">
                  <View className="w-10 h-10 rounded-2xl bg-[#eef6f2] items-center justify-center mr-3">
                    <Text>{visual.emoji}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between">
                      <Text className="font-bold text-tinta flex-1 mr-2">{lugar.nombre}</Text>
                      <Text className="text-mentaOscura text-[12px] font-semibold">{lugar.distanciaKm} km</Text>
                    </View>
                    <Text className="text-[12px] text-grisTexto">{lugar.direccion}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-[#e0a14a] mr-1">★★★★★</Text>
                      <Text className="text-[12px] text-grisTexto mr-2">{lugar.rating || '—'}</Text>
                      <Text className="text-[12px] capitalize text-grisTexto">{lugar.tipo}</Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="time-outline" size={12} color="#8a9692" />
                      <Text className="text-[12px] text-grisTexto ml-1">{lugar.horario}</Text>
                    </View>
                  </View>
                </View>
                {lugar.telefono ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${lugar.telefono.replace(/\s/g, '')}`)}
                    className="mt-3 bg-mentaSuave rounded-2xl py-2 items-center"
                  >
                    <Text className="text-mentaOscura font-semibold">📞  {lugar.telefono}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
