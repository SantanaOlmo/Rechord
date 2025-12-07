# Implementación del Backend: WebSockets y Sincronización (RoomManager)

En esta fase, hemos establecido la infraestructura del lado del servidor para soportar la funcionalidad de tiempo real (WebSockets), necesaria para el "Modo Fiesta" o sincronización entre dispositivos.

## 1. Punto de Entrada: `WSRouter.php`
Ubicación: `backend/websocket/WSRouter.php`

Este componente actúa como el "Controlador" para las conexiones WebSocket.
*   **Función**: Recibe mensajes JSON crudos, decodifica la `action` (ej. `CREATE_ROOM`, `UPDATE_PLAYBACK`) y despacha la lógica al `RoomManager`.
*   **Respuesta**: Devuelve estructuras estandarizadas (`status`, `payload`, `broadcast`) que el servidor WebSocket real utilizaría para responder al cliente o emitir a la sala.

## 2. Lógica de Negocio: `RoomManager.php`
Ubicación: `backend/services/RoomManager.php`

Gestiona el ciclo de vida de las salas y el estado de reproducción.
*   **Gestión de Salas**: `createRoom` (genera códigos únicos), `joinRoom`, `leaveRoom`.
*   **Estado de Reproducción**: `updatePlaybackState` actualiza qué canción suena, en qué segundo y si está en pausa/play.
*   **Persistencia**: Delega en el modelo `Sala` para guardar estos estados en la base de datos.

## 3. Persistencia (Modelo y Base de Datos)

Hemos creado una estructura relacional para mantener vivas las salas.

*   **Modelo (`backend/models/Sala.php`)**: Abstrae las consultas SQL para crear, buscar y actualizar salas.
*   **Tabla (`SALAS`)**: Definida en `db/db_migration_1.sql`.
    *   Almacena: `codigo_sala`, `id_maestro`, `current_song_id`, `current_position`, `is_playing`, `estado`.
    *   Permite que una sala "recuerde" qué canción estaba sonando incluso si el socket se desconecta momentáneamente.

---
### Flujo de Sincronización
1.  **Cliente (Maestro)** envía `UPDATE_PLAYBACK` (e.g. Pause en seg 45).
2.  **WSRouter** recibe y valida.
3.  **RoomManager** guarda el nuevo estado en DB (Tabla `SALAS`).
4.  **WSRouter** construye una respuesta de `broadcast`.
5.  **Servidor WS** retransmite a todos los clientes en la sala $\rightarrow$ Clientes se pausan en seg 45.
