# 📘 Guía de Arquitectura y Flujo de Trabajo (Rechord)

Este documento explica cómo trabajar con la nueva arquitectura modular implementada en el proyecto, siguiendo las reglas definidas en `instructions.md`.

## 1. Backend: Capa de Servicios

Para mantener los controladores "delgados" y centralizar la lógica de negocio, utilizamos una **Capa de Servicios**.

### Flujo de Datos
`Router (API)` $\rightarrow$ `Controller` $\rightarrow$ `Service` $\rightarrow$ `Model`

### Cómo implementar una nueva funcionalidad:
1.  **Model (`models/`)**: Crea métodos que solo ejecuten SQL. No incluyas validaciones complejas aquí.
2.  **Service (`services/`)**: Crea un método que contenga la lógica.
    *   Valida datos de negocio.
    *   Llama a uno o más Modelos.
    *   Maneja subida de archivos (usando `processFile`).
    *   Retorna los datos procesados o lanza `Exception`.
3.  **Controller (`controllers/`)**:
    *   Recibe la petición HTTP.
    *   Instancia el Servicio.
    *   Llama al método del Servicio dentro de un `try-catch`.
    *   Devuelve `json_encode` con la respuesta o el error.

**Ejemplo:**
```php
// Controller
$service = new CancionService();
try {
    $data = $service->create($userId, $_POST, $_FILES);
    echo json_encode(['success' => true, 'data' => $data]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
```

## 2. Frontend: Gestión de Estado (Store)

Para desacoplar componentes, usamos un patrón **Pub-Sub** centralizado en `StateStore.js`.

### Principios
*   **Componentes Agnósticos**: `PlayerControls` no sabe que `SongCard` existe.
*   **Fuente de Verdad**: El estado (qué canción suena, volumen, cola) vive en el Store, no en el DOM.

### Uso del Store:
*   **Publicar un evento** (Hacer que pase algo):
    ```javascript
    import { Store, EVENTS } from '../core/StateStore.js';
    Store.publish(EVENTS.PLAYER.PLAY_SONG, { id: 123 });
    ```
*   **Suscribirse a un cambio** (Reaccionar a algo):
    ```javascript
    Store.subscribe(EVENTS.PLAYER.PLAY_SONG, (data) => {
        console.log('Nueva canción:', data.id);
        // Actualizar UI
    });
    ```

## 3. Base de Datos y Migraciones

Cualquier cambio en la base de datos debe ser rastreable.

### Flujo de Modificación:
1.  **Modificar DB**: Realiza tus cambios en MySQL (phpMyAdmin, etc.).
2.  **Documentar Esquema**: Actualiza el diagrama Mermaid en `db_schema.md`.
3.  **Crear Migración**: Genera un archivo `.sql` en `db/` con el nombre `db_migration_N.sql` (incrementando N).
    *   Incluye solo los comandos `ALTER`, `CREATE` o `INSERT` necesarios para replicar el cambio.

## 4. WebSockets (Planificación)

Para el futuro "Modo Fiesta" (Sincronización):
*   **Backend**: Usaremos `backend/services/RoomManager.php` para gestionar salas.
*   **Frontend**: `frontend/services/socketService.js` manejará la conexión.
*   El Store tendrá eventos como `SOCKET:JOIN_ROOM` y `SOCKET:SYNC_STATE`.

## 5. Git Workflow

Al finalizar una tarea:
1.  Actualiza `project_structure.json` si añadiste/borraste archivos.
2.  Ejecuta:
    ```bash
    git add .
    git commit -m "feat: [Descripción clara del cambio]"
    git push
    ```
