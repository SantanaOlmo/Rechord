[ Volver al Índice](index.md)

# Development Log - November 2025
## Refactoring & Stabilization Sprint

### 1. Bug Fix: Login JSON Error
**Issue:** The frontend was receiving HTML error pages instead of JSON during login/registration.
**Root Cause:**
*   Missing `backend/controllers/UsuarioController.php`.
*   Missing `backend/utils/helper.php` (CORS/Headers).
*   Malformed `backend/models/Usuario.php`.
**Resolution:**
*   Recreated `UsuarioController.php` and `Usuario.php` (Model).
*   Created `helper.php` with `setApiHeaders()` and `sendResponse()`.
*   Fixed routing in `backend/api/usuarios.php`.

### 2. Database Synchronization
**Issue:** Discrepancies between the ER Diagram and the actual Database Schema.
**Resolution:**
*   Analyzed schema using `inspect_schema.php`.
*   Identified missing tables (`LIKE_CARPETA`, `CONFIGURACION_TEMPORAL`, etc.).
*   Created **`db/DB_MIGRATION.sql`** to create missing tables safely.
*   Created **`db/DB_UPDATE_V2.sql`** to rename `archivo_mp3` -> `ruta_mp3` and add `ruta_imagen`.

### 3. Backend Architecture Completion
**Issue:** Multiple controllers referenced in API endpoints were missing.
**Resolution:**
*   Created the following controllers with basic CRUD/Skeleton logic:
    *   `CancionController.php`
    *   `CarpetaController.php`
    *   `LikeController.php`
    *   `SeguirController.php`
    *   `PatronRasgueoController.php`

### 4. File Upload Infrastructure
**Issue:** Need to store audio and images efficiently without bloating the DB.
**Resolution:**
*   **Structure:** Moved uploads to `backend/uploads/` with `music/` and `images/` subdirectories.
*   **Git:** Updated `.gitignore` to ignore binary files but track the folder structure using `.gitkeep`.
*   **Logic:** Updated `CancionController` to:
    *   Validate file types (MP3/WAV/OGG for audio, JPG/PNG for images).
    *   Generate unique filenames (Timestamp + Sanitized Name).
    *   Store files in the filesystem.
    *   Store relative paths in the Database (`ruta_mp3`, `ruta_imagen`).
    *   Clean up physical files on deletion or error.

