import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Accelerometer } from 'expo-sensors';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

const EMPTY_READING = { x: 0, y: 0, z: 0 };

export default function ActivitiesScreen({ onBack }) {
  const [reading, setReading] = useState(EMPTY_READING);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;

    let isCurrent = true;
    let subscription;

    async function subscribeToAccelerometer() {
      try {
        const available = await Accelerometer.isAvailableAsync();
        if (!isCurrent) return;
        setIsAvailable(available);

        if (available) {
          Accelerometer.setUpdateInterval(250);
          subscription = Accelerometer.addListener(setReading);
        }
      } catch (error) {
        console.error('No se pudo iniciar la lectura del acelerómetro.', error);
        if (isCurrent) setIsAvailable(false);
      }
    }

    subscribeToAccelerometer();
    return () => {
      isCurrent = false;
      subscription?.remove();
    };
  }, []);

  const magnitude = Math.sqrt(
    reading.x ** 2 + reading.y ** 2 + reading.z ** 2,
  );
  const activity = Math.abs(magnitude - 1) > 0.15 ? 'En movimiento' : 'En reposo';

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Actividad del dispositivo</Text>
        <Text style={styles.subtitle}>
          Sensor de movimiento del dispositivo (acelerómetro).
        </Text>
      </View>

      <View style={styles.content}>
        {Platform.OS === 'web' ? (
          <View style={styles.card}>
            <Text style={styles.statusTitle}>Disponible en la aplicación móvil</Text>
            <Text style={styles.description}>
              El navegador no proporciona un acelerómetro en este prototipo. Abre PetCare en un dispositivo compatible para medir movimiento.
            </Text>
          </View>
        ) : isAvailable === null ? (
          <View style={styles.card}>
            <Text style={styles.description}>Comprobando el sensor…</Text>
          </View>
        ) : !isAvailable ? (
          <View style={styles.card}>
            <Text style={styles.statusTitle}>Sensor no disponible</Text>
            <Text style={styles.description}>
              Este dispositivo o emulador no informa un acelerómetro compatible.
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.statusTitle}>{activity}</Text>
            <View style={styles.readingRow}>
              <ReadingAxis label="X" value={reading.x} />
              <ReadingAxis label="Y" value={reading.y} />
              <ReadingAxis label="Z" value={reading.z} />
            </View>
            <Text style={styles.description}>
              Lectura normalizada de aceleración; no almacena datos ni se envía a ningún servidor.
            </Text>
          </View>
        )}
        <Text style={styles.note}>
          Este indicador es una demostración técnica del sensor y no evalúa la salud ni la actividad de una mascota.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function ReadingAxis({ label, value }) {
  return (
    <View style={styles.axis}>
      <Text style={styles.axisLabel}>{label}</Text>
      <Text style={styles.axisValue}>{value.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDashboard },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  backButton: { alignSelf: 'flex-start', paddingHorizontal: 4, paddingVertical: 8 },
  backText: { color: colors.brand, fontSize: 15, fontWeight: '700' },
  title: { color: colors.textDark, fontSize: 23, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 22 },
  statusTitle: {
    color: colors.textDark,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  readingRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 18 },
  axis: { alignItems: 'center', backgroundColor: '#eafaf5', borderRadius: 14, minWidth: 72, padding: 12 },
  axisLabel: { color: colors.brand, fontSize: 12, fontWeight: '700' },
  axisValue: { color: colors.textDark, fontSize: 17, fontWeight: '800', marginTop: 6 },
  description: { color: colors.textMuted, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  note: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 16, textAlign: 'center' },
});
