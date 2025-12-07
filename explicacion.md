# Implementación del Frontend Core: Gestión de Estado (StateStore)

En esta tarea, hemos establecido la base de la arquitectura reactiva del frontend mediante la implementación del patrón **Publicador-Subscriptor (Pub-Sub)**.

## 1. Nuevo Componente: `StateStore.js`
Ubicación: `frontend/core/StateStore.js`

Este archivo actúa como la única fuente de la verdad para el estado de la aplicación.

### Características Principales:
*   **Patrón Pub-Sub**: Métodos `subscribe(event, callback)` y `publish(event, data)` para desacoplar componentes.
*   **Estado Centralizado**: Inicializado con las claves requeridas:
    *   `user`: Información del usuario actual.
    *   `currentSongId`: ID de la canción activa.
    *   `isPlaying`: Estado de reproducción.
    *   `volume`: Nivel de volumen global.
*   **Constantes de Eventos (`EVENTS`)**:
    *   `PLAYER`: Eventos de reproducción (`PLAY_SONG`, `PAUSE`, `UPDATE_POSITION`).
    *   `USER`: Eventos de sesión (`AUTH_SUCCESS`, `LOGOUT`).
    *   `UI`: Cambios de interfaz (`THEME_CHANGED`).

## 2. Integración con el Router Principal (`app.js`)

Hemos modificado el punto de entrada de la aplicación (`frontend/app.js`) para integrar el Store.

*   **Inicialización**: El Store se importa y está listo para usarse globalmente.
*   **Demostración**: Se añadió una suscripción de prueba al evento `EVENTS.USER.AUTH_SUCCESS` para verificar que el router puede reaccionar a cambios de estado (como un inicio de sesión exitoso) sin acoplamiento directo.

---
*Esta implementación cumple con la regla de arquitectura de desacoplar el estado de la UI y los componentes.*
