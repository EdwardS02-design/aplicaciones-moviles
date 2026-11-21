import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function pickPetPhoto(useCamera) {
  if (Platform.OS === 'web' && useCamera) {
    throw new Error('La cámara se puede usar desde la aplicación móvil.');
  }

  const permission = useCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error(
      useCamera
        ? 'Necesitas permitir el acceso a la cámara para tomar una foto.'
        : 'Necesitas permitir el acceso a tus fotos para elegir una imagen.',
    );
  }

  const result = useCamera
    ? await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.75,
      })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.75,
      });

  if (result.canceled) return null;

  const asset = result.assets[0];
  if (!asset?.uri) {
    throw new Error('No se recibió una imagen válida desde el dispositivo.');
  }
  if (!FileSystem.documentDirectory) {
    throw new Error('No se encontró el almacenamiento privado de la aplicación.');
  }

  const extension =
    asset.mimeType?.split('/')[1]?.replace(/[^a-z0-9]/gi, '') || 'jpg';
  const destination = `${FileSystem.documentDirectory}petcare-${Date.now()}.${extension}`;
  await FileSystem.copyAsync({ from: asset.uri, to: destination });
  return destination;
}

export async function getCurrentCoordinates() {
  if (Platform.OS === 'web') {
    throw new Error('La ubicación GPS está disponible en la aplicación móvil.');
  }

  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permite el acceso a la ubicación mientras usas PetCare.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export async function schedulePetReminder({ pet, title, date, reminderId }) {
  if (Platform.OS === 'web') {
    throw new Error('Los recordatorios locales están disponibles en Android y iOS.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('petcare-reminders', {
      name: 'Recordatorios de mascotas',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2d8c7d',
    });
  }

  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permite las notificaciones para programar este recordatorio.');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `PetCare: ${title}`,
      body: `Recordatorio para ${pet.name}.`,
      data: { reminderId, petId: pet.id },
      ...(Platform.OS === 'android' ? { channelId: 'petcare-reminders' } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      ...(Platform.OS === 'android' ? { channelId: 'petcare-reminders' } : {}),
    },
  });
}

export function cancelPetReminder(notificationId) {
  return Notifications.cancelScheduledNotificationAsync(notificationId);
}
