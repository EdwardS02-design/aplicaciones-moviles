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
