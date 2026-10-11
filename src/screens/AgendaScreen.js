import React, { useMemo, useState } from 'react';
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
import { useCuidador } from '../estado/CuidadorContext';
import ModalNuevaCita from '../components/ModalNuevaCita';

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
  const { citas, mascotas, agregarCita } = useCuidador();
  const [selectedPetId, setSelectedPetId] = useState(
    pets.length > 0 ? String(pets[0].id) : '',
  );
  const [citaModalAbierto, setCitaModalAbierto] = useState(false);
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
        {mascotas.length > 0 ? (
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.citasButton}
            onPress={() => setCitaModalAbierto(true)}
          >
            <Text style={styles.citasButtonText}>＋ Agregar cita</Text>
          </TouchableOpacity>
        ) : null}
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
              </View>
            );
          })
        )}
        <View style={styles.citasSection}>
          <Text style={styles.sectionTitle}>Citas agendadas</Text>
          {citas.length === 0 ? (
            <Text style={styles.emptyMessage}>Todavía no has agregado citas.</Text>
          ) : (
            citas.map((cita) => {
              const mascota = mascotas.find((item) => item.id === cita.mascotaId);
              return (
                <View key={cita.id} style={styles.reminderCard}>
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderTitle}>{cita.titulo}</Text>
                    <Text style={styles.reminderMeta}>
                      {mascota?.nombre || 'Mascota'} · {cita.fecha} · {cita.hora}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
      <ModalNuevaCita
        visible={citaModalAbierto}
        onCerrar={() => setCitaModalAbierto(false)}
        onGuardar={async (cita) => {
          await agregarCita(cita);
          setCitaModalAbierto(false);
        }}
        mascotas={mascotas}
      />
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
  citasButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#eafaf5',
  },
  citasButtonText: { color: colors.primaryDark, fontSize: 13, fontWeight: '700' },
  citasSection: { marginTop: 20 },
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
