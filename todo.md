# 🎸 Rechord: Roadmap de Implementación (Tabs & Audio Dinámico)

## 1. Visión del Proyecto

Crear una aplicación donde las tablaturas no sean archivos estáticos (PDF/Imágenes), sino **datos estructurados** en una base de datos. Esto permitirá:

* Renderizado dinámico según el instrumento (Bajo 4/5 cuerdas, Guitarra, etc.).
* Cambio de tonalidad (Transposición) en tiempo real.
* Sincronización perfecta con audio real o sintetizado.

---

## 2. Arquitectura de Datos (PostgreSQL)

Para que la tablatura sea "líquida", la base de datos debe guardar la anatomía de la música:

### Tabla: `songs`

* `id`, `title`, `artist`, `bpm`, `time_signature` (ej: "4/4").

### Tabla: `versions` (Diferentes instrumentos o arreglos)

* `id`, `song_id`, `instrument_type` (bass, guitar, lead), `tuning` (ej: "E-A-D-G").

### Tabla: `measures` (Compases)

* `id`, `version_id`, `order_index` (1, 2, 3...).

### Tabla: `notes` (El núcleo)

* `measure_id`, `string_number`, `fret_number`, `duration` (1/4, 1/8, 1/16...), `timestamp` (ms desde el inicio).

---

## 3. Estrategia de Ingesta (¿Cómo crear canciones rápido?)

Para evitar "picar" notas a mano, implementaremos importadores:

* **Nivel 1 (Manual/Rápido):** Importador de archivos **MIDI**. (Extrae notas y tiempos).
* **Nivel 2 (Estándar Pro):** Parser de archivos **GuitarPro (.gp3 - .gp5)**. Convierte el binario a nuestro JSON de base de datos.
* **Nivel 3 (IA):** Integración con **Basic Pitch (Spotify)** o **Magenta** para transcribir audios de YouTube a notas (MIDI) de forma automática.

---

## 4. Motor de Renderizado (Frontend)

Migración a **React** para gestionar el estado del reproductor.

* **Visualización:** Uso de **AlphaTab** o **VexFlow**. Estas librerías leerán nuestro JSON y dibujarán las líneas y números automáticamente.
* **Audio Realista:** Uso de **Tone.js**.
* Carga de *Samplers* (muestras reales de instrumentos).
* Programación de eventos: Al llegar al milisegundo , disparar la muestra de audio correspondiente a la nota en la DB.



---

## 5. El Visor Dinámico (Lógica de Negocio)

El visor debe calcular la posición de la nota según la configuración del usuario:

1. **Si el usuario elige Bajo de 5 cuerdas:** La lógica de la app recalcula qué nota de la DB cae en qué traste basándose en la nueva cuerda (Si grave).
2. **Sincronización:** Un cursor visual que recorre la tablatura basado en el BPM y la subdivisión del compás.

---

## 6. Próximos Pasos Técnicos

1. [ ] **Migrar a React:** Crear un componente `TabPlayer`.
2. [ ] **Prueba de Sonido:** Configurar un `Sampler` básico en **Tone.js** que toque una escala de bajo.
3. [ ] **Script de Importación:** Crear una función en JS que reciba un JSON de notas y lo inserte en la base de datos de Postgres.

