
CREATE TABLE IF NOT EXISTS `chat_conversaciones` (
  `id_conversacion` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_ultima_actividad` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_conversacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `chat_participantes` (
  `id_participante` int(11) NOT NULL AUTO_INCREMENT,
  `id_conversacion` int(11) NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `rol` ENUM('admin', 'user') DEFAULT 'user',
  PRIMARY KEY (`id_participante`),
  FOREIGN KEY (`id_conversacion`) REFERENCES `chat_conversaciones` (`id_conversacion`) ON DELETE CASCADE,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `chat_mensajes` (
  `id_mensaje` int(11) NOT NULL AUTO_INCREMENT,
  `id_conversacion` int(11) NOT NULL,
  `id_usuario_emisor` int(10) UNSIGNED NOT NULL,
  `contenido` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `leido` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_mensaje`),
  FOREIGN KEY (`id_conversacion`) REFERENCES `chat_conversaciones` (`id_conversacion`) ON DELETE CASCADE,
  FOREIGN KEY (`id_usuario_emisor`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Index for performance
CREATE INDEX idx_chat_participantes_usuario ON chat_participantes(id_usuario);
CREATE INDEX idx_chat_mensajes_conversacion ON chat_mensajes(id_conversacion);
