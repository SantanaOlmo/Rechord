[ Volver al �ndice](index.md)

# Sesiones Compartidas (Modo Fiesta)

Esta funcionalidad permite a múltiples usuarios escuchar música sincronizada en tiempo real. Un usuario crea una "Sala" y comparte el código con otros. Todos los miembros de la sala escuchan la misma canción en el mismo punto de reproducción.

## 📡 Arquitectura de Tiempo Real

El sistema utiliza **WebSockets** para la comunicación bidireccional de baja latencia.

### Componentes Clave

1.  **Frontend (`socketService.js`)**: Gestiona la conexión WebSocket, reconexión automática y envío/recepción de eventos.
2.  **UI (`RoomModal.js`)**: Interfaz para crear o unirse a salas.
3.  **Backend (`WebSocketServer.php`)**: Servidor Ratchet PHP que mantiene las conexiones activas.
4.  **Enrutador (`WSRouter.php`)**: Despacha los mensajes a la lógica de negocio adecuada.
5.  **Gestor (`RoomManager.php`)**: Lógica de creación de salas y gestión de estado de reproducción.

## 🔄 Flujo de Datos

1.  **Creación**: Un usuario envía `CREATE_ROOM`. El servidor crea una ID única y asigna al usuario como "Master".
2.  **Unión**: Otros usuarios envían `JOIN_ROOM` con la ID.
3.  **Sincronización**:
    *   Cuando el Master cambia la canción, pausa o busca una posición (`seek`), el cliente envía `UPDATE_PLAYBACK`.
    *   El servidor difunde un evento `PLAYBACK_UPDATED` a todos los miembros de la sala.
    *   Los clientes reciben el evento y ajustan su reproductor local (`PlayerControls.js`) para coincidir con el estado del servidor.

### Eventos WebSocket

| Acción frontend | Payload | Respuesta servidor | Descripción |
| :--- | :--- | :--- | :--- |
| `CREATE_ROOM` | `{ userId }` | `ROOM_CREATED` | Crea una nueva sesión. |
| `JOIN_ROOM` | `{ roomId, userId }` | `ROOM_JOINED` | Se une a una sesión existente. |
| `UPDATE_PLAYBACK` | `{ stateAction, position, songId }` | `PLAYBACK_UPDATED` (Broadcast) | Sincroniza Play/Pause/Seek. |


## 🛠️ Implementación Técnica

### 1. Interfaz de Usuario (UI/UX) - `RoomModal.js`
La interacción del usuario para estas sesiones ocurre principalmente a través de un modal dedicado (`RoomModal.js`). Este componente visual ofrece dos acciones claras:

*   **Crear Sección ("Modo Fiesta")**:
    *   Un botón destacado "Crear Nueva Sala".
    *   Al hacer clic, envía un evento por WebSocket (`CREATE_ROOM`) solicitando al servidor la generación de una nueva ID de sesión única.
    *   Visualmente utiliza colores primarios (indigo) para denotar la acción principal de inicio.
*   **Unirse a una Sala**:
    *   Un campo de entrada de texto (`input`) para escribir el **"Código de Sala"**.
    *   Un botón "Unirse" (verde) que valida que el campo no esté vacío y envía el evento `JOIN_ROOM` con el código proporcionado.
    *   La interfaz busca ser simple y directa, ocultando el modal automáticamente tras realizar una acción exitosa.

### 2. Script de Despliegue - `deployment/run_ws.sh`
Para facilitar la ejecución del servidor WebSocket, se ha creado un script de shell (`.sh`). Este archivo es clave para la persistencia del servicio en un entorno de servidor.

**Contenido y Funcionamiento:**
```bash
#!/bin/bash
# ...
echo "Starting WebSocket Server..."
nohup php backend/server/WebSocketServer.php > ws_output.log 2>&1 &
echo "WebSocket Server started in background. Check ws_output.log for details."
```

**Explicación Profunda:**
*   **`#!/bin/bash`**: Indica que el script debe ser interpretado por Bash.
*   **`nohup` (No Hang Up)**: Esta es la pieza central. Permite que el comando se siga ejecutando incluso si el usuario que lanzó el script cierra su sesión de terminal. Sin esto, el servidor WebSocket se apagaría al desconectarse el administrador.
*   **`php backend/server/WebSocketServer.php`**: Es el comando real que inicia el servidor PHP de Ratchet.
*   **`> .log`**: Redirecciona la salida estándar (lo que verías en pantalla) a un archivo llamado `.log`. Esto es crucial para *logging* y depuración, ya que permite ver errores o estado sin tener la terminal abierta.
*   **`2>&1`**: Redirecciona la salida de error (stderr, descriptor 2) a la salida estándar (stdout, descriptor 1). Así, tanto errores como mensajes normales van al mismo archivo de log.
*   **`&` (Ampersand final)**: Ejecuta el comando en **segundo plano (background)**. Devuelve el control de la terminal inmediatamente al usuario, permitiéndole seguir trabajando mientras el servidor corre "detrás de escena".

### 3. Cliente JS (`socketService.js`)
El cliente actúa como puente entre la UI y el servidor `wss://`.
```javascript
// Ejemplo de uso
socketService.connect(userId);
socketService.send('UPDATE_PLAYBACK', { 
    stateAction: 'PLAY', 
    position: 30, 
    songId: 105 
});
```

## ⚠️ Consideraciones y Limitaciones

*   **Persistencia**: Actualmente las salas viven en la memoria RAM del proceso PHP iniciado por el script `.sh`. Si ese proceso se mata o el servidor se reinicia, las salas activas desaparecen.
*   **Latencia**: Puede haber una ligera discrepancia (milisegundos) debido a la latencia de red variable entre clientes.
*   **Seguridad**: Actualmente el sistema se basa en compartir el código de sala. Cualquier usuario con el código puede unirse; no hay una lista blanca o aprobación por parte del creador.

[⬅️ Volver al Índice](index.md)

