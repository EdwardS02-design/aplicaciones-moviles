# Guía para la memoria del proyecto PetCare (2026)

Esta guía organiza el índice solicitado y separa lo comprobable en el código de la información que el equipo debe completar. Sustituye los textos entre corchetes con datos verificados; no presentes como evidencia capturas, entrevistas, pruebas, sensores o APK que no se hayan realizado.

## Introducción

Presentar el propósito de PetCare, el contexto de la experiencia curricular y el alcance real del prototipo. Indicar que el avance demuestra hooks, una API pública y persistencia local.

## Índice

1. Capítulo I: Aspectos de la organización
2. Capítulo II: Aspectos del proyecto
3. Capítulo III: Método de desarrollo del producto observable
4. Capítulo IV: Resultados
5. Capítulo V: Conclusiones
6. Capítulo VI: Recomendaciones

## 1. Capítulo I: Aspectos de la organización

Completar esta sección con información de la organización real donde se aplicará el proyecto. El repositorio no identifica una organización, por lo que no se deben inventar su historia, misión, visión ni estructura.

### 1.1 Visión

[Visión oficial de la organización y fuente.]

### 1.2 Misión

[Misión oficial de la organización y fuente.]

### 1.3 Reseña histórica

[Reseña respaldada por información institucional.]

### 1.4 Organigrama

[Insertar organigrama vigente y citar la fuente.]

### 1.5 Ámbito del proyecto

- **Área de aplicación:** [área y responsable que validan el problema].
- **Recursos humanos:** [integrantes, funciones, asesor y usuarios participantes].
- **Software:** React Native, Expo SDK 57, AsyncStorage y API pública Dog CEO. Añadir las herramientas efectivamente usadas.
- **Hardware:** [dispositivos disponibles y especificaciones verificadas].
- **Cronograma:** [actividades, fechas reales, responsables y estado].

### 1.6 Descripción de funciones y procesos del negocio

[Describir el proceso actual de registro y seguimiento de mascotas según observación o entrevista. El prototipo permite registrar datos básicos y consultar una lista; no gestiona todavía citas reales.]

## 2. Capítulo II: Aspectos del proyecto

### 2.1 Análisis situacional

[Documentar el proceso actual, usuarios, dificultades y fuentes de información. Validar con la organización o usuarios antes de afirmar que existe un problema observado.]

### 2.2 Formulación del problema

- **Problema general:** [redactar después de validar el contexto].
- **Problemas específicos:** [enumerar necesidades verificadas].

### 2.3 Objetivos del proyecto

- **Objetivo general:** Desarrollar un prototipo móvil para registrar y consultar información básica de mascotas, integrando persistencia local y consumo de una API pública.
- **Objetivos específicos:** Implementar interfaz funcional con hooks; persistir sesión de demostración y mascotas con AsyncStorage; consumir y presentar imágenes de Dog CEO; comunicar estados de carga y error.

### 2.4 Fundamentación teórica

Explicar React Native y Expo como tecnologías de interfaz y ejecución móvil; `useState` para estado local, `useEffect` para carga y persistencia sincronizada con el ciclo de vida, AsyncStorage como almacenamiento clave-valor no cifrado, APIs REST/JSON y `fetch` para solicitudes HTTP. Relacionar cada concepto con su uso real en PetCare.

GPS, cámara, acelerómetro, permisos, notificaciones y EAS Build pueden describirse como conceptos futuros, pero **no están implementados en este avance**.

## 3. Capítulo III: Método de desarrollo del producto observable

### 3.1 Análisis de requerimientos

**Requerimientos funcionales implementados**

1. Ingresar al prototipo con un correo válido en modo de demostración.
2. Consultar la lista y el detalle de las mascotas de ejemplo o guardadas.
3. Registrar una mascota con nombre y raza obligatorios y datos adicionales opcionales.
4. Guardar y recuperar la sesión de demostración y las mascotas localmente.
5. Solicitar y mostrar hasta seis imágenes aleatorias de Dog CEO.
6. Mostrar carga, error, reintento y respuesta sin imágenes en la sección de descubrimiento.

**Requerimientos no funcionales implementados o verificables**

- Presentación móvil adaptable mediante componentes de React Native.
- Validación de campos requeridos y del correo de demostración.
- Validación de formato de datos recuperados antes de mostrarlos.
- Mensajes visibles ante fallos de lectura, escritura o API.
- No almacenar contraseñas; la sesión de demostración no es autenticación.

**No implementado:** sincronización remota, seguridad/autenticación de cuentas, gestión real de citas, sensores, permisos, notificaciones, pruebas automatizadas y publicación.

### 3.2 Diseño

- **Arquitectura:** interfaz móvil con estado coordinado en `App.js`, pantallas/componentes en `src/`, almacenamiento AsyncStorage y API externa Dog CEO. No hay backend propio.
- **Navegación:** selección de pantallas por estado (`view`) y barra inferior. Agenda, Actividades y Lugares presentan avisos provisionales; no se usa actualmente Stack/Tabs/Drawer de React Navigation.
- **Diseño visual:** estilos con `StyleSheet`; registrar aquí mockups y capturas creados por el equipo.

### 3.3 Desarrollo

Describir instalación con `npm ci` y ejecución con `npm start`. Explicar la carga y escritura mediante `useEffect`, los estados mediante `useState`, el formulario de alta y el hook `src/hooks/useDogImages.js`.

**Request de ejemplo**

```http
GET https://dog.ceo/api/breeds/image/random/6
```

**Response ilustrativa del contrato de la API** (capturar y anexar la respuesta exacta obtenida durante la prueba):

```json
{
  "message": ["https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg"],
  "status": "success"
}
```

Las claves locales actuales son `@petcare/session:v1` y `@petcare/pets:v1`. La app no solicita permisos de hardware ni genera builds con EAS.

### 3.4 Pruebas

Registrar dispositivo/emulador, sistema operativo, fecha, pasos, resultado esperado, resultado observado y evidencia para cada caso:

| Caso | Validación |
|---|---|
| Acceso | Correo no válido muestra error; correo válido abre el prototipo. |
| Alta | Nombre/raza vacíos no se guardan; una mascota válida aparece en la lista y en el detalle. |
| Persistencia | Tras reiniciar, se recuperan sesión de demostración y mascotas añadidas. |
| API disponible | Las imágenes y razas aparecen; actualizar solicita nuevos datos. |
| API no disponible | Se presenta un error comprensible y el botón permite reintentar. |
| Estados vacíos | Una respuesta válida sin imágenes muestra un mensaje y opción para volver a intentar. |

Completar la tabla con resultados observados y capturas. No hay resultados de rendimiento ni validación en dispositivo incluidos por defecto.

## 4. Capítulo IV: Resultados

Adjuntar evidencias generadas por el equipo, con fecha y descripción:

- Capturas de acceso, inicio, alta, lista persistida y detalle.
- Capturas de carga, error/reintento y respuesta de la API.
- Inspección o evidencia de recuperación de datos de AsyncStorage.
- Evidencia de ejecución en emulador o dispositivo real, indicando modelo y sistema.
- Enlace de Expo.dev e instalación APK **solo si se genera y prueba**. Actualmente no hay APK ni build EAS en el repositorio.

## 5. Capítulo V: Conclusiones

Redactar conclusiones a partir de las pruebas realizadas: logros técnicos verificables, aplicación de hooks, API y persistencia, límites del prototipo y aprendizajes del equipo. Evitar atribuir impacto o resultados a usuarios sin evaluación.

## 6. Capítulo VI: Recomendaciones

- Validar necesidades y flujos con la organización antes de ampliar el producto.
- Incorporar backend/BaaS (por ejemplo, Firebase o Supabase) y autenticación segura si se requiere sincronización.
- Completar gestión de citas y edición/eliminación con pruebas de datos.
- Diseñar por separado la integración de GPS/cámara/sensores y solicitar permisos solo cuando una función concreta los necesite.
- Evaluar notificaciones locales/remotas y pruebas en dispositivos reales.
- Configurar EAS Build y preparar publicación solo después de validar privacidad, seguridad, rendimiento y requisitos de tienda.

## Relación con la rúbrica APF2

| Criterio | Evidencia en el proyecto |
|---|---|
| Hooks y lógica funcional (20 %) | `useState` en formularios/vistas y `useEffect` para carga y persistencia local/API. |
| Consumo de API y renderizado (25 %) | Hook de Dog CEO y tarjetas de imágenes con nombre de raza. |
| Carga, error y estados vacíos (15 %) | Indicador, mensajes, reintento y resultado vacío en descubrimiento; error de carga local con reintento. |
| AsyncStorage (20 %) | Guardado/recuperación de sesión demo y mascotas. |
| Integración y documentación (15 %) | Flujo de alta-lista-detalle, API, guía de ejecución y esta estructura de informe. |

La rúbrica debe calificarse con las pruebas y evidencias reales del equipo; esta tabla solo vincula criterios con la implementación.
