# PetCare

PetCare es un prototipo móvil para consultar y registrar mascotas. El avance integra componentes funcionales de React Native, hooks, consumo de una API pública y persistencia local con AsyncStorage.

## Funcionalidades implementadas

- Acceso de demostración usando un correo electrónico; no existe autenticación real ni se guarda una contraseña.
- Listado, detalle y registro de mascotas.
- Recuperación y persistencia local de la sesión de demostración y de la lista de mascotas.
- Resumen de cantidades de perros y gatos.
- Sección «Descubre perros», que consulta imágenes aleatorias y razas en Dog CEO.
- Estados visibles de carga, error, reintento y respuesta vacía para la consulta de la API.
- Las secciones Agenda, Actividades y Lugares continúan siendo pantallas provisionales.

## Tecnologías

- React Native y Expo SDK 57.
- React 19.
- AsyncStorage para datos locales no sensibles.
- `fetch` y la API pública [Dog CEO](https://dog.ceo/dog-api/).
- JavaScript y estilos con `StyleSheet`.

## Requisitos y ejecución

Se necesita Node.js, npm y Expo Go o un emulador compatible.

```sh
npm ci
npm start
```

En la terminal de Expo, escanea el QR con Expo Go o elige una plataforma. También están disponibles `npm run android`, `npm run ios` y `npm run web`.

La sección de descubrimiento necesita conexión a Internet. La lista de mascotas y la sesión guardadas pueden recuperarse localmente.

## Organización básica

```text
App.js
src/
  components/     Componentes de presentación, tarjetas y descubrimiento
  data/           Datos de ejemplo y elementos de navegación
  hooks/          Hooks para consumo de datos remotos
  screens/        Pantallas de acceso, inicio, perfil y mascotas
  theme/          Colores compartidos
```

`App.js` coordina la carga inicial y el estado compartido. Las pantallas reciben datos y acciones mediante props. La navegación actual se controla con estado local (`view` y `activeTab`); las pestañas Agenda, Actividades y Lugares son provisionales.

## API: Dog CEO

La app solicita `GET https://dog.ceo/api/breeds/image/random/6`. La respuesta esperada tiene este formato:

```json
{
  "message": [
    "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg"
  ],
  "status": "success"
}
```

El hook `src/hooks/useDogImages.js` comprueba el estado HTTP y la forma de la respuesta, limita las imágenes a URLs HTTPS de Dog CEO y expone carga, error, datos y reintento. `src/components/DogDiscoverySection.js` presenta las imágenes y deriva el nombre de raza de la URL. Si la API no está disponible, la app muestra un mensaje y permite reintentar; los datos personales locales no dependen de esta petición.

## Persistencia local

AsyncStorage usa estas claves versionadas:

- `@petcare/session:v1`: nombre derivado del correo y correo de la sesión de demostración.
- `@petcare/pets:v1`: lista serializada de mascotas.

La app recupera y valida los datos al iniciar. Si no hay una lista guardada, muestra los datos de ejemplo. La contraseña no se solicita ni se almacena. AsyncStorage no cifra la información y no debe usarse para credenciales, tokens ni datos sensibles.

## Validación manual y evidencias

1. Inicia la app, ingresa un correo válido y confirma que abre el inicio.
2. Agrega una mascota, revisa que aparezca en la lista y abre su detalle.
3. Cierra y vuelve a abrir la app; verifica que se mantengan la sesión y la mascota.
4. Cierra sesión y confirma que la siguiente apertura solicita el correo otra vez.
5. Con Internet, comprueba la carga de imágenes y los nombres de raza. Sin conexión, comprueba el mensaje de error y el reintento.
6. Captura pantallas reales de esas pruebas y conserva la respuesta observada de la API. No se incluyen capturas, APK ni resultados de pruebas en dispositivo porque todavía deben generarse y verificarse.

La guía de capítulos, requerimientos y evidencias para la memoria está en [docs/GUIA-INFORME-APF2.md](./docs/GUIA-INFORME-APF2.md).

## Alcance y pendientes

El inicio de sesión es únicamente una demostración local; no valida identidad ni ofrece sincronización entre dispositivos. No se han implementado backend, calendario funcional, edición/eliminación de mascotas, GPS, cámara, sensores, notificaciones push ni publicación/APK con EAS Build. Esas funciones requieren decisiones de alcance, permisos, configuración y pruebas adicionales; no deben presentarse como resultados ya obtenidos.
