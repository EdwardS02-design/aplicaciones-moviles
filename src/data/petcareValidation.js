const requiredPetFields = ['name', 'breed', 'age', 'weight', 'next', 'shade', 'emoji'];

export function parseStoredUser(value) {
  const user = JSON.parse(value);
  if (!user || typeof user.name !== 'string' || typeof user.email !== 'string') {
    throw new Error('El perfil guardado no tiene un formato válido.');
  }
  return user;
}

export function parseStoredPets(value) {
  const pets = JSON.parse(value);
  const isValidPet = (pet) =>
    pet &&
    (typeof pet.id === 'string' || typeof pet.id === 'number') &&
    requiredPetFields.every((field) => typeof pet[field] === 'string') &&
    (pet.photoUri === undefined || typeof pet.photoUri === 'string') &&
    (pet.location === undefined ||
      (Number.isFinite(pet.location?.latitude) &&
        Number.isFinite(pet.location?.longitude)));

  if (!Array.isArray(pets) || !pets.every(isValidPet)) {
    throw new Error('La lista de mascotas guardada no tiene un formato válido.');
  }
  return pets;
}

export function parseStoredReminders(value) {
  const reminders = JSON.parse(value);
  const isValidReminder = (reminder) =>
    reminder &&
    typeof reminder.id === 'string' &&
    typeof reminder.petId === 'string' &&
    typeof reminder.title === 'string' &&
    typeof reminder.date === 'string' &&
    Number.isFinite(Date.parse(reminder.date)) &&
    (reminder.notificationId === null ||
      typeof reminder.notificationId === 'string');

  if (!Array.isArray(reminders) || !reminders.every(isValidReminder)) {
    throw new Error('La agenda guardada no tiene un formato válido.');
  }
  return reminders;
}

export function parseDogImageResponse(payload) {
  if (
    !payload ||
    payload.status !== 'success' ||
    !Array.isArray(payload.message)
  ) {
    throw new Error('La respuesta de Dog CEO no tiene el formato esperado.');
  }

  return payload.message.filter(
    (url) =>
      typeof url === 'string' &&
      url.startsWith('https://images.dog.ceo/'),
  );
}

export function parseReminderDate(dateValue, timeValue, now = new Date()) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue.trim());
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeValue.trim());

  if (!dateMatch || !timeMatch) {
    throw new Error('Usa el formato de fecha AAAA-MM-DD y hora HH:MM.');
  }

  const [, year, month, day] = dateMatch;
  const [, hours, minutes] = timeMatch;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    0,
    0,
  );

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    throw new Error('La fecha indicada no existe.');
  }
  if (date.getTime() <= now.getTime()) {
    throw new Error('El recordatorio debe programarse para una fecha futura.');
  }

  return date;
}

export function formatReminderDate(value) {
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
