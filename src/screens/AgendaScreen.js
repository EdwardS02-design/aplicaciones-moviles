import React, { useMemo, useState } from 'react';
<<<<<<< HEAD
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCuidador } from '../estado/CuidadorContext';
import { tiposCita } from '../constantes/catalogo';
import ModalNuevaCita from '../components/ModalNuevaCita';

const mesesCortos = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function claveMes(fecha = new Date()) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

function moverMes(fecha, cambio) {
  const [anio, mes] = fecha.split('-').map(Number);
  return claveMes(new Date(anio, mes - 1 + cambio, 1));
}

export default function AgendaScreen() {
  const { citas, mascotas, agregarCita } = useCuidador();
  const [mesActivo, setMesActivo] = useState(() => claveMes());
  const [modalAbierto, setModalAbierto] = useState(false);

  const mesesChip = [-1, 0, 1].map((cambio) => {
    const fecha = moverMes(mesActivo, cambio);
    const [anio, mes] = fecha.split('-').map(Number);
    return { fecha, etiqueta: `${mesesCortos[mes - 1]} ${anio}` };
  });

  const citasDelMes = useMemo(
    () =>
      citas
        .filter((c) => c.fecha.startsWith(mesActivo))
        .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)),
    [citas, mesActivo]
  );

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      <StatusBar style="dark" />
      <View className="flex-row justify-between items-center px-5 pt-2 pb-2">
        <View>
          <Text className="text-[13px] text-grisTexto">Próximas citas</Text>
          <Text className="text-[26px] font-extrabold text-tinta">Agenda</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalAbierto(true)}
          className="w-11 h-11 rounded-full bg-menta items-center justify-center"
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center px-5 mb-4">
        <TouchableOpacity
          onPress={() => setMesActivo((actual) => moverMes(actual, -1))}
          accessibilityLabel="Mes anterior"
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={18} color="#2b7a6d" />
        </TouchableOpacity>
        <View className="flex-1 flex-row justify-center">
          {mesesChip.map((m) => {
            const activo = m.fecha === mesActivo;
            return (
            <TouchableOpacity
              key={m.fecha}
              onPress={() => setMesActivo(m.fecha)}
              className={`px-3 py-2 rounded-full mx-1 ${activo ? 'bg-menta' : 'bg-white'}`}
            >
              <Text className={activo ? 'text-white font-bold' : 'text-grisTexto'}>{m.etiqueta}</Text>
            </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => setMesActivo((actual) => moverMes(actual, 1))}
          accessibilityLabel="Mes siguiente"
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-forward" size={18} color="#2b7a6d" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 28 }}>
        {citasDelMes.length === 0 ? (
          <Text className="text-grisTexto mt-8 text-center">Este mes todavía no hay nada anotado.</Text>
        ) : (
          citasDelMes.map((cita) => {
            const mascota = mascotas.find((m) => m.id === cita.mascotaId);
            const tipo = tiposCita.find((t) => t.id === cita.tipo);
            const dia = Number(cita.fecha.slice(8, 10));
            const mes = mesesCortos[Number(cita.fecha.slice(5, 7)) - 1];
            return (
              <View key={cita.id} className="flex-row mb-3">
                <View className="w-12 items-center mr-2 pt-2">
                  <Text className="text-xl font-extrabold text-tinta">{dia}</Text>
                  <Text className="text-[11px] text-grisTexto">{mes}</Text>
                </View>
                <View className="flex-1 bg-white rounded-[20px] p-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                      <Text className="text-xs mr-1">{tipo?.icono || '📌'}</Text>
                      <Text style={{ color: tipo?.color || '#5ebfae' }} className="font-semibold text-[12px]">
                        {tipo?.etiqueta || cita.tipo}
                      </Text>
                    </View>
                    <Text className="text-grisTexto text-[12px]">{cita.hora}</Text>
                  </View>
                  <Text className="text-[15px] font-bold text-tinta">{cita.titulo}</Text>
                  {cita.lugar ? <Text className="text-[12px] text-grisTexto mt-0.5">{cita.lugar}</Text> : null}
                  <View className="flex-row items-center mt-2">
                    <View
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: mascota?.colorFicha || '#5ebfae' }}
                    />
                    <Text className="text-[12px] text-tinta mr-auto">{mascota?.nombre}</Text>
                    {mascota?.fotoUrl ? (
                      <Image source={{ uri: mascota.fotoUrl }} className="w-8 h-8 rounded-full" />
                    ) : null}
                  </View>
                </View>
=======
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { formatReminderDate, parseReminderDate } from '../data/petcareValidation';
import { schedulePetReminder } from '../services/deviceFeatures';

function getDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, '0'),
    String(tomorrow.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function AgendaScreen({
  pets,
  reminders,
  storageError,
  onBack,
  onAddReminder,
  onRemoveReminder,
}) {
  const [selectedPetId, setSelectedPetId] = useState(
    pets.length > 0 ? String(pets[0].id) : '',
  );
  const [title, setTitle] = useState('');
  const [dateValue, setDateValue] = useState(getDefaultDate);
  const [timeValue, setTimeValue] = useState('09:00');
  const [error, setError] = useState(null);
  const [busyReminderId, setBusyReminderId] = useState(null);
  const selectedPet = useMemo(
    () => pets.find((pet) => String(pet.id) === selectedPetId),
    [pets, selectedPetId],
  );

  async function handleAddReminder() {
    if (!selectedPet) {
      setError('Registra una mascota antes de crear un recordatorio.');
      return;
    }
    if (!title.trim()) {
      setError('Escribe el motivo del recordatorio.');
      return;
    }

    setError(null);
    setBusyReminderId('new');
    try {
      const date = parseReminderDate(dateValue, timeValue);
      const id = `reminder-${Date.now()}`;
      const notificationId = await schedulePetReminder({
        pet: selectedPet,
        title: title.trim(),
        date,
        reminderId: id,
      });
      onAddReminder({
        id,
        petId: String(selectedPet.id),
        title: title.trim(),
        date: date.toISOString(),
        notificationId,
      });
      setTitle('');
    } catch (scheduleError) {
      console.error('No se pudo programar el recordatorio de PetCare.', scheduleError);
      setError(scheduleError.message || 'No se pudo programar el recordatorio.');
    } finally {
      setBusyReminderId(null);
    }
  }

  async function handleRemoveReminder(reminder) {
    setError(null);
    setBusyReminderId(reminder.id);
    try {
      await onRemoveReminder(reminder);
    } catch (removeError) {
      console.error('No se pudo cancelar el recordatorio de PetCare.', removeError);
      setError('No se pudo cancelar el aviso programado. Inténtalo de nuevo.');
    } finally {
      setBusyReminderId(null);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Agenda de cuidados</Text>
        <Text style={styles.subtitle}>
          Programa avisos locales para vacunas, controles y otros cuidados.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {Platform.OS === 'web' ? (
          <Text style={styles.infoMessage}>
            Las notificaciones programadas se habilitan en la aplicación móvil Android/iOS.
          </Text>
        ) : null}

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Nuevo recordatorio</Text>
          <Text style={styles.label}>Mascota</Text>
          {pets.length === 0 ? (
            <Text style={styles.infoMessage}>Agrega una mascota antes de crear un aviso.</Text>
          ) : (
            <View style={styles.petChoices}>
              {pets.map((pet) => {
                const isSelected = String(pet.id) === selectedPetId;
                return (
                  <TouchableOpacity
                    key={pet.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedPetId(String(pet.id))}
                    style={[styles.petChoice, isSelected && styles.petChoiceSelected]}
                  >
                    <Text style={styles.petChoiceText}>{pet.emoji} {pet.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <Text style={styles.label}>Motivo</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            maxLength={80}
            placeholder="Ej. Vacuna antirrábica"
            placeholderTextColor="#89918d"
            style={styles.input}
          />

          <View style={styles.dateTimeRow}>
            <View style={styles.dateField}>
              <Text style={styles.label}>Fecha (AAAA-MM-DD)</Text>
              <TextInput
                value={dateValue}
                onChangeText={setDateValue}
                placeholder="2030-06-15"
                keyboardType="numbers-and-punctuation"
                style={styles.input}
              />
            </View>
            <View style={styles.timeField}>
              <Text style={styles.label}>Hora (24 h)</Text>
              <TextInput
                value={timeValue}
                onChangeText={setTimeValue}
                placeholder="09:00"
                keyboardType="numbers-and-punctuation"
                style={styles.input}
              />
            </View>
          </View>

          <Text style={styles.infoMessage}>
            El teléfono solicitará permiso antes de programar la notificación. El aviso se guarda localmente y no requiere conexión.
          </Text>
          {error ? (
            <Text style={styles.errorMessage} accessibilityRole="alert">{error}</Text>
          ) : null}
          {storageError ? (
            <Text style={styles.errorMessage} accessibilityRole="alert">{storageError}</Text>
          ) : null}

          <TouchableOpacity
            accessibilityRole="button"
            disabled={Boolean(busyReminderId) || Platform.OS === 'web'}
            onPress={handleAddReminder}
            style={[
              styles.primaryButton,
              (Boolean(busyReminderId) || Platform.OS === 'web') && styles.disabledButton,
            ]}
          >
            {busyReminderId === 'new' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Programar aviso</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Próximos recordatorios</Text>
        {reminders.length === 0 ? (
          <Text style={styles.emptyMessage}>Todavía no has programado avisos.</Text>
        ) : (
          reminders.map((reminder) => {
            const pet = pets.find((item) => String(item.id) === reminder.petId);
            const busy = busyReminderId === reminder.id;
            return (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  <Text style={styles.reminderMeta}>
                    {pet?.name || 'Mascota'} · {formatReminderDate(reminder.date)}
                  </Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Cancelar recordatorio ${reminder.title}`}
                  disabled={Boolean(busyReminderId)}
                  onPress={() => handleRemoveReminder(reminder)}
                  style={styles.removeButton}
                >
                  {busy ? (
                    <ActivityIndicator color="#b23b35" />
                  ) : (
                    <Text style={styles.removeText}>Cancelar</Text>
                  )}
                </TouchableOpacity>
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
              </View>
            );
          })
        )}
      </ScrollView>
<<<<<<< HEAD

      <ModalNuevaCita
        visible={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onGuardar={agregarCita}
        mascotas={mascotas}
      />
    </SafeAreaView>
  );
}
=======
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDashboard },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4 },
  backText: { color: colors.brand, fontSize: 15, fontWeight: '700' },
  title: { color: colors.textDark, fontSize: 23, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  content: { paddingHorizontal: 18, paddingBottom: 30 },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginBottom: 20,
    padding: 16,
  },
  sectionTitle: { color: colors.textDark, fontSize: 17, fontWeight: '800', marginBottom: 12 },
  label: { color: colors.textDark, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  petChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  petChoice: {
    backgroundColor: '#f3f7f3',
    borderColor: '#e3e9e4',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  petChoiceSelected: { backgroundColor: '#eafaf5', borderColor: colors.primary },
  petChoiceText: { color: colors.textDark, fontSize: 12, fontWeight: '700' },
  input: {
    backgroundColor: '#fbfcfb',
    borderColor: '#e3e9e4',
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textDark,
    fontSize: 14,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateTimeRow: { flexDirection: 'row', gap: 10 },
  dateField: { flex: 1.3 },
  timeField: { flex: 0.7 },
  infoMessage: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  errorMessage: { color: '#b23b35', fontSize: 13, lineHeight: 19, marginBottom: 12 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 13,
    marginTop: 4,
    paddingVertical: 14,
  },
  disabledButton: { opacity: 0.5 },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  emptyMessage: {
    backgroundColor: colors.white,
    borderRadius: 16,
    color: colors.textMuted,
    fontSize: 13,
    padding: 18,
    textAlign: 'center',
  },
  reminderCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 14,
  },
  reminderInfo: { flex: 1, paddingRight: 8 },
  reminderTitle: { color: colors.textDark, fontSize: 14, fontWeight: '700' },
  reminderMeta: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  removeButton: { paddingHorizontal: 8, paddingVertical: 8 },
  removeText: { color: '#b23b35', fontSize: 12, fontWeight: '700' },
});
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
