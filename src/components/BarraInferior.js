import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pestañas } from '../constantes/catalogo';

export default function BarraInferior({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-white border-t border-[#e7ece7] px-1"
      style={{ paddingBottom: Math.max(insets.bottom, 10), paddingTop: 8 }}
    >
      {pestañas.map((item, index) => {
        const activa = state.index === index;
        return (
          <TouchableOpacity
            key={item.id}
            className="flex-1 items-center"
            onPress={() => navigation.navigate(item.id)}
          >
            <Ionicons
              name={activa ? item.icono : `${item.icono}-outline`}
              size={20}
              color={activa ? '#2b7a6d' : '#8a9692'}
            />
            <Text className={`text-[10px] mt-1 ${activa ? 'text-mentaOscura font-bold' : 'text-grisTexto'}`}>
              {item.etiqueta}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
