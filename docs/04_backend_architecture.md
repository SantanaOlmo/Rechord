[![back](assets/icons/back.png)](00_project_overview.md)

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
