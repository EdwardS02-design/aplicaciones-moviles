import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { navItems } from '../data/pets';
import { colors } from '../theme/colors';

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = item.id === activeTab;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => onSelectTab?.(item.id)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

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
