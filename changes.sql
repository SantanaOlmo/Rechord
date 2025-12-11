-- Crear tabla de versiones
-- Una versión pertenece a una canción y es creada por un usuario.
-- Contiene el contenido específico (acordes/letra modificados) y metadata.

CREATE TABLE `versions` (
  `id_version` int(11) NOT NULL AUTO_INCREMENT,
  `id_cancion` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `titulo_version` varchar(255) DEFAULT 'Versión Original',
  `contenido_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Contenido estructurado de la versión (acordes, letra, tiempos)',
  `likes` int(11) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_version`),
  KEY `id_cancion` (`id_cancion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_version_cancion` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE,
  CONSTRAINT `fk_version_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `chk_json_valid` CHECK (json_valid(`contenido_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla para gestionar los likes de versiones (evitar duplicados por usuario)
CREATE TABLE `like_version` (
  `id_like_version` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_version` int(11) NOT NULL,
  PRIMARY KEY (`id_like_version`),
  UNIQUE KEY `uk_like_version` (`id_usuario`,`id_version`),
  CONSTRAINT `fk_like_version_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `fk_like_version_version` FOREIGN KEY (`id_version`) REFERENCES `versions` (`id_version`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
