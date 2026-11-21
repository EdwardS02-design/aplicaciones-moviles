# Memoria del proyecto PetCare - APF2 (2026)

Esta guía desarrolla el índice académico solicitado con base en lo que el repositorio implementa y evidencia disponible. No reemplaza la entrevista ni la autorización de la organización. Donde los datos institucionales aún no han sido facilitados, se indica qué debe verificarse antes de presentar el informe.

## Introducción

PetCare es un prototipo de aplicación móvil orientado al registro local de información básica y cuidados de mascotas. El avance integra hooks de React, consulta de una API pública de imágenes caninas, estados de carga y error, persistencia local con AsyncStorage y funciones del dispositivo de uso opcional.

La organización propuesta por el equipo es **Pet Spaw - Spa y Dermatología Veterinaria**, a partir del enlace de Google Maps compartido por el equipo: [ficha de Pet Spaw](https://maps.app.goo.gl/pdjydh5rFumceGi19). El distrito, la dirección, la historia y la estructura institucional deben confirmarse con la veterinaria. La app es una propuesta académica; no se afirma que la organización haya solicitado, aprobado o desplegado el producto.

## Índice

1. Capítulo I: Aspectos de la organización
   1.1 Visión
   1.2 Misión
   1.3 Reseña histórica
   1.4 Organigrama
   1.5 Ámbito del proyecto
   1.6 Descripción de funciones y procesos del negocio
2. Capítulo II: Aspectos del proyecto
   2.1 Análisis situacional
   2.2 Formulación del problema
   2.3 Objetivos
   2.4 Fundamentación teórica
3. Capítulo III: Método de desarrollo del producto observable
   3.1 Análisis de requerimientos
   3.2 Diseño
   3.3 Desarrollo
   3.4 Pruebas
4. Capítulo IV: Resultados
5. Capítulo V: Conclusiones
6. Capítulo VI: Recomendaciones

# 1. Capítulo I: Aspectos de la organización

## 1.1 Visión

**Pendiente de validación:** solicitar a Pet Spaw su visión institucional oficial. La ficha de ubicación compartida no contiene una declaración institucional verificada. No atribuir a la veterinaria una frase redactada por el equipo.

## 1.2 Misión

**Pendiente de validación:** solicitar a Pet Spaw su misión oficial. Hasta recibir una fuente institucional o validación de su representante, no consignar una misión como cita de la empresa.

## 1.3 Reseña histórica

La organización seleccionada es Pet Spaw, descrita en la ficha compartida como “Spa y Dermatología Veterinaria”. **La fecha de fundación, hitos, fundadores y trayectoria no aparecen verificados en los datos entregados**. Completar mediante entrevista a un representante o fuente oficial, incluyendo fecha de consulta.

## 1.4 Organigrama

**Pendiente de validación con Pet Spaw.** Solicitar el organigrama vigente o autorización para elaborar uno simplificado. No inferir cargos, nombres ni líneas de reporte a partir de la ficha pública.

## 1.5 Ámbito del proyecto

- **Organización propuesta:** Pet Spaw - Spa y Dermatología Veterinaria.
- **Ubicación:** Lima, según lo indicado por el equipo; validar dirección y distrito exactos con la veterinaria. La fuente compartida es la [ficha de Google Maps](https://maps.app.goo.gl/pdjydh5rFumceGi19).
- **Área de aplicación propuesta:** registro de mascotas y recordatorios de cuidado veterinario. Confirmar con la administración si estos procesos son pertinentes y si se realizará una prueba del prototipo.
- **Recursos humanos:** completar con nombres y roles reales del equipo del curso, asesor y representante/usuarios de la clínica que acepten participar. Actualmente no se han proporcionado nombres.
- **Software:** React Native 0.86, React 19, Expo SDK 57, AsyncStorage, Dog CEO API, Expo Image Picker, Location, Notifications, Sensors y EAS Build. Node.js/npm para desarrollo.
- **Hardware:** desarrollo verificado en navegador de escritorio; modelo de teléfono, versión de Android/iOS y pruebas físicas todavía pendientes de registrar.
- **Cronograma:** adaptar al cronograma real del curso. Modelo editable:

| Actividad | Responsable | Inicio/fin real | Estado/evidencia |
|---|---|---|---|
| Validación del problema y alcance con Pet Spaw | [integrante] | [fechas] | Pendiente de entrevista/autorización |
| Requisitos y diseño de pantallas | [integrante] | [fechas] | [completar] |
| Implementación de hooks, API y estados | [integrante] | [fechas] | Implementado en el prototipo; validar |
| Persistencia, agenda y capacidades nativas | [integrante] | [fechas] | Implementado; prueba física pendiente |
| Pruebas, capturas y APK interno | [integrante] | [fechas] | Pendiente |
| Revisión y entrega de memoria | [integrante] | [fechas] | [completar] |

## 1.6 Descripción de funciones y procesos del negocio

La ficha compartida identifica servicios de spa y dermatología veterinaria. El proceso de atención, registro de pacientes, programación de citas y seguimiento **no ha sido observado ni descrito por la organización**. Documentar el flujo real mediante entrevista/observación autorizada antes de atribuirlo a Pet Spaw.

Como propuesta de alcance del prototipo, PetCare permite crear y editar fichas locales de mascotas, consultar datos básicos, guardar opcionalmente una foto/ubicación y crear recordatorios locales de cuidado. No administra citas de la clínica, historias clínicas, pagos ni información de clientes en un servidor.

# 2. Capítulo II: Aspectos del proyecto

## 2.1 Análisis situacional

**Hipótesis de trabajo por validar con Pet Spaw:** un registro local puede servir para demostrar cómo organizar datos básicos de mascotas y recordar actividades de cuidado. No se recibió evidencia de que la clínica tenga actualmente un problema de pérdida de datos, citas incumplidas o ausencia de sistemas.

Antes de presentar el análisis como diagnóstico, realizar y documentar: (a) entrevista al responsable autorizado, (b) proceso actual y herramientas usadas, (c) necesidades/prioridades, (d) restricciones de privacidad y uso de datos, (e) alcance aprobado. Evitar recopilar datos personales o clínicos reales en el prototipo sin autorización y medidas adecuadas.

## 2.2 Formulación del problema

- **Problema general (propuesta académica):** ¿Cómo puede un prototipo móvil demostrar el registro y consulta local de información básica de mascotas y apoyar recordatorios de cuidado, con consulta de datos de una API pública?
- **Problemas específicos (requisitos del prototipo, no hallazgos atribuidos a Pet Spaw):**
  1. ¿Cómo organizar una lista de mascotas y conservarla entre aperturas sin backend?
  2. ¿Cómo consultar y presentar datos remotos con estados de carga, error y respuesta vacía?
  3. ¿Cómo comunicar en la interfaz el registro de una mascota y los recordatorios locales?
  4. ¿Cómo solicitar permisos de cámara, fotos y ubicación solo al activar la función correspondiente?

Reformular las preguntas si la entrevista valida un problema operacional específico de la clínica.

## 2.3 Objetivos del proyecto

### 2.3.1 Objetivo general

Desarrollar y validar un prototipo móvil para registrar información básica de mascotas, consultarla localmente y programar recordatorios de cuidado, integrando hooks de React Native, una API pública y AsyncStorage.

### 2.3.2 Objetivos específicos

1. Implementar interfaz con `useState` y efectos ligados al ciclo de vida mediante `useEffect`.
2. Consultar Dog CEO y presentar imágenes con carga, error, reintento y estado vacío.
3. Persistir y validar sesión de demostración, mascotas y recordatorios usando AsyncStorage.
4. Implementar captura opcional de foto, ubicación puntual y lectura del acelerómetro, solicitando permisos/activación de forma explícita.
5. Definir un perfil EAS para APK interno y ejecutar pruebas en dispositivo antes de reportar un build como resultado.

## 2.4 Fundamentación teórica

- **React Native:** framework de interfaz móvil basado en componentes, usado para construir las pantallas del prototipo.
- **Expo:** plataforma de herramientas y módulos nativos; la app usa Expo SDK 57.
- **Hooks:** `useState` mantiene estado de formularios, sesión y datos; `useEffect` inicia/limpia la lectura del sensor y sincroniza datos persistentes; `useCallback` conserva la función de carga.
- **AsyncStorage:** almacenamiento local clave-valor no cifrado. Se usa para datos de demostración no sensibles, no para contraseñas ni tokens.
- **API REST/JSON:** Dog CEO sirve imágenes de perros mediante `GET https://dog.ceo/api/breeds/image/random/6`, con respuesta `message` (URLs) y `status`. `fetch`, control HTTP y validación de forma procesan el resultado.
- **Permisos y cámara:** Expo Image Picker solicita permiso cuando la persona elige tomar o seleccionar una foto; la imagen seleccionada se copia al directorio privado de la app.
- **GPS:** Expo Location solicita permiso de primer plano bajo demanda, obtiene una única coordenada y no realiza seguimiento en segundo plano.
- **Notificaciones:** Expo Notifications programa y cancela avisos locales para una fecha futura. No hay envío push desde un servidor.
- **Acelerómetro:** Expo Sensors expone lecturas X/Y/Z mientras Actividades está montada; no son datos clínicos ni actividad de la mascota.
- **EAS Build:** `eas.json` configura el perfil Android `preview` con distribución interna APK. La configuración por sí sola no produce un APK ni evidencia instalación.

# 3. Capítulo III: Método de desarrollo del producto observable

## 3.1 Análisis de requerimientos

### Requerimientos funcionales implementados

1. Iniciar sesión de demostración con un correo válido; cerrar sesión elimina el perfil local.
2. Consultar lista, métricas y detalle de mascotas; crear y editar una ficha local.
3. Persistir y recuperar sesión demo, mascotas, fotos/ubicación opcionales y agenda con AsyncStorage.
4. Consultar hasta seis imágenes aleatorias de Dog CEO y presentarlas con el nombre derivado de la raza.
5. Comunicar carga, error, reintento y respuesta válida sin imágenes de la API.
6. Programar y cancelar recordatorios locales con selección de mascota, motivo, fecha y hora.
7. Solicitar acceso a cámara/fotos solo desde los controles de imagen; solicitar ubicación al pedir una captura puntual.
8. Mostrar las coordenadas guardadas en el detalle y ofrecer abrirlas en un mapa externo.
9. Mostrar lecturas del acelerómetro en la pantalla Actividades y liberar la suscripción al salir.

### Requerimientos no funcionales implementados o pendientes

- Validación de formatos de datos persistidos, correo de demostración, campos obligatorios y fecha/hora futura.
- Mensajes visibles y tratamiento de errores de carga, API, permisos, agenda y almacenamiento.
- No guardar credenciales; pedir permisos nativos solo al usar capacidades relacionadas.
- Interfaz adaptable de React Native; navegación actual basada en estado, no en Stack/Tabs/Drawer.
- **Pendiente:** evaluar accesibilidad, rendimiento en dispositivos objetivo, privacidad con la organización, backend/autenticación real y pruebas en dispositivos representativos.

## 3.2 Diseño

- **Arquitectura:** `App.js` coordina estado; `src/screens` implementa pantallas; `src/components` presenta datos; `src/hooks/useDogImages.js` realiza la consulta; `src/services/deviceFeatures.js` encapsula capacidades nativas; `petcareValidation.js` valida persistencia y respuestas.
- **Datos locales:** claves `@petcare/session:v1`, `@petcare/pets:v1`, `@petcare/reminders:v1`. La URI de foto refiere a un archivo dentro del directorio privado; las coordenadas solo se guardan tras acción explícita.
- **API:** Dog CEO no es el backend de pacientes. No se transmiten a Dog CEO datos personales, mascotas, fotos, recordatorios ni coordenadas.
- **Navegación:** pantallas escogidas por estado (`view`) y barra inferior. Mascotas, Agenda y Actividades ya tienen flujo; Lugares todavía es provisional. React Navigation está instalado pero no gobierna la navegación actual.
- **Diseño visual:** componentes `StyleSheet`, tarjetas y formularios. Adjuntar mockups/capturas reales del equipo si la rúbrica lo requiere.

## 3.3 Desarrollo

### Configuración de Expo

```sh
npm ci
npm start
```

Para validar compatibilidad/exportación:

```sh
npm test
npx expo install --check
npx expo export --platform web
```

### API: request y response

```http
GET https://dog.ceo/api/breeds/image/random/6
```

Ejemplo del contrato; la evidencia de resultados debe incluir una captura de la respuesta real obtenida en la ejecución del equipo:

```json
{
  "message": [
    "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg"
  ],
  "status": "success"
}
```

### AsyncStorage

El arranque recupera datos y valida su forma antes de mostrarlos; cambios en estado local se escriben de forma serializada para no reordenar escrituras concurrentes. Si ocurre un error de almacenamiento, se informa en pantalla. AsyncStorage no cifra los datos.

### Sensores, permisos y notificaciones

La configuración de plugins en `app.json` contiene textos de propósito para permisos. GPS es una lectura de primer plano de una sola vez; fotos se solicitan desde la acción de captura/selección; la agenda configura el canal Android y pide permiso al programar el aviso. La pestaña Actividades usa el acelerómetro sin guardar o transmitir lecturas.

### Generación de APK

`eas.json` declara el perfil `preview` (`distribution: internal`, `android.buildType: apk`). Con cuenta del equipo y proyecto vinculado:

```sh
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform android --profile preview
```

El APK y su URL son **pendientes**, no resultados ya producidos. El identificador de aplicación `com.petcare.aplicacionesmoviles` es provisional y debe confirmarse libre antes de generar/publicar.

## 3.4 Pruebas

### Pruebas automatizadas del repositorio

`npm test` contiene cuatro pruebas unitarias:

| Prueba | Cobertura |
|---|---|
| Sesión y mascotas | Acepta registros válidos y rechaza formatos incompletos; valida metadatos opcionales. |
| Agenda | Valida los campos obligatorios de un recordatorio persistido. |
| Dog CEO | Valida el contrato y filtra URLs que no pertenecen al dominio HTTPS esperado. |
| Fecha/hora | Acepta una fecha futura y rechaza fecha imposible, hora/formato inválido y fecha pasada. |

**Ejecución observada en el entorno de desarrollo:** 4 pruebas aprobadas, 0 fallidas. Registrar junto a la entrega la fecha de nueva ejecución y la salida guardada por el equipo.

### Matriz de validación manual

Completar las columnas de resultado, dispositivo y evidencia después de ejecutar cada prueba. Una exportación web no demuestra el funcionamiento del hardware.

| Caso | Resultado esperado | Estado/evidencia |
|---|---|---|
| Correo inválido/válido y cierre de sesión | Muestra validación; abre el prototipo; luego vuelve al acceso. | [ejecutar y adjuntar captura] |
| Alta/edición de mascota | Campos requeridos validados; lista y detalle reflejan cambios. | Alta en navegador observada; documentar nueva prueba |
| Reinicio/persistencia | Sesión, mascotas y recordatorios se recuperan en el mismo dispositivo. | Reinicio web previamente observado para mascota; validar en dispositivo |
| API disponible | Imágenes y raza presentadas; actualizar carga otro resultado. | API Dog CEO respondió HTTP correcto y seis URLs en una comprobación; adjuntar response |
| API indisponible/estado vacío | Error reintentable y estado vacío legible. | [simular y adjuntar captura] |
| Cámara/fotos | Permiso aceptado permite elegir/tomar y conservar foto tras reiniciar. | [prueba física pendiente] |
| GPS | Permiso aceptado guarda coordenadas; denegado explica el motivo. | [prueba física pendiente] |
| Agenda | Aviso futuro recibido; cancelar suprime el aviso pendiente; datos recuperados. | [prueba física pendiente] |
| Acelerómetro | Datos varían al mover el teléfono; pantalla libera lectura al salir. | [prueba física pendiente] |
| Instalación APK | APK se instala y funcionalidades nativas funcionan. | [build EAS e instalación pendientes] |

# 4. Capítulo IV: Resultados

## Resultados técnicos verificables

- Implementación de formularios y flujos locales de mascotas, agenda y actividad.
- Hook de API con estado y validación de respuesta.
- Persistencia de sesión demo, mascotas y recordatorios.
- Configuración de permisos, plugins Expo y perfil EAS para APK interno.
- Cuatro pruebas automatizadas aprobadas en el entorno de desarrollo.
- La app ya había sido exportada para web y Dog CEO respondió con seis imágenes en la validación de desarrollo.

## Evidencias por completar para entregar

1. Capturas de acceso, inicio, formulario de mascota, lista/detalle y edición.
2. Capturas de Agenda, notificación recibida y cancelación.
3. Capturas de permisos aceptados y denegados; no incluir coordenadas/datos privados de terceros.
4. Captura de Actividades en dispositivo mostrando lecturas del acelerómetro.
5. Respuesta real de Dog CEO, incluyendo fecha de consulta.
6. Evidencia de persistencia tras cierre/reapertura en un teléfono/emulador.
7. Enlace del build EAS, descarga/instalación APK y dispositivo de validación, una vez generado.
8. Autorización y evidencia de validación con Pet Spaw si el proyecto se presenta como aplicado a la clínica.

No se declara APK, entrevista, aprobación institucional ni prueba nativa hasta tener evidencia.

# 5. Capítulo V: Conclusiones

Redactar el cierre final después de realizar pruebas en dispositivo. A partir del estado actual del código, el avance demuestra integración técnica de hooks, API, AsyncStorage y estados de interfaz, junto a capacidades locales opcionales. El prototipo no sustituye un sistema clínico: no contiene autenticación, backend, citas sincronizadas ni datos reales de pacientes. La calidad de la experiencia nativa, la utilidad para Pet Spaw y el resultado del APK quedan sujetos a validación.

# 6. Capítulo VI: Recomendaciones

- Obtener de Pet Spaw misión, visión, historia, organigrama y procesos autorizados; verificar el distrito y acordar alcance antes de atribuirle requisitos.
- Realizar pruebas con usuarios autorizados, datos sintéticos y consentimiento; aplicar las políticas de privacidad correspondientes antes de usar información real.
- Añadir un backend/BaaS y autenticación segura solo si el caso requiere sincronización multiusuario.
- Completar Lugares con una API de establecimientos si se obtiene una fuente apropiada; no presentar la pantalla provisional como buscador de clínicas.
- Evaluar rendimiento, accesibilidad, copias de seguridad y manejo de eliminación de datos.
- Generar y probar APK interno; revisar identificador, permisos y textos de privacidad antes de distribución o publicación.

## Relación con la rúbrica del avance 2

| Criterio | Peso | Evidencia implementada | Pendiente para sostener el máximo |
|---|---:|---|---|
| Hooks y lógica de componentes funcionales | 20 % | `useState`, `useEffect`, `useCallback`; efectos de carga/persistencia y alta/edición. | Evidenciar pruebas de ciclo de vida/efectos en uso real. |
| Consumo de API y renderizado de datos | 25 % | Dog CEO con `fetch`, validación HTTP/JSON, imágenes, raza y reintento. | Adjuntar request/response y capturas reales en dispositivo. |
| Estados de carga, error y experiencia de usuario | 15 % | Indicadores/mensajes de carga, error, retry y vacío; permisos y errores locales informados. | Adjuntar pruebas provocando errores/denegación de permisos. |
| Persistencia con AsyncStorage | 20 % | Sesión demo, mascotas, metadatos opcionales y agenda persistidos/validados. | Comprobar reinicio, lectura y recuperación en teléfono/emulador. |
| Integración funcional y documentación técnica | 15 % | Flujos integrados, pruebas unitarias, README, requisitos, arquitectura y guía por capítulos. | Completar datos de la organización y cronograma real; capturas, prueba física y APK. |

La implementación cubre los criterios de código indicados, pero **no garantiza por sí sola un puntaje excelente**. El informe de la organización, evidencias de dispositivo y APK deben completarse con información y pruebas verdaderas del equipo.

## Datos institucionales que debe facilitar/validar el equipo

- Distrito/dirección oficial de Pet Spaw y autorización para presentarla como organización de aplicación.
- Misión, visión, historia y fuente oficial, o confirmación de la clínica de que no cuenta con declaraciones públicas.
- Organigrama/roles y proceso real que se pretende apoyar.
- Integrantes, asesor, participantes y cronograma real del curso.
- Dispositivos, fechas, resultados, capturas, salida de EAS e instalación observados por el equipo.
