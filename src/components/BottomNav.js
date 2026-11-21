import React from 'react';
<<<<<<< HEAD
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
=======
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { navItems } from '../data/pets';
import { colors } from '../theme/colors';

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <View style={styles.bottomNav}>
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
      {navItems.map((item) => {
        const isActive = item.id === activeTab;
        return (
          <TouchableOpacity
            key={item.id}
<<<<<<< HEAD
            className={`items-center justify-center py-1.5 px-2.5 rounded-xl ${isActive ? 'bg-[#eafaf5]' : ''}`}
            onPress={() => onSelectTab?.(item.id)}
          >
            <Text className="text-[18px] mb-1">{item.icon}</Text>
            <Text className={`text-[10px] ${isActive ? 'text-mentaOscura font-bold' : 'text-grisTexto'}`}>
              {item.label}
            </Text>
=======
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => onSelectTab?.(item.id)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.label}</Text>
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

<<<<<<< HEAD
=======
const styles = StyleSheet.create({
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
  navItemActive: { backgroundColor: '#eafaf5' },
  navIcon: { fontSize: 18, marginBottom: 4 },
  navText: { fontSize: 10, color: colors.textMuted },
  navTextActive: { color: colors.brand, fontWeight: '700' },
});
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
