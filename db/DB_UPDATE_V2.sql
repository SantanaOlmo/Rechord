-- DB_UPDATE_V2.sql
-- Ejecuta este script para actualizar la tabla CANCION con los nuevos requisitos.

-- 1. Renombrar archivo_mp3 a ruta_mp3
-- Usamos CHANGE para mayor compatibilidad. Asumimos que la columna actual es VARCHAR(255).
ALTER TABLE CANCION CHANGE archivo_mp3 ruta_mp3 VARCHAR(255);

-- 2. Añadir columna ruta_imagen
ALTER TABLE CANCION ADD COLUMN ruta_imagen VARCHAR(255) DEFAULT NULL AFTER ruta_mp3;
