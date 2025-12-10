-- Script de actualización de Base de Datos
-- Ejecuta este script en phpMyAdmin o Workbench para asegurar que tienes todas las tablas necesarias.

USE rechord;

-- 1. Tabla para Videos del Hero (si no existe)
CREATE TABLE IF NOT EXISTS `hero_videos` (
  `id_hero` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `ruta_video` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 0,
  `fecha_subida` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_hero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Asegurar que existe la tabla de configuración del Home (si se usa)
CREATE TABLE IF NOT EXISTS `home_config` (
  `id_config` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` enum('estatico','dinamico') NOT NULL,
  `valor` varchar(255) NOT NULL, -- Ej: 'favoritos', 'populares', o ID de etiqueta
  `titulo_mostrar` varchar(255) NOT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_config`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Datos de ejemplo para Hero Video (Opcional, solo si está vacía)
-- Descomentar si quieres insertar un video de prueba manualmente
-- INSERT INTO `hero_videos` (`titulo`, `ruta_video`, `activo`) 
-- SELECT 'Video Demo', 'uploads/hero_videos/demo.mp4', 1 
-- WHERE NOT EXISTS (SELECT * FROM `hero_videos`);
