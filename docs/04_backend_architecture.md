[ Volver al �ndice](index.md)

# Arquitectura Backend

El backend de Rechordb es una API RESTful construida con **PHP 8+** puro, siguiendo el patrón **MVC (Modelo-Vista-Controlador)**.

## 🏛️ Estructura

### 1. API Endpoints (`api/`)
Puntos de entrada públicos que reciben las peticiones HTTP (GET, POST, etc.), validan los parámetros básicos y despachan al controlador correspondiente.
*   `canciones.php`
*   `usuarios.php`
*   `auth.php`

### 2. Controladores (`controllers/`)
Orquestan la lógica de negocio. Reciben datos de la API, consultan los modelos y devuelven respuestas JSON.
*   `CancionController.php`: Gestión de música y configuración de home.
*   `UsuarioController.php`: Gestión de usuarios y perfiles.
*   `SeguirController.php`: Lógica social.

### 3. Modelos (`models/`)
Capa de acceso a datos (DAO). Contienen las consultas SQL directas a la base de datos.
*   `Cancion.php`
*   `Usuario.php`
*   `HomeConfig.php` (Configuración dinámica de secciones).

### 4. WebSockets (`server/` y `websocket/`)
Implementación de tiempo real usando `Ratchet`.
*   **`WebSocketServer.php`**: Entry point del servidor de sockets.
*   **`WSRouter.php`**: Enruta mensajes JSON a la lógica adecuada.
*   **`RoomManager.php`**: Gestiona el estado de las salas de escucha compartida.

## 🔐 Seguridad

*   **JWT (JSON Web Tokens)**: Usado para la autenticación de usuarios en cada petición de la API.
*   **CORS**: Configurado para permitir peticiones desde el frontend.
*   **Prepared Statements**: Todas las consultas SQL utilizan sentencias preparadas para prevenir inyección SQL.

[⬅️ Volver al Índice](index.md)

