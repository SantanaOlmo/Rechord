-- Migration: Create SALAS table
-- Description: Stores active WebSocket rooms for synchronization.

CREATE TABLE IF NOT EXISTS SALAS (
    id_sala INT AUTO_INCREMENT PRIMARY KEY,
    codigo_sala VARCHAR(10) NOT NULL UNIQUE,
    id_maestro INT NOT NULL,
    current_song_id INT DEFAULT NULL,
    current_position FLOAT DEFAULT 0.0,
    is_playing TINYINT(1) DEFAULT 0,
    estado ENUM('activa', 'cerrada') DEFAULT 'activa',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_maestro) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (current_song_id) REFERENCES CANCION(id_cancion) ON DELETE SET NULL
);
