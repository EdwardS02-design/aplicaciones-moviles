# Petcare

App de cuidado de mascotas (Expo SDK 57 + NativeWind). Los datos de cada persona viven en PostgreSQL (Supabase). Google Maps se consulta desde un servidor, nunca desde el teléfono.

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
- **Configuración**: notificaciones, modo oscuro, idioma y unidades.
