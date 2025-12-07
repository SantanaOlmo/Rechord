# Implementación del Frontend: WebSockets y Sincronización (socketService)

En esta fase, hemos habilitado la capacidad de comunicación en tiempo real en el cliente, integrando el nuevo servicio de WebSockets con el sistema de estado central.

## 1. Configuración (`config.js`)
Se añadió la constante `WS_URL` ('ws://localhost:8080') para definir el punto de conexión con el servidor de WebSockets.

## 2. Servicio de Comunicación: `socketService.js`
Ubicación: `frontend/services/socketService.js`

Este servicio gestiona toda la lógica de transporte de datos en tiempo real.
*   **Conexión y Reconexión**: Intenta mantener la conexión activa automáticamente.
*   **Integración con Store**: No manipula el DOM directamente. Al recibir un mensaje del servidor, lo traduce a un evento del sistema y lo publica en el `StateStore`.
    *   Ejemplo: Recibe `{ action: 'PLAYBACK_UPDATED' }` $\rightarrow$ Publica `EVENTS.SOCKET.SYNC_STATE`.

## 3. Actualización del Estado (`StateStore.js`)

Se ha ampliado el `StateStore` para soportar la lógica de salas y sincronización.
*   **Nuevos Eventos (`EVENTS.SOCKET`)**:
    *   `CONNECTED` / `DISCONNECTED`: Para indicar el estado de la conexión en la UI.
    *   `SYNC_STATE`: Evento crítico que notifica que la canción o posición ha cambiado remotamente.
*   **Estado Inicial**: Se añadió la clave `room` para almacenar el ID de la sala y los miembros.

---
### Flujo de Datos en el Cliente
**Servidor WS** $\rightarrow$ `socketService` (Recibe JSON) $\rightarrow$ `StateStore.publish(SOCKET:SYNC_STATE)` $\rightarrow$ **Componentes (Player)** (Reaccionan y actualizan UI)
