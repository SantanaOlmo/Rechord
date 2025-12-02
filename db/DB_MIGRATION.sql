-- DB_MIGRATION.sql
-- Ejecuta este script en tu gestor de base de datos (phpMyAdmin, Workbench, etc.)
-- para sincronizar tu estructura local con el diseño del proyecto.

-- 1. Añadir columna archivo_mp3 a CANCION (si no existe)
-- Nota: Si usas MySQL antiguo que no soporta IF NOT EXISTS en columnas, 
-- y la columna ya existe, esta línea dará error. Puedes ignorarlo.
SET @dbname = DATABASE();
SET @tablename = "CANCION";
SET @columnname = "archivo_mp3";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE CANCION ADD COLUMN archivo_mp3 VARCHAR(255) AFTER nivel"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. Tabla CONFIGURACION_TEMPORAL
CREATE TABLE IF NOT EXISTS CONFIGURACION_TEMPORAL (
    id_cancion INT(11) NOT NULL,
    tempo_bpm SMALLINT(6) DEFAULT 120,
    metrica_numerador TINYINT(4) DEFAULT 4,
    metrica_denominador TINYINT(4) DEFAULT 4,
    beat_marker_inicio DECIMAL(10,3) DEFAULT 0.000,
    PRIMARY KEY (id_cancion),
    FOREIGN KEY (id_cancion) REFERENCES CANCION(id_cancion) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla PATRON_RASGUEO
CREATE TABLE IF NOT EXISTS PATRON_RASGUEO (
    id_patron INT(11) NOT NULL AUTO_INCREMENT,
    id_usuario INT(10) UNSIGNED NOT NULL,
    nombre VARCHAR(100) DEFAULT NULL,
    patron_data LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`patron_data`)),
    duracion_pulsos TINYINT(4) DEFAULT NULL,
    PRIMARY KEY (id_patron),
    KEY id_usuario (id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla ACORDE_SINCRONIZADO
CREATE TABLE IF NOT EXISTS ACORDE_SINCRONIZADO (
    id_sincronia_acorde INT(11) NOT NULL AUTO_INCREMENT,
    id_cancion INT(10) UNSIGNED NOT NULL,
    id_acorde INT(10) UNSIGNED NOT NULL,
    tiempo_inicio DECIMAL(10,3) DEFAULT NULL,
    tiempo_fin DECIMAL(10,3) DEFAULT NULL,
    PRIMARY KEY (id_sincronia_acorde),
    KEY id_cancion (id_cancion),
    KEY id_acorde (id_acorde),
    FOREIGN KEY (id_cancion) REFERENCES CANCION(id_cancion) ON DELETE CASCADE,
    FOREIGN KEY (id_acorde) REFERENCES ACORDE(id_acorde) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabla RASGUEO_SINCRONIZADO
CREATE TABLE IF NOT EXISTS RASGUEO_SINCRONIZADO (
    id_sincronia_rasgueo INT(11) NOT NULL AUTO_INCREMENT,
    id_cancion INT(10) UNSIGNED NOT NULL,
    id_patron INT(11) NOT NULL,
    tiempo_inicio DECIMAL(10,3) DEFAULT NULL,
    tiempo_fin DECIMAL(10,3) DEFAULT NULL,
    PRIMARY KEY (id_sincronia_rasgueo),
    KEY id_cancion (id_cancion),
    KEY id_patron (id_patron),
    FOREIGN KEY (id_cancion) REFERENCES CANCION(id_cancion) ON DELETE CASCADE,
    FOREIGN KEY (id_patron) REFERENCES PATRON_RASGUEO(id_patron) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabla LIKE_CARPETA
CREATE TABLE IF NOT EXISTS LIKE_CARPETA (
    id_like_carpeta INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario INT(10) UNSIGNED NOT NULL,
    id_carpeta INT(10) UNSIGNED NOT NULL,
    PRIMARY KEY (id_like_carpeta),
    KEY id_usuario (id_usuario),
    KEY id_carpeta (id_carpeta),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_carpeta) REFERENCES CARPETA(id_carpeta) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
