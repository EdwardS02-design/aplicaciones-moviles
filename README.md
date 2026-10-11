# PetCare

PetCare es un prototipo móvil para registrar mascotas y sus cuidados. Conserva las funciones locales de demostración de `main` y añade cuentas con datos locales, sincronización opcional con Supabase y pantallas de citas, rutinas y lugares. El contexto académico propone Pet Spaw como organización; verifica con la clínica cualquier dato institucional, proceso o autorización antes de presentarlo como validado.

## Funcionalidades

- Inicio con resumen de mascotas e imágenes de perros obtenidas desde Dog CEO, con carga, error, reintento y estado vacío.
- Alta, edición, detalle y persistencia de mascotas; selección de foto/cámara y captura puntual de ubicación.
- Acceso y registro con contraseña: Supabase cuando está configurado o cuenta local segura en Android/iOS. La cuenta local guarda su contraseña en el almacenamiento seguro del dispositivo.
- Datos de mascotas, citas, actividades y preferencias guardados localmente o sincronizados por cuenta con Supabase.
- Agenda con citas asociadas a una mascota y recordatorios locales del teléfono; cancelar un recordatorio cancela también su notificación pendiente.
- Rutinas de cuidado y lectura del acelerómetro como demostración técnica; no evalúa la salud de una mascota.
- Búsqueda de parques, veterinarias, peluquerías y tiendas mediante un servidor opcional. La clave de Google Maps permanece en el servidor.
- Configuración de notificaciones, preferencias de presentación, idioma y unidades.

Los recordatorios de notificación siguen siendo locales al dispositivo; no se sincronizan como notificaciones remotas. Si Supabase no está configurado, las cuentas locales requieren Android/iOS; en web se debe configurar Supabase para iniciar sesión.

Si este dispositivo tenía datos de la versión anterior, crea una cuenta con el mismo correo que usabas para importarlos. Las mascotas y recordatorios existentes se copian a esa cuenta una vez; los originales se conservan.

## Requisitos y ejecución

Se necesita Node.js y npm.

```sh
npm ci
npm start
```

También están disponibles `npm run android`, `npm run ios`, `npm run web` y `npm test`. Las funciones nativas de cámara, GPS, acelerómetro y notificaciones deben probarse en una compilación móvil compatible.

## Configurar Supabase (opcional)

1. Crea un proyecto Supabase.
2. Ejecuta `supabase/schema.sql` completo en SQL Editor.
3. Habilita Authentication → Email. Para pruebas, desactiva la confirmación de correo o configura su flujo.
4. Crea un `.env` en la raíz con la URL del proyecto y la clave **anon public**:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_URL_API_LUGARES=http://localhost:8787
```

No incluyas la clave `service_role` en la aplicación. Reinicia Expo después de editar `.env`. Las políticas RLS del esquema aíslan los datos por cuenta autenticada.

## Configurar lugares (opcional)

Para consultas reales, activa Places API en Google Cloud, restringe la clave y configúrala solo en el servidor:

```powershell
Set-Location servidor
npm install
$env:GOOGLE_MAPS_API_KEY="tu_clave"
npm start
```

Configura `EXPO_PUBLIC_URL_API_LUGARES` con la URL del servidor. Para Render, revisa `servidor/render.yaml`. Sin servidor configurado, se pueden presentar lugares de ejemplo; no se deben reportar como resultados reales.

## Tecnologías y organización

- React Native, React 19 y Expo SDK 57.
- AsyncStorage para datos locales no sensibles y Expo SecureStore para contraseñas de cuentas locales.
- Supabase Auth/PostgreSQL opcional; Google Maps Places a través del servidor.
- Dog CEO API para descubrimiento de imágenes.
- Expo Image Picker, Location, Notifications, Sensors y File System.
- NativeWind para las pantallas agregadas; `StyleSheet` para las pantallas base.
- EAS Build con perfil interno APK definido en `eas.json`.

Los puntos principales están en `App.js`, `src/estado/CuidadorContext.js`, `src/screens/`, `src/services/deviceFeatures.js` y `servidor/`.

## Pruebas y evidencia

```sh
npm test
npx expo install --check
npx expo export --platform web
```

Las pruebas y la exportación web no reemplazan pruebas físicas de permisos, notificaciones, almacenamiento y APK. Registra las capturas y resultados reales en la [guía del informe APF2](./docs/GUIA-INFORME-APF2.md). No presentes entrevistas, aprobación institucional ni pruebas que aún no se hayan realizado.

Para generar el APK, inicia sesión en Expo y ejecuta:

```sh
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

El perfil prepara una compilación interna; no significa que el APK ya esté generado o validado.
