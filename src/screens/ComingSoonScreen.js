import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import BottomNav from '../components/BottomNav';

// Pantalla temporal para las pestañas que aún no tienen su propia vista
// (Agenda, Actividades, Lugares). Antes al tocarlas no pasaba nada;
// ahora al menos cambian de pestaña y muestran este aviso.
export default function ComingSoonScreen({ label, icon, activeTab, onSelectTab }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.phoneFrame}>
        <View style={styles.content}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{label}</Text>
          <Text style={styles.subtitle}>Esta sección todavía no está lista. ¡Pronto!</Text>
        </View>
        <BottomNav activeTab={activeTab} onSelectTab={onSelectTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDashboard, justifyContent: 'center', alignItems: 'center' },
  phoneFrame: {
    width: 390, maxWidth: '92%', height: '92%', backgroundColor: '#f3f5f3', borderRadius: 36,
    overflow: 'hidden', borderWidth: 1, borderColor: '#dfe6de',
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textDark, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
