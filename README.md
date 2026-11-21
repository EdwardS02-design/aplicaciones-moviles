<<<<<<< HEAD
# Petcare

App de cuidado de mascotas (Expo SDK 58 + NativeWind). Los datos de cada persona viven en PostgreSQL (Supabase). Google Maps se consulta desde un servidor, nunca desde el teléfono.

## 1. Arrancar la app

```bash
npm install
npx expo start
```

Sin Supabase también puedes **registrarte e iniciar sesión** en el teléfono: cada correo tiene sus propias mascotas.

## 2. Cuentas y mascotas (Supabase)

La tabla `public.usuarios` es la ficha de cada cuenta (nombre, correo). La contraseña vive cifrada en **Authentication** (`auth.users`), no en texto plano.

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. SQL Editor → pega y ejecuta `supabase/schema.sql` (entero).
3. Authentication → Providers → Email: activo. Para pruebas, **desactiva Confirm email**.
4. Copia la URL y la **anon public** key (nunca la `service_role`).
5. En la raíz del proyecto crea `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_URL_API_LUGARES=http://localhost:8787
```

Reinicia Expo. Al registrarte nace una fila en `usuarios`. Al entrar, solo ves las mascotas de ese `dueno_id`.

## 3. Lugares / Google Maps (clave solo en el servidor)

En Google Cloud activa **Places API**. Crea una clave y restíngela por IP del servidor.

```bash
cd servidor
npm install
# Windows PowerShell:
$env:GOOGLE_MAPS_API_KEY="tu_clave"
npm start
```

La app llama a `GET /api/lugares?lat=&lng=&tipo=`. Si no hay clave, el servidor (o la app) muestra lugares de ejemplo en Lima.

Para Render: usa `servidor/render.yaml`. En el dashboard pega `GOOGLE_MAPS_API_KEY`. Luego actualiza `EXPO_PUBLIC_URL_API_LUGARES` con la URL de Render.

## 4. Qué hay en cada pestaña

- **Mascotas**: contador, tarjetas y modal (nombre, perro/gato/conejo, raza, edad, peso, galería o cámara).
- **Agenda**: citas por mes, ligadas a una mascota y una fecha.
- **Actividades**: rutinas (comida, medicación, paseo) y actividades propias.
- **Lugares**: GPS + mapa + lista (parques, veterinarias, peluquerías, tiendas).
- **Configuración**: notificaciones locales, modo oscuro, idioma y unidades.

## 5. Permisos y recordatorios

En Android y iOS, Petcare solicita acceso a la cámara o ubicación cuando se usan esas funciones. Si se deniega el GPS, Lugares muestra resultados de referencia en Lima; la app sigue funcionando. Si cámara o galería quedaron bloqueadas desde el sistema, puedes abrir Ajustes desde el aviso de Petcare.

Los avisos son locales al dispositivo: cuidado diario a las 9:00, cita el día anterior a las 9:00, vacuna 30 días antes y resumen semanal los domingos a las 18:00. Se sincronizan con los interruptores de Configuración y se eliminan al cerrar sesión. Para probarlos, usa una cita con fecha futura y una vacuna programada con al menos 31 días de anticipación. El sistema puede limitar la entrega por ahorro de batería o por sus propios ajustes de notificación.

En Android 12 o superior, la exactitud de los avisos puede depender del acceso del sistema a **Alarmas y recordatorios** para Petcare.

Si ya configuraste Supabase antes de agregar `proxima_vacuna`, vuelve a ejecutar `supabase/schema.sql` en SQL Editor para crear esa columna.

## 6. Verificación manual

1. En un teléfono Android o iOS, activa cada interruptor de notificaciones y acepta el permiso del sistema.
2. Crea una mascota con fecha de próxima vacuna y una cita futura; confirma que las alertas aparecen en la bandeja del sistema en el horario previsto.
3. Desactiva cada interruptor y confirma que su alerta deja de estar programada.
4. Deniega el GPS y confirma que Lugares muestra el aviso de ubicación y resultados de referencia; prueba también cámara y galería con permisos denegados.
5. Introduce fechas imposibles, horas fuera de rango, edades negativas y pesos no positivos; los formularios deben impedir guardarlos.

Para validar que el JavaScript exporta para Android: `npx expo export --platform android`.
=======
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
>>>>>>> 2d4de299d9828589ef17ec856a01c0547f5c70cd
