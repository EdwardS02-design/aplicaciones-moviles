import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatReminderDate,
  parseDogImageResponse,
  parseReminderDate,
  parseStoredPets,
  parseStoredReminders,
  parseStoredUser,
} from '../src/data/petcareValidation.js';

const pet = {
  id: 'pet-1',
  name: 'Nala',
  breed: 'Mestiza',
  age: '2 años',
  weight: '12 kg',
  next: 'Sin cita programada',
  shade: '#f0d1a0',
  emoji: '🐶',
};

test('validates saved user and pet records, including optional device metadata', () => {
  assert.equal(parseStoredUser('{"name":"Ana","email":"ana@example.com"}').name, 'Ana');
  assert.deepEqual(parseStoredPets(JSON.stringify([pet])), [pet]);
  assert.deepEqual(
    parseStoredPets(JSON.stringify([{ ...pet, photoUri: 'file:///pet.jpg', location: { latitude: 1, longitude: 2 } }])),
    [{ ...pet, photoUri: 'file:///pet.jpg', location: { latitude: 1, longitude: 2 } }],
  );
  assert.throws(() => parseStoredUser('{"name":4}'), /formato válido/);
  assert.throws(() => parseStoredPets('[null]'), /formato válido/);
  assert.throws(() => parseStoredPets('[{"id":1}]'), /formato válido/);
});

test('validates saved reminders and rejects malformed records', () => {
  const reminder = {
    id: 'reminder-1',
    petId: 'pet-1',
    title: 'Vacunación',
    date: '2030-05-20T14:00:00.000Z',
    notificationId: 'notification-1',
  };
  assert.deepEqual(parseStoredReminders(JSON.stringify([reminder])), [reminder]);
  assert.throws(() => parseStoredReminders('[{"id":"broken"}]'), /formato válido/);
});

test('validates the public API response and filters untrusted image URLs', () => {
  assert.deepEqual(
    parseDogImageResponse({
      status: 'success',
      message: ['https://images.dog.ceo/breeds/pug/a.jpg', 'http://bad.example/image.jpg', 42],
    }),
    ['https://images.dog.ceo/breeds/pug/a.jpg'],
  );
  assert.throws(() => parseDogImageResponse({ status: 'error', message: [] }), /formato esperado/);
});

test('parses valid future reminder date/time and rejects invalid or past input', () => {
  const now = new Date(2030, 0, 1, 12, 0);
  assert.equal(
    parseReminderDate('2030-02-03', '09:30', now).toISOString(),
    new Date(2030, 1, 3, 9, 30).toISOString(),
  );
  assert.throws(() => parseReminderDate('2030-02-30', '09:30', now), /no existe/);
  assert.throws(() => parseReminderDate('2030-02-03', '25:99', now), /formato/);
  assert.throws(() => parseReminderDate('2030-01-01', '11:00', now), /fecha futura/);
  assert.match(formatReminderDate('2030-02-03T09:30:00.000Z'), /2030/);
});
