CREATE TABLE IF NOT EXISTS `cancion_fondos` (
  `id_fondo` int(11) NOT NULL AUTO_INCREMENT,
  `id_cancion` int(10) unsigned NOT NULL,
  `ruta_fondo` varchar(255) NOT NULL,
  `orden` int(11) DEFAULT 0,
  PRIMARY KEY (`id_fondo`),
  KEY `id_cancion` (`id_cancion`),
  CONSTRAINT `cancion_fondos_ibfk_1` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
