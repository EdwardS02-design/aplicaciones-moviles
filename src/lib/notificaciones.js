import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const canal = 'recordatorios';
const limiteAvisos = 50;
let colaSincronizacion = Promise.resolve();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function prepararCanal() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(canal, {
      name: 'Recordatorios de cuidado',
      description: 'Avisos de citas, vacunas y cuidados de tus mascotas.',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 150, 250],
      lightColor: '#2b7a6d',
    });
  }
}

function permisoConcedido(permiso) {
  return (
    permiso.granted ||
    permiso.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function solicitarPermisoNotificaciones() {
  if (Platform.OS === 'web') return false;

  await prepararCanal();
  const actual = await Notifications.getPermissionsAsync();
  if (permisoConcedido(actual)) return true;
  if (!actual.canAskAgain) return false;

  const solicitado = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
  return permisoConcedido(solicitado);
}

export async function consultarPermisoNotificaciones() {
  if (Platform.OS === 'web') return false;
  try {
    return permisoConcedido(await Notifications.getPermissionsAsync());
  } catch (error) {
    console.warn('No se pudo consultar el permiso de notificaciones.', error.message);
    return false;
  }
}

function fechaLocal(fecha, hora = '09:00') {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha || '');
  const partesHora = /^(\d{2}):(\d{2})$/.exec(hora || '');
  if (!coincidencia || !partesHora) return null;

  const [, anio, mes, dia] = coincidencia.map(Number);
  const [, horas, minutos] = partesHora.map(Number);
  if (horas > 23 || minutos > 59) return null;

  const fechaResultado = new Date(anio, mes - 1, dia, horas, minutos, 0, 0);
  if (
    fechaResultado.getFullYear() !== anio ||
    fechaResultado.getMonth() !== mes - 1 ||
    fechaResultado.getDate() !== dia
  ) {
    return null;
  }
  return fechaResultado;
}

function restarDias(fecha, dias) {
  const resultado = new Date(fecha);
  resultado.setDate(resultado.getDate() - dias);
  resultado.setHours(9, 0, 0, 0);
  return resultado;
}

function fechaLegible(fecha) {
  return fecha.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
  });
}

function crearAvisos({ citas, mascotas, preferencias }) {
  const ahora = Date.now();
  const avisos = [];

  if (preferencias.recordatorios) {
    avisos.push({
      content: {
        title: 'Un momento para sus cuidados',
        body: 'Registra la comida, medicación o paseo de hoy.',
        data: { tipo: 'cuidado-diario' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
        channelId: canal,
      },
      orden: ahora + 24 * 60 * 60 * 1000,
    });
  }

  if (preferencias.resumenSemanal) {
    avisos.push({
      content: {
        title: 'Resumen semanal de cuidados',
        body: 'Revisa las actividades y citas registradas esta semana.',
        data: { tipo: 'resumen-semanal' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1,
        hour: 18,
        minute: 0,
        channelId: canal,
      },
      orden: ahora + 7 * 24 * 60 * 60 * 1000,
    });
  }

  if (preferencias.avisosCitas) {
    const mascotasPorId = new Map(mascotas.map((mascota) => [mascota.id, mascota]));
    citas.forEach((cita) => {
      const citaFecha = fechaLocal(cita.fecha, cita.hora || '09:00');
      if (!citaFecha) return;
      const avisoFecha = restarDias(citaFecha, 1);
      if (avisoFecha.getTime() <= ahora) return;

      const mascota = mascotasPorId.get(cita.mascotaId);
      avisos.push({
        content: {
          title: `Mañana: ${cita.titulo}`,
          body: `${mascota?.nombre || 'Tu mascota'} tiene una cita el ${fechaLegible(citaFecha)}.`,
          data: { tipo: 'cita', citaId: cita.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: avisoFecha,
          channelId: canal,
        },
        orden: avisoFecha.getTime(),
      });
    });
  }

  if (preferencias.alertaVacunas) {
    mascotas.forEach((mascota) => {
      if (!mascota.proximaVacuna) return;
      const vacunaFecha = fechaLocal(mascota.proximaVacuna);
      if (!vacunaFecha) return;
      const avisoFecha = restarDias(vacunaFecha, 30);
      if (avisoFecha.getTime() <= ahora) return;

      avisos.push({
        content: {
          title: `Vacuna próxima: ${mascota.nombre}`,
          body: `La próxima vacuna está registrada para el ${fechaLegible(vacunaFecha)}.`,
          data: { tipo: 'vacuna', mascotaId: mascota.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: avisoFecha,
          channelId: canal,
        },
        orden: avisoFecha.getTime(),
      });
    });
  }

  return avisos.sort((a, b) => a.orden - b.orden).slice(0, limiteAvisos);
}

export function sincronizarNotificaciones({ activa, citas, mascotas, preferencias }) {
  colaSincronizacion = colaSincronizacion
    .catch(() => {})
    .then(async () => {
      if (Platform.OS === 'web') return;
      if (!activa) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        return;
      }

      await prepararCanal();
      await Notifications.cancelAllScheduledNotificationsAsync();
      const permiso = await Notifications.getPermissionsAsync();
      if (!permisoConcedido(permiso)) return;

      const avisos = crearAvisos({ citas, mascotas, preferencias });
      await Promise.all(
        avisos.map(({ content, trigger }) =>
          Notifications.scheduleNotificationAsync({ content, trigger })
        )
      );
    })
    .catch((error) => {
      console.warn('No se pudieron sincronizar los recordatorios.', error.message);
    });

  return colaSincronizacion;
}