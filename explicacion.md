# Infraestructura WebSocket y Robustez

En esta etapa final de la implementación de WebSockets, hemos establecido la infraestructura necesaria para ejecutar el servidor de manera persistente y asegurado que el cliente pueda manejar desconexiones de manera elegante.

## 1. Servidor WebSocket (Backend)

Se ha creado el punto de entrada real del servidor usando la librería **Ratchet**:

*   **`backend/server/WebSocketServer.php`**:
    *   Este script inicializa el servidor WebSocket en el puerto `8080`.
    *   Implementa la interfaz `MessageComponentInterface`.
    *   Delega el manejo de mensajes al `WSRouter` existente, conectando la lógica de negocio (`RoomManager`) con la infraestructura de red.
    *   Maneja eventos de ciclo de vida: `onOpen`, `onMessage`, `onClose`, `onError`.

*   **`deployment/run_ws.sh`**:
    *   Script de utilidad para ejecutar el servidor en segundo plano (`nohup`), facilitando el despliegue.

## 2. Robustez del Cliente (Frontend)

El servicio `frontend/services/socketService.js` ha sido blindado para entornos de producción inestables:

*   **Reconexión Automática**: Implementa un algoritmo de "Exponential Backoff". Si la conexión se pierde, intenta reconectar esperando tiempos crecientes (1s, 2s, 4s...) hasta un límite de intentos.
*   **Manejo de Cierres**: Distingue entre cierres limpios y caídas inesperadas.
*   **Notificación al Estado**: Publica el evento `EVENTS.SOCKET.DISCONNECTED` en el `StateStore` cuando la conexión falla definitivamente, permitiendo que la UI informe al usuario.

Con esto, el sistema de sincronización no solo es funcional, sino que es capaz de auto-recuperarse y mantenerse operativo en un entorno real.
