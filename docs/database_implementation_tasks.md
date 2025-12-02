# Database Implementation Tasks

This document outlines the steps required to align the actual database schema with the desired design and ensure proper functionality.

## 1. Schema Updates Required

Based on the comparison between the current database state and the desired ER diagram:

### A. Table Modifications
*   **`USUARIO` Table**:
    *   [x] Ensure `password_hash` column exists (Verified: it is present).
    *   [ ] Verify `bio` column exists (Verified: it is present).

### B. New Tables to Verify/Create
*   **`LIKE_CARPETA`**:
    *   **Status**: Exists in DB, missing from Diagram.
    *   **Action**: **KEEP**. It is useful for the community features.
    *   **Schema**: `id_like_carpeta` (PK), `id_usuario` (FK), `id_carpeta` (FK).

### C. File Storage Strategy (Crucial)
*   **Problem**: Storing large binary files (Audio, Images) in the database bloats the DB and hurts performance.
*   **Solution**: Store files in the filesystem and paths in the DB.
    *   **`CANCION.archivo_mp3`**: Store relative path (e.g., `uploads/music/song_123.mp3`).
    *   **User Avatars** (if added): Store in `uploads/avatars/`.
    *   **Action**: Ensure the `uploads/` directory structure exists and is writable by the server.

## 2. SQL Implementation Script

Run the following SQL to ensure your database matches the requirements (if not already present):

```sql
-- Ensure LIKE_CARPETA exists
CREATE TABLE IF NOT EXISTS LIKE_CARPETA (
    id_like_carpeta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_carpeta INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_carpeta) REFERENCES CARPETA(id_carpeta) ON DELETE CASCADE
);

-- Ensure configuration_temporal exists (if not already)
CREATE TABLE IF NOT EXISTS CONFIGURACION_TEMPORAL (
    id_cancion INT PRIMARY KEY,
    tempo_bpm INT DEFAULT 120,
    metrica_numerador TINYINT DEFAULT 4,
    metrica_denominador TINYINT DEFAULT 4,
    beat_marker_inicio DECIMAL(10,3) DEFAULT 0.000,
    FOREIGN KEY (id_cancion) REFERENCES CANCION(id_cancion) ON DELETE CASCADE
);
```

## 3. Backend Controller Updates
*   **Completed**: Created missing controllers (`CancionController`, `CarpetaController`, `LikeController`, `SeguirController`, `PatronRasgueoController`).
*   **Next Steps**: Implement full logic for file uploads in `CancionController`.
