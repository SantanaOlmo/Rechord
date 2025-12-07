-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-12-2025 a las 14:25:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rechord`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acorde`
--

CREATE TABLE `acorde` (
  `id_acorde` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `color_hex` varchar(7) NOT NULL DEFAULT '#3498DB' COMMENT 'Color HEX para visualizar el acorde en la pista de sincronización (ej. #FF0000)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acorde_cejilla`
--

CREATE TABLE `acorde_cejilla` (
  `id_cejilla` int(10) UNSIGNED NOT NULL,
  `id_acorde` int(10) UNSIGNED NOT NULL,
  `traste` tinyint(4) NOT NULL,
  `cuerda_inicio` tinyint(4) NOT NULL,
  `cuerda_fin` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acorde_digitacion`
--

CREATE TABLE `acorde_digitacion` (
  `id_digitacion` int(10) UNSIGNED NOT NULL,
  `id_acorde` int(10) UNSIGNED NOT NULL,
  `cuerda_6` tinyint(4) NOT NULL,
  `cuerda_5` tinyint(4) NOT NULL,
  `cuerda_4` tinyint(4) NOT NULL,
  `cuerda_3` tinyint(4) NOT NULL,
  `cuerda_2` tinyint(4) NOT NULL,
  `cuerda_1` tinyint(4) NOT NULL,
  `traste_inicial` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acorde_sincronizado`
--

CREATE TABLE `acorde_sincronizado` (
  `id_sincronia_acorde` int(11) NOT NULL,
  `id_cancion` int(11) NOT NULL,
  `id_acorde` int(11) NOT NULL,
  `tiempo_inicio` decimal(10,3) NOT NULL COMMENT 'Inicio del acorde (en segundos)',
  `tiempo_fin` decimal(10,3) NOT NULL COMMENT 'Fin del acorde (en segundos)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cancion`
--

CREATE TABLE `cancion` (
  `id_cancion` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `artista` varchar(255) NOT NULL,
  `album` varchar(255) DEFAULT NULL,
  `nivel` varchar(50) DEFAULT NULL,
  `duracion` int(11) DEFAULT 0,
  `hashtags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hashtags`)),
  `ruta_mp3` varchar(255) DEFAULT NULL,
  `ruta_imagen` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_lanzamiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cancion`
--

INSERT INTO `cancion` (`id_cancion`, `id_usuario`, `titulo`, `artista`, `album`, `nivel`, `duracion`, `hashtags`, `ruta_mp3`, `ruta_imagen`, `fecha_creacion`, `fecha_lanzamiento`) VALUES
(1, 2, 'Knockin\' On Heaven\'s Door', 'Bob Dylan', NULL, 'Principiante', 0, NULL, 'uploads/music/1764352890_BobDylan-KnockinOnHeavensDoorOfficialAudiorm9coqlk8fY.mp3', 'uploads/images/1764352890_img_ab67616d0000b2736c86683d20c72e3874c11c6d.jpeg', '2025-11-28 18:01:30', NULL),
(2, 2, 'Jamming', 'Bob Marley', NULL, 'Principiante', 0, NULL, 'uploads/music/1764358589_Jamming7kyg6F-E4fg.mp3', 'uploads/images/1764358589_img_ab67616d00001e0285b36be7fd94864efc4b008f.jpeg', '2025-11-28 19:36:29', NULL),
(3, 3, 'Talkin\' About a Revolution', 'Tracy Chapman', NULL, 'Principiante', 0, NULL, 'uploads/music/1764683572_TalkinBoutaRevolution.mp3', 'uploads/images/1764683572_img_ab67616d0000b27390b8a540137ee2a718a369f9.jpeg', '2025-12-02 13:52:52', NULL),
(4, 3, 'Kyoto', 'Phoebe Bridgers', NULL, 'Principiante', 0, NULL, 'uploads/music/1764867420_PhoebeBridgers-KyotoOfficialVideo.mp3', 'uploads/images/1764867420_img_81IawbPIhRL._UF8941000_QL80_.jpg', '2025-12-04 16:57:00', NULL),
(5, 3, 'Island Song', 'Ashley Eriksson', NULL, 'Intermedio', 0, NULL, 'uploads/music/1765111435_island_song.mp3', 'uploads/images/1765111435_island_song.jpeg', '2025-12-07 12:43:55', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cancion_carpeta`
--

CREATE TABLE `cancion_carpeta` (
  `id_cancion_carpeta` int(10) UNSIGNED NOT NULL,
  `id_carpeta` int(10) UNSIGNED NOT NULL,
  `id_cancion` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carpeta`
--

CREATE TABLE `carpeta` (
  `id_carpeta` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion_temporal`
--

CREATE TABLE `configuracion_temporal` (
  `id_cancion` int(11) NOT NULL COMMENT 'FK a la canción',
  `tempo_bpm` smallint(6) NOT NULL DEFAULT 120 COMMENT 'Beats Por Minuto (BPM)',
  `metrica_numerador` tinyint(4) NOT NULL DEFAULT 4 COMMENT 'Pulso superior de la métrica (ej. 4 en 4/4)',
  `metrica_denominador` tinyint(4) NOT NULL DEFAULT 4 COMMENT 'Pulso inferior de la métrica (ej. 4 en 4/4)',
  `beat_marker_inicio` decimal(10,3) NOT NULL DEFAULT 0.000 COMMENT 'Tiempo de inicio del primer Beat Marker (en segundos)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estrofa`
--

CREATE TABLE `estrofa` (
  `id_estrofa` int(10) UNSIGNED NOT NULL,
  `id_cancion` int(10) UNSIGNED NOT NULL,
  `texto` text NOT NULL,
  `orden` int(11) NOT NULL,
  `tiempo_inicio_segundos` decimal(10,3) DEFAULT NULL COMMENT 'Tiempo de inicio de la estrofa en segundos para sincronización.',
  `contenido` text NOT NULL,
  `tiempo_inicio` decimal(10,3) DEFAULT 0.000,
  `tiempo_fin` decimal(10,3) DEFAULT 0.000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `home_config`
--

CREATE TABLE `home_config` (
  `id_config` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `valor` varchar(255) NOT NULL,
  `titulo_mostrar` varchar(255) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `home_config`
--

INSERT INTO `home_config` (`id_config`, `tipo`, `valor`, `titulo_mostrar`, `orden`, `activo`) VALUES
(1, 'static', 'top_likes', 'Más Gustadas', 2, 1),
(2, 'static', 'recent', 'Nuevos Lanzamientos', 1, 1),
(3, 'hashtag', 'rock', 'Clásicos del Rock', 3, 1),
(4, 'hashtag', 'pop', 'Pop Actual', 4, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `like_cancion`
--

CREATE TABLE `like_cancion` (
  `id_like` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_cancion` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `like_cancion`
--

INSERT INTO `like_cancion` (`id_like`, `id_usuario`, `id_cancion`) VALUES
(14, 1, 3),
(9, 2, 4),
(13, 3, 3),
(7, 3, 4),
(12, 3, 5),
(11, 4, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `like_carpeta`
--

CREATE TABLE `like_carpeta` (
  `id_like_carpeta` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_carpeta` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patron_rasgueo`
--

CREATE TABLE `patron_rasgueo` (
  `id_patron` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL COMMENT 'Usuario que creó el patrón',
  `nombre` varchar(100) NOT NULL,
  `patron_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`patron_data`)),
  `duracion_pulsos` tinyint(4) NOT NULL COMMENT 'Duración del patrón en número de pulsos'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rasgueo_sincronizado`
--

CREATE TABLE `rasgueo_sincronizado` (
  `id_sincronia_rasgueo` int(11) NOT NULL,
  `id_cancion` int(11) NOT NULL,
  `id_patron` int(11) NOT NULL,
  `tiempo_inicio` decimal(10,3) NOT NULL COMMENT 'Inicio del bloque de rasgueo (en segundos)',
  `tiempo_fin` decimal(10,3) NOT NULL COMMENT 'Fin del bloque de rasgueo (en segundos)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguir_usuario`
--

CREATE TABLE `seguir_usuario` (
  `id_seguir` int(10) UNSIGNED NOT NULL,
  `id_usuario_seguidor` int(10) UNSIGNED NOT NULL,
  `id_usuario_seguido` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `bio` text DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `email`, `foto_perfil`, `password_hash`, `fecha_registro`, `bio`, `banner`, `rol`) VALUES
(1, 'hola', 'prueba@gmail.com', NULL, '$2y$10$QcuEDk6nHVkREfLwUxLSB.c36MYBElhNc23CuOLGkGwxmwGBnw1sa', '2025-11-28 12:53:57', NULL, NULL, 'admin'),
(2, 'alberto', 'alberto16166@gmail.com', NULL, '$2y$10$LB2XfP9TK/RqfVnMmNm0ROvXidtsE/PcFm3hALQnRN6Y0SlrzwYlC', '2025-11-28 12:54:23', NULL, NULL, 'admin'),
(3, 'alberto', 'alberto16166@alumnos.ilerna.com', 'uploads/avatars/1764682451_avatars_ProyectoEliminarfondo1.png', '$2y$10$YGafVC3K8G0lxWGQfJQooua0.EYe09WJvug/yLLiyDr3IxB.fTU2G', '2025-12-02 13:30:27', 'Amante de la música. Beginner Guitarist. Founder of Rechord\r\n', 'uploads/banners/1764683938_banners_me_header.png', 'admin'),
(4, 'albertospotifyjun15', 'albertospotifyjun15@gmail.com', 'uploads/avatars/1765110819_avatars_bad-bunny-1-41e695b929cc492c835376cfbf3504ae.jpg', '$2y$10$sj1.PyTnYqieUO/5WuGsUehWrYku6YBtU/3rqAGnNf4TszbF4fMaS', '2025-12-07 12:10:03', '', 'uploads/banners/1765110819_banners_hero.jpg', 'user');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acorde`
--
ALTER TABLE `acorde`
  ADD PRIMARY KEY (`id_acorde`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `acorde_cejilla`
--
ALTER TABLE `acorde_cejilla`
  ADD PRIMARY KEY (`id_cejilla`),
  ADD KEY `id_acorde` (`id_acorde`);

--
-- Indices de la tabla `acorde_digitacion`
--
ALTER TABLE `acorde_digitacion`
  ADD PRIMARY KEY (`id_digitacion`),
  ADD UNIQUE KEY `uk_acorde_digitacion` (`id_acorde`,`cuerda_6`,`cuerda_5`,`cuerda_4`,`cuerda_3`,`cuerda_2`,`cuerda_1`);

--
-- Indices de la tabla `acorde_sincronizado`
--
ALTER TABLE `acorde_sincronizado`
  ADD PRIMARY KEY (`id_sincronia_acorde`);

--
-- Indices de la tabla `cancion`
--
ALTER TABLE `cancion`
  ADD PRIMARY KEY (`id_cancion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `cancion_carpeta`
--
ALTER TABLE `cancion_carpeta`
  ADD PRIMARY KEY (`id_cancion_carpeta`),
  ADD UNIQUE KEY `uk_cancion_carpeta` (`id_carpeta`,`id_cancion`),
  ADD KEY `id_cancion` (`id_cancion`);

--
-- Indices de la tabla `carpeta`
--
ALTER TABLE `carpeta`
  ADD PRIMARY KEY (`id_carpeta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `configuracion_temporal`
--
ALTER TABLE `configuracion_temporal`
  ADD PRIMARY KEY (`id_cancion`),
  ADD UNIQUE KEY `id_cancion` (`id_cancion`);

--
-- Indices de la tabla `estrofa`
--
ALTER TABLE `estrofa`
  ADD PRIMARY KEY (`id_estrofa`),
  ADD KEY `fk_id_cancion_estrofa` (`id_cancion`);

--
-- Indices de la tabla `home_config`
--
ALTER TABLE `home_config`
  ADD PRIMARY KEY (`id_config`);

--
-- Indices de la tabla `like_cancion`
--
ALTER TABLE `like_cancion`
  ADD PRIMARY KEY (`id_like`),
  ADD UNIQUE KEY `uk_like_cancion` (`id_usuario`,`id_cancion`),
  ADD KEY `id_cancion` (`id_cancion`);

--
-- Indices de la tabla `like_carpeta`
--
ALTER TABLE `like_carpeta`
  ADD PRIMARY KEY (`id_like_carpeta`),
  ADD UNIQUE KEY `uk_like_carpeta` (`id_usuario`,`id_carpeta`),
  ADD KEY `id_carpeta` (`id_carpeta`);

--
-- Indices de la tabla `patron_rasgueo`
--
ALTER TABLE `patron_rasgueo`
  ADD PRIMARY KEY (`id_patron`);

--
-- Indices de la tabla `rasgueo_sincronizado`
--
ALTER TABLE `rasgueo_sincronizado`
  ADD PRIMARY KEY (`id_sincronia_rasgueo`);

--
-- Indices de la tabla `seguir_usuario`
--
ALTER TABLE `seguir_usuario`
  ADD PRIMARY KEY (`id_seguir`),
  ADD UNIQUE KEY `uk_seguir_usuario` (`id_usuario_seguidor`,`id_usuario_seguido`),
  ADD KEY `id_usuario_seguido` (`id_usuario_seguido`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `acorde`
--
ALTER TABLE `acorde`
  MODIFY `id_acorde` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `acorde_cejilla`
--
ALTER TABLE `acorde_cejilla`
  MODIFY `id_cejilla` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `acorde_digitacion`
--
ALTER TABLE `acorde_digitacion`
  MODIFY `id_digitacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `acorde_sincronizado`
--
ALTER TABLE `acorde_sincronizado`
  MODIFY `id_sincronia_acorde` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cancion`
--
ALTER TABLE `cancion`
  MODIFY `id_cancion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cancion_carpeta`
--
ALTER TABLE `cancion_carpeta`
  MODIFY `id_cancion_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carpeta`
--
ALTER TABLE `carpeta`
  MODIFY `id_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estrofa`
--
ALTER TABLE `estrofa`
  MODIFY `id_estrofa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `home_config`
--
ALTER TABLE `home_config`
  MODIFY `id_config` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `like_cancion`
--
ALTER TABLE `like_cancion`
  MODIFY `id_like` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `like_carpeta`
--
ALTER TABLE `like_carpeta`
  MODIFY `id_like_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `patron_rasgueo`
--
ALTER TABLE `patron_rasgueo`
  MODIFY `id_patron` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rasgueo_sincronizado`
--
ALTER TABLE `rasgueo_sincronizado`
  MODIFY `id_sincronia_rasgueo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `seguir_usuario`
--
ALTER TABLE `seguir_usuario`
  MODIFY `id_seguir` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `acorde_cejilla`
--
ALTER TABLE `acorde_cejilla`
  ADD CONSTRAINT `acorde_cejilla_ibfk_1` FOREIGN KEY (`id_acorde`) REFERENCES `acorde` (`id_acorde`) ON DELETE CASCADE;

--
-- Filtros para la tabla `acorde_digitacion`
--
ALTER TABLE `acorde_digitacion`
  ADD CONSTRAINT `acorde_digitacion_ibfk_1` FOREIGN KEY (`id_acorde`) REFERENCES `acorde` (`id_acorde`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cancion`
--
ALTER TABLE `cancion`
  ADD CONSTRAINT `cancion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cancion_carpeta`
--
ALTER TABLE `cancion_carpeta`
  ADD CONSTRAINT `cancion_carpeta_ibfk_1` FOREIGN KEY (`id_carpeta`) REFERENCES `carpeta` (`id_carpeta`) ON DELETE CASCADE,
  ADD CONSTRAINT `cancion_carpeta_ibfk_2` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `carpeta`
--
ALTER TABLE `carpeta`
  ADD CONSTRAINT `carpeta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `estrofa`
--
ALTER TABLE `estrofa`
  ADD CONSTRAINT `estrofa_ibfk_1` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_id_cancion_estrofa` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `like_cancion`
--
ALTER TABLE `like_cancion`
  ADD CONSTRAINT `like_cancion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `like_cancion_ibfk_2` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `like_carpeta`
--
ALTER TABLE `like_carpeta`
  ADD CONSTRAINT `like_carpeta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `like_carpeta_ibfk_2` FOREIGN KEY (`id_carpeta`) REFERENCES `carpeta` (`id_carpeta`) ON DELETE CASCADE;

--
-- Filtros para la tabla `seguir_usuario`
--
ALTER TABLE `seguir_usuario`
  ADD CONSTRAINT `seguir_usuario_ibfk_1` FOREIGN KEY (`id_usuario_seguidor`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `seguir_usuario_ibfk_2` FOREIGN KEY (`id_usuario_seguido`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
