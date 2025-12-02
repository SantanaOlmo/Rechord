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

# Backend Architecture

The ReChord backend follows a **Model-View-Controller (MVC)** pattern (without the View, as it is a REST API) implemented in vanilla PHP.

## 1. Directory Structure

*   **`backend/api/`**: Entry points for REST requests. These files route requests to the appropriate Controller methods based on HTTP Verb (GET, POST, PUT, DELETE).
*   **`backend/controllers/`**: Business logic. Handles validation, calls Models, and formats Responses.
*   **`backend/models/`**: Data Access Layer. interacts directly with the Database using PDO.
*   **`backend/utils/`**: Helper functions (CORS, JSON formatting).
*   **`backend/uploads/`**: Storage for user-uploaded content (Music, Images).

## 2. Key Components

### Controllers
| Controller | Responsibility |
| :--- | :--- |
| **`UsuarioController`** | Authentication (Login/Register), User Profile management. |
| **`CancionController`** | Song CRUD, **File Uploads** (Audio & Cover Art). |
| **`CarpetaController`** | Organization of songs into folders. |
| **`LikeController`** | Managing Likes on Songs. |
| **`SeguirController`** | Social Graph (Follow/Unfollow users). |
| **`AcordeSincronizadoController`** | Managing synchronized chords for the player. |
| **`PatronRasgueoController`** | Managing strumming patterns. |

### Models
Models correspond 1:1 with Database Tables (mostly). They encapsulate SQL queries.
*   `Usuario`, `Cancion`, etc.

### Database Connection
*   **`db/conexion.php`**: Singleton class managing the PDO connection to MySQL.
*   **`db/config.php`**: Configuration constants (Host, User, Pass).

## 3. File Storage Strategy

To ensure performance and scalability, binary files are **NOT** stored in the database.

*   **Storage Location**: `backend/uploads/`
    *   Audio: `backend/uploads/music/`
    *   Images: `backend/uploads/images/`
*   **Database**: Stores the **Relative Path** string (e.g., `uploads/music/17000000_song.mp3`).
*   **Lifecycle**:
    *   **Upload**: Controller validates extension -> Generates Unique Name -> Moves to FS -> Saves Path to DB.
    *   **Delete**: Controller gets Path from DB -> Deletes Row from DB -> Deletes File from FS (`unlink`).

## 4. API Response Format

All endpoints return JSON.
*   **Success (200/201)**: `{ "message": "...", "data": ... }`
*   **Error (400/404/500)**: `{ "message": "Error description" }`
