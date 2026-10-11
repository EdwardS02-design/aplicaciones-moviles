import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
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
import { getCurrentCoordinates, pickPetPhoto } from '../services/deviceFeatures';

const petTypes = [
  { id: 'dog', label: 'Perro', emoji: '🐶', shade: '#f0d1a0' },
  { id: 'cat', label: 'Gato', emoji: '🐱', shade: '#f1d9c6' },
  { id: 'rabbit', label: 'Conejo', emoji: '🐰', shade: '#d7c7e8' },
];

export default function AddPetScreen({ pet, onBack, onSave, storageError }) {
  const [name, setName] = useState(pet?.name || '');
  const [breed, setBreed] = useState(pet?.breed || '');
  const [age, setAge] = useState(pet?.age === 'No indicada' ? '' : pet?.age || '');
  const [weight, setWeight] = useState(
    pet?.weight === 'No registrado' ? '' : pet?.weight || '',
  );
  const [next, setNext] = useState(
    pet?.next === 'Sin cita programada' ? '' : pet?.next || '',
  );
  const [photoUri, setPhotoUri] = useState(pet?.photoUri || null);
  const [location, setLocation] = useState(pet?.location || null);
  const [type, setType] = useState(
    petTypes.find((petType) => petType.emoji === pet?.emoji) || petTypes[0],
  );
  const [validationError, setValidationError] = useState(null);
  const [deviceAction, setDeviceAction] = useState(null);

  async function handlePhoto(useCamera) {
    setDeviceAction(useCamera ? 'camera' : 'photo');
    setValidationError(null);
    try {
      const uri = await pickPetPhoto(useCamera);
      if (uri) setPhotoUri(uri);
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setDeviceAction(null);
    }
  }

  async function handleCaptureLocation() {
    setDeviceAction('location');
    setValidationError(null);
    try {
      setLocation(await getCurrentCoordinates());
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setDeviceAction(null);
    }
  }

  function handleSave() {
    if (!name.trim() || !breed.trim()) {
      setValidationError('Escribe el nombre y la raza para guardar la mascota.');
      return;
    }

    setValidationError(null);
    onSave({
      id: pet?.id ?? `pet-${Date.now()}`,
      name: name.trim(),
      breed: breed.trim(),
      age: age.trim() || 'No indicada',
      weight: weight.trim() || 'No registrado',
      next: next.trim() || 'Sin cita programada',
      shade: type.shade,
      emoji: type.emoji,
      ...(photoUri ? { photoUri } : {}),
      ...(location ? { location } : {}),
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹ Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{pet ? 'Editar mascota' : 'Agregar mascota'}</Text>
          <Text style={styles.subtitle}>Completa sus datos para guardarlos en este dispositivo.</Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Tipo de mascota</Text>
          <View style={styles.typeRow}>
            {petTypes.map((petType) => {
              const selected = petType.id === type.id;
              return (
                <TouchableOpacity
                  key={petType.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setType(petType)}
                  style={[styles.typeButton, selected && styles.typeButtonSelected]}
                >
                  <Text style={styles.typeEmoji}>{petType.emoji}</Text>
                  <Text style={styles.typeLabel}>{petType.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <FormField label="Nombre *" value={name} onChangeText={setName} placeholder="Ej. Nala" />
          <FormField label="Raza *" value={breed} onChangeText={setBreed} placeholder="Ej. Labrador" />
          <FormField label="Edad" value={age} onChangeText={setAge} placeholder="Ej. 2 años" />
          <FormField label="Peso" value={weight} onChangeText={setWeight} placeholder="Ej. 12 kg" />
          <FormField
            label="Próxima cita"
            value={next}
            onChangeText={setNext}
            placeholder="Ej. 15 nov. Vacunación"
          />

          <Text style={styles.label}>Foto y ubicación (opcionales)</Text>
          <Text style={styles.deviceHint}>
            Solo se solicitan permisos si eliges una función. La ubicación se captura una vez y se guarda únicamente en este dispositivo.
          </Text>
          <View style={styles.deviceActions}>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={Boolean(deviceAction)}
              onPress={() => handlePhoto(true)}
              style={styles.deviceButton}
            >
              <Text style={styles.deviceButtonText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={Boolean(deviceAction)}
              onPress={() => handlePhoto(false)}
              style={styles.deviceButton}
            >
              <Text style={styles.deviceButtonText}>Elegir foto</Text>
            </TouchableOpacity>
          </View>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.photoPreview}
              accessibilityLabel={`Foto de ${name || 'la mascota'}`}
            />
          ) : null}
          <TouchableOpacity
            accessibilityRole="button"
            disabled={Boolean(deviceAction)}
            onPress={handleCaptureLocation}
            style={styles.locationButton}
          >
            {deviceAction === 'location' ? (
              <ActivityIndicator color={colors.brand} />
            ) : (
              <Text style={styles.deviceButtonText}>
                {location ? 'Actualizar ubicación' : 'Guardar ubicación actual'}
              </Text>
            )}
          </TouchableOpacity>
          {location ? (
            <Text style={styles.locationText}>
              Ubicación guardada: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Text>
          ) : null}

          {deviceAction === 'camera' || deviceAction === 'photo' ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.deviceHint}>Abriendo selector de imagen…</Text>
            </View>
          ) : null}
          {validationError ? (
            <Text style={styles.errorMessage} accessibilityRole="alert">
              {validationError}
            </Text>
          ) : null}
          {storageError ? (
            <Text style={styles.errorMessage} accessibilityRole="alert">
              {storageError}
            </Text>
          ) : null}

          <TouchableOpacity
            accessibilityRole="button"
            disabled={Boolean(deviceAction)}
            onPress={handleSave}
            style={[styles.saveButton, Boolean(deviceAction) && styles.disabledButton]}
          >
            <Text style={styles.saveButtonText}>
              {pet ? 'Guardar cambios' : 'Guardar mascota'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({ label, value, onChangeText, placeholder }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#89918d"
        style={styles.input}
        returnKeyType="next"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDashboard },
  keyboardView: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4 },
  backText: { fontSize: 15, fontWeight: '700', color: colors.brand },
  title: { color: colors.textDark, fontSize: 24, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  form: { paddingHorizontal: 20, paddingBottom: 32 },
  label: { color: colors.textDark, fontSize: 13, fontWeight: '700', marginBottom: 7 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderColor: '#e3e9e4',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 13,
  },
  typeButtonSelected: { backgroundColor: '#eafaf5', borderColor: colors.primary },
  typeEmoji: { fontSize: 20 },
  typeLabel: { color: colors.textDark, fontWeight: '700' },
  deviceHint: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  deviceActions: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  deviceButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#eafaf5',
    borderRadius: 12,
    paddingVertical: 12,
  },
  deviceButtonText: { color: colors.brand, fontSize: 13, fontWeight: '700' },
  photoPreview: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    backgroundColor: '#eaf0eb',
    borderRadius: 16,
    marginVertical: 8,
  },
  locationButton: {
    alignItems: 'center',
    backgroundColor: '#eafaf5',
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 12,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  field: { marginBottom: 14 },
  input: {
    backgroundColor: colors.white,
    borderColor: '#e3e9e4',
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textDark,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  errorMessage: { color: '#b23b35', fontSize: 13, lineHeight: 19, marginBottom: 12 },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 15,
    marginTop: 6,
    paddingVertical: 15,
  },
  disabledButton: { opacity: 0.5 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
