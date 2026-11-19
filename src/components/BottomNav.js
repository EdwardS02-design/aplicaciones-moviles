import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const navItems = [
  { id: 'home', label: 'Mascotas', icon: '🐾' },
  { id: 'agenda', label: 'Agenda', icon: '🗓️' },
  { id: 'activities', label: 'Actividades', icon: '📍' },
  { id: 'location', label: 'Lugares', icon: '📍' },
  { id: 'config', label: 'Config', icon: '⚙️' },
];

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <View className="flex-row justify-around items-center bg-[#f8f9f8] border-t border-[#e7ece7] pt-2.5 pb-3">
      {navItems.map((item) => {
        const isActive = item.id === activeTab;
        return (
          <TouchableOpacity
            key={item.id}
            className={`items-center justify-center py-1.5 px-2.5 rounded-xl ${isActive ? 'bg-[#eafaf5]' : ''}`}
            onPress={() => onSelectTab?.(item.id)}
          >
            <Text className="text-[18px] mb-1">{item.icon}</Text>
            <Text className={`text-[10px] ${isActive ? 'text-mentaOscura font-bold' : 'text-grisTexto'}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

