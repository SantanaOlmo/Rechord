-- DB_UPDATE_PROFILE.sql
-- Añadir columna foto_perfil a la tabla USUARIO

ALTER TABLE USUARIO ADD COLUMN foto_perfil VARCHAR(255) DEFAULT NULL AFTER email;
