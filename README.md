# PetCare

PetCare es un prototipo móvil para registrar cuidados de mascotas. Integra componentes funcionales de React Native, hooks, consumo de una API pública, persistencia local y funciones nativas opcionales. El contexto académico parte de la veterinaria Pet Spaw, identificada por el equipo mediante [su ficha compartida de Google Maps](https://maps.app.goo.gl/pdjydh5rFumceGi19); confirmar con la clínica su ubicación administrativa, necesidades y autorización para usarla en el informe antes de atribuirle datos institucionales.

## Funcionalidades implementadas

- Acceso de demostración por correo; no existe autenticación real ni se guarda una contraseña.
- Listado, detalle, alta y edición local de mascotas.
- Resumen de cantidades de perros y gatos.
- Persistencia de sesión, mascotas, recordatorios y metadatos opcionales de foto/ubicación con AsyncStorage.
- Sección «Descubre perros», conectada a Dog CEO y con estados de carga, error, reintento y respuesta vacía.
- Agenda de cuidados para crear, persistir y cancelar notificaciones locales programadas.
- Captura puntual de ubicación GPS en primer plano, con apertura de coordenadas en un mapa externo.
- Captura o selección de foto; se copia al almacenamiento privado de la aplicación.
- Lectura del acelerómetro en Actividades; la suscripción se libera al salir de la pantalla.
- Lugares sigue siendo una pantalla provisional; no afirma ni consulta veterinarias cercanas.

## Tecnologías

- React Native, React 19 y Expo SDK 57.
- AsyncStorage para datos locales no sensibles.
- `fetch` y la API pública [Dog CEO](https://dog.ceo/dog-api/).
- `expo-image-picker`, `expo-location`, `expo-notifications`, `expo-sensors` y `expo-file-system`.
- EAS Build, con perfil interno para APK Android.
- JavaScript y estilos con `StyleSheet`.

## Requisitos y ejecución

Se necesita Node.js, npm y Expo Go o un emulador compatible.

```sh
npm ci
npm start
```

En la terminal de Expo, escanea el QR con Expo Go o elige una plataforma. También están disponibles `npm run android`, `npm run ios` y `npm run web`.

La sección de descubrimiento necesita Internet. Las funciones nativas de cámara, GPS, acelerómetro y notificaciones se deben validar en una compilación móvil; algunas no están disponibles en navegador ni necesariamente en Expo Go para todos los módulos del SDK.

## Organización básica

```text
App.js
src/
  components/     Componentes de presentación, tarjetas y descubrimiento
  data/           Datos iniciales y validaciones
  hooks/          Hooks para consumo de datos remotos
  screens/        Acceso, inicio, agenda, actividades, perfil y mascotas
  services/       Cámara, ubicación y notificaciones locales
  theme/          Colores compartidos
tests/              Pruebas de validación y reglas de dominio
docs/               Guía de memoria APF2
```

`App.js` coordina carga, estado compartido, persistencia y selección de pantallas. La navegación actual usa estado (`view` y `activeTab`); todavía no usa Stack/Tabs/Drawer de React Navigation.

## API: Dog CEO

La app solicita `GET https://dog.ceo/api/breeds/image/random/6`. La respuesta esperada es:

```json
{
  "message": [
    "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg"
  ],
  "status": "success"
}
```

`src/hooks/useDogImages.js` comprueba HTTP, valida el cuerpo mediante `src/data/petcareValidation.js` y limita las imágenes a URLs HTTPS de Dog CEO. `src/components/DogDiscoverySection.js` muestra las imágenes y deriva el nombre de raza de la URL. Si la API no está disponible, informa el error y ofrece reintentar. Este endpoint sirve para descubrimiento de razas; no es un backend ni sincroniza los perfiles de las mascotas.

## Persistencia y privacidad

AsyncStorage usa las claves versionadas:

- `@petcare/session:v1`: nombre derivado del correo y correo de la sesión de demostración.
- `@petcare/pets:v1`: mascotas, URI de la foto copiada al directorio privado y coordenadas guardadas a solicitud.
- `@petcare/reminders:v1`: recordatorios y el identificador de su notificación local.

La aplicación recupera y valida los datos al iniciar; si todavía no hay una lista de mascotas guardada, muestra datos de ejemplo. AsyncStorage no cifra la información: no almacenar contraseñas, tokens ni datos sensibles. La ubicación es de una sola captura con permiso en primer plano, no se rastrea ni se envía a un servidor.

La cámara, fotos, ubicación y notificaciones solicitan permiso en el momento de usar cada función. La agenda programa avisos en el dispositivo y no proporciona notificaciones push remotas. El acelerómetro muestra datos técnicos y no determina la actividad ni el estado de salud de una mascota.

No se solicita permiso de micrófono ni almacenamiento externo; los permisos heredados que no requiere este flujo se bloquean en el manifiesto nativo.

## Pruebas y validación

```sh
npm test
npx expo install --check
npx expo export --platform web
```

Las pruebas automatizadas cubren formatos de sesión, mascotas y agenda, filtrado de la respuesta de la API y fechas futuras. La exportación web verifica el empaquetado JS, pero no sustituye una build ni las pruebas nativas.

Pruebas manuales pendientes de documentar con dispositivo, fecha y evidencia:

1. Acceso válido/inválido y navegación de regreso.
2. Alta, edición, detalle y persistencia de mascotas tras reiniciar.
3. Respuesta de Dog CEO en éxito, carga, error/reintento y lista vacía.
4. Permiso concedido y denegado en cámara/fotos/ubicación.
5. Captura GPS, coordenadas guardadas y apertura del mapa externo.
6. Recordatorio futuro recibido y cancelación del aviso pendiente.
7. Lectura del acelerómetro y liberación de la suscripción al abandonar la pantalla.
8. Instalación del APK en un dispositivo y evidencia de almacenamiento local.

No se deben reportar estos pasos como resultados observados hasta ejecutarlos y conservar capturas/registros reales.

## Perfil APK con EAS Build

`eas.json` define el perfil Android `preview` con distribución interna y salida APK. El identificador provisional es `com.petcare.aplicacionesmoviles`: confirmar su disponibilidad y acordar el identificador final antes de publicar.

Para generar el APK se necesita una cuenta de Expo del equipo y vincular el proyecto:

```sh
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform android --profile preview
```

La configuración no significa que el APK ya se haya generado. Después del build, descargarlo, probarlo en un teléfono y añadir a la memoria el enlace Expo.dev y evidencias reales.

## Alcance y pendientes

La autenticación es una demostración local; no valida identidad ni sincroniza dispositivos. No hay backend ni agenda de citas sincronizada; Agenda usa notificaciones locales. Lugares es provisional y todavía no integra una API de veterinarias. El informe necesita misión, visión, historia, organigrama, recursos y cronograma validados directamente con Pet Spaw. No existe aún un APK EAS ni evidencia de prueba física.

La guía de memoria está en [docs/GUIA-INFORME-APF2.md](./docs/GUIA-INFORME-APF2.md).
