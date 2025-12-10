-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-12-2025 a las 23:39:18
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
(3, 3, 'Talkin\' About a Revolution', 'Tracy Chapman', 'Tracy Chapman', 'Principiante', 162, '[\"Folk rock\",\"folk\",\"cantautora\",\"acoustic music\",\"m\\u00fasica protesta\",\"justicia social\",\"cr\\u00edtica social\",\"revoluci\\u00f3n\",\"empoderamiento\",\"lucha de clases\",\"desigualdad\",\"derechos civiles\",\"black artists\",\"mujer negra\",\"feminismo\",\"80s music\",\"m\\u00fasica 80s\",\"Tracy Chapman\",\"activismo\",\"esperanza\"]', 'uploads/music/1764683572_TalkinBoutaRevolution.mp3', 'uploads/images/1764683572_img_ab67616d0000b27390b8a540137ee2a718a369f9.jpeg', '2025-12-02 13:52:52', '1988-04-05'),
(4, 3, 'Kyoto', 'Phoebe Bridgers', 'Punisher', 'Principiante', 183, '[\"Indie rock\",\"pop rock\",\"garage rock\",\"indie folk\",\"canci\\u00f3n sobre gira\",\"Jap\\u00f3n\",\"Kyoto\",\"cultura pop\",\"conflicto familiar\",\"relaci\\u00f3n padre-hija\",\"sobriedad\",\"perd\\u00f3n\",\"ambivalencia\",\"autocr\\u00edtica\",\"humor negro\",\"angustia\",\"disociaci\\u00f3n\",\"s\\u00edndrome del impostor\",\"tour life\",\"nostalgia\"]', 'uploads/music/1764867420_PhoebeBridgers-KyotoOfficialVideo.mp3', 'uploads/images/1764867420_img_81IawbPIhRL._UF8941000_QL80_.jpg', '2025-12-04 16:57:00', '0000-00-00'),
(5, 3, 'Island Song', 'Ashley Eriksson', 'Adventure Time: Come Along with Me', 'Intermedio', 109, '[\"Pop atmosf\\u00e9rico\",\"indie pop\",\"folk melanc\\u00f3lico\",\"canci\\u00f3n de cuna\",\"nana\",\"m\\u00fasica relajante\",\"ambiental\",\"BSO\",\"banda sonora\",\"fin de la serie\",\"Hora de Aventura\",\"Adventure Time\",\"cr\\u00e9ditos finales\",\"melancol\\u00eda\",\"despedida\",\"amistad\",\"fin de una era\",\"dulce tristeza\",\"Cartoon Network\",\"Ashley Eriksson\"]', 'uploads/music/1765111435_island_song.mp3', 'uploads/images/1765111435_island_song.jpeg', '2025-12-07 12:43:55', '0000-00-00'),
(6, 3, 'Me gustas tú', 'Manu Chao', 'Próxima estación... Esperanza', 'Principiante', 240, '[\"salsa\",\"cantaautor\",\"reggea\",\"jazz\",\"Alterlatino\",\"pop latino\",\"dub\",\"world music\"]', 'uploads/music/1765114557_ManuChao-MeGustasTuOfficialAudio.mp3', 'uploads/images/1765125738_51amtE8PPBL._UF8941000_QL80_.jpg', '2025-12-07 13:35:57', '2001-06-05'),
(7, 3, 'Across the Universe', 'The Beatles', 'Let it be', 'Intermedio', 228, '[\"Acid folk\",\"pop\",\"pop psicod\\u00e9lico\",\"balada\",\"meditaci\\u00f3n\",\"espiritualidad hind\\u00fa\",\"John Lennon\",\"The Beatles\",\"mantra\",\"Jai Guru Deva Om\",\"cosmos\",\"universo\",\"paz interior\",\"desapego\",\"tristeza existencial\",\"esperanza\",\"contracultura\",\"movimiento hippie\",\"NASA\",\"canci\\u00f3n espacial\"]', 'uploads/music/1765125025_AcrossTheUniverseRemastered20091.mp3', 'uploads/images/1765125733_let_it_be.jpg', '2025-12-07 16:30:25', '1970-05-08'),
(8, 3, 'Yellow Submarine', 'The Beatles', 'Revolver', 'Principiante', 159, '[\"M\\u00fasica infantil\",\"Pop psicod\\u00e9lico\",\"pop\",\"canci\\u00f3n para ni\\u00f1os\",\"refugio feliz\",\"fantas\\u00eda\",\"imaginaci\\u00f3n\",\"camarader\\u00eda\",\"amistad\",\"paz\",\"unidad\",\"contracultura\",\"animaci\\u00f3n\",\"Ringo Starr\",\"The Beatles\",\"\\u00e1lbum Revolver\",\"\\u00e1lbum Yellow Submarine\"]', 'uploads/music/1765126369_YellowSubmarine.mp3', 'uploads/images/1765126369_revolver.jpg', '2025-12-07 16:52:49', '1966-08-05'),
(9, 3, 'Chan Chan', 'Buena Vista Social Club', 'Buena Vista Social Club', 'Principiante', 258, '[\"cubansongs\",\"soncubano\",\"buenavistasocialclub\",\"chanchansong\",\"worldmusic\",\"traditionalcubanmusic\",\"musicadecuba\",\"trova\",\"cubanmusiclegend\",\"compaysegundo\",\"latinmusic\",\"classiccuban\",\"acousticcuban\",\"havana\",\"bolero\"]', 'uploads/music/1765274059_chan_chan.mp3', 'uploads/images/1765274059_Buena_Vista_Social_Club.jpg', '2025-12-09 09:54:19', '1997-06-23'),
(10, 3, 'Jamming', 'Bob Marley', 'Exodus', 'Principiante', 213, '[\"reggae\",\"reggea\",\"bobmarley\",\"thewailers\",\"jamming\",\"rootsreggae\",\"rastavibes\",\"jamaica\",\"oneblood\",\"exodus\",\"legend\",\"oneove\",\"goodvibes\",\"chillreggae\",\"dubmusic\",\"m\\u00fasica\"]', 'uploads/music/1765282498_Bob_Marley__The_Wailers_Jamming.mp3', 'uploads/images/1765282498_71-MT-BR2uL.jpg', '2025-12-09 12:14:58', '1977-06-03'),
(11, 3, 'Help!', 'The Beatles', 'Help!', 'Intermedio', 139, '[\"\"]', 'uploads/music/1765285939_HelpRemastered2015.mp3', 'uploads/images/1765285939_027.00a05-Help-LP-e1674279798143.jpg', '2025-12-09 13:12:19', '1965-08-06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cancion_carpeta`
--

CREATE TABLE `cancion_carpeta` (
  `id_cancion_carpeta` int(10) UNSIGNED NOT NULL,
  `id_carpeta` int(10) UNSIGNED NOT NULL,
  `id_cancion` int(10) UNSIGNED NOT NULL,
  `orden` int(11) DEFAULT 0,
  `fecha_agregado` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cancion_carpeta`
--

INSERT INTO `cancion_carpeta` (`id_cancion_carpeta`, `id_carpeta`, `id_cancion`, `orden`, `fecha_agregado`) VALUES
(3, 3, 5, 0, '2025-12-07 17:02:31'),
(5, 4, 6, 0, '2025-12-07 17:10:19'),
(6, 3, 4, 1, '2025-12-07 18:26:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carpeta`
--

CREATE TABLE `carpeta` (
  `id_carpeta` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carpeta`
--

INSERT INTO `carpeta` (`id_carpeta`, `id_usuario`, `nombre`, `fecha_creacion`) VALUES
(3, 3, 'las que me sé', '2025-12-07 16:40:59'),
(4, 3, 'Reggea', '2025-12-07 17:07:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_conversaciones`
--

CREATE TABLE `chat_conversaciones` (
  `id_conversacion` int(11) NOT NULL,
  `fecha_ultima_actividad` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `chat_conversaciones`
--

INSERT INTO `chat_conversaciones` (`id_conversacion`, `fecha_ultima_actividad`) VALUES
(1, '2025-12-09 22:18:27'),
(2, '2025-12-09 22:23:04'),
(3, '2025-12-09 22:38:42'),
(4, '2025-12-09 22:33:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_mensajes`
--

CREATE TABLE `chat_mensajes` (
  `id_mensaje` int(11) NOT NULL,
  `id_conversacion` int(11) NOT NULL,
  `id_usuario_emisor` int(10) UNSIGNED NOT NULL,
  `contenido` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `leido` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `chat_mensajes`
--

INSERT INTO `chat_mensajes` (`id_mensaje`, `id_conversacion`, `id_usuario_emisor`, `contenido`, `fecha_envio`, `leido`) VALUES
(1, 1, 8, '¡Bienvenido a Rechord! Este es el canal oficial de soporte y notificaciones.', '2025-12-09 16:46:14', 1),
(2, 1, 3, 'esto es una prueba', '2025-12-09 22:18:27', 0),
(3, 2, 3, 'esto es una prueba', '2025-12-09 22:18:54', 0),
(4, 2, 3, 'mensaje de preuba', '2025-12-09 22:22:36', 0),
(5, 2, 3, 'mensaje de prueba', '2025-12-09 22:23:04', 0),
(6, 3, 8, 'Hola!', '2025-12-09 22:31:32', 0),
(7, 3, 8, 'Hola', '2025-12-09 22:33:11', 0),
(8, 4, 8, 'holaaa jaime', '2025-12-09 22:33:51', 0),
(9, 3, 8, 'Hola!', '2025-12-09 22:34:24', 0),
(10, 3, 8, 'Mensaje de prueba desde script', '2025-12-09 22:35:14', 0),
(11, 3, 8, 'Mensaje de prueba desde script', '2025-12-09 22:35:18', 0),
(12, 3, 8, 'Mensaje de prueba desde script', '2025-12-09 22:36:01', 0),
(13, 3, 8, 'Mensaje de prueba desde script', '2025-12-09 22:36:38', 0),
(14, 3, 8, 'Test message', '2025-12-09 22:37:40', 0),
(15, 3, 8, 'Test message', '2025-12-09 22:38:42', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_participantes`
--

CREATE TABLE `chat_participantes` (
  `id_participante` int(11) NOT NULL,
  `id_conversacion` int(11) NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `rol` enum('admin','user') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `chat_participantes`
--

INSERT INTO `chat_participantes` (`id_participante`, `id_conversacion`, `id_usuario`, `rol`) VALUES
(1, 1, 3, 'user'),
(2, 1, 8, 'user'),
(3, 2, 3, 'user'),
(4, 2, 4, 'user'),
(5, 3, 8, 'user'),
(6, 3, 4, 'user'),
(7, 4, 8, 'user'),
(8, 4, 5, 'user');

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

--
-- Volcado de datos para la tabla `estrofa`
--

INSERT INTO `estrofa` (`id_estrofa`, `id_cancion`, `texto`, `orden`, `tiempo_inicio_segundos`, `contenido`, `tiempo_inicio`, `tiempo_fin`) VALUES
(1, 9, '', 0, NULL, 'De Alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(2, 9, '', 1, NULL, 'De Alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(3, 9, '', 2, NULL, 'De Alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(4, 9, '', 3, NULL, 'El cariño que te tengo\r\nNo te lo puedo negar\r\nSe me sale la babita\r\nYo no lo puedo evitar', 0.000, 0.000),
(5, 9, '', 4, NULL, 'Cuando Juanica y Chan Chan\r\nEn el mar cernían arena\r\nComo sacudía el jibe\r\nA Chan Chan le daba pena', 0.000, 0.000),
(6, 9, '', 5, NULL, 'Limpia el camino de pajas\r\nQue yo me quiero sentar\r\nEn aquel tronco que veo\r\nY así no puedo llegar', 0.000, 0.000),
(7, 9, '', 6, NULL, 'De alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(8, 9, '', 7, NULL, 'De alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(9, 9, '', 8, NULL, 'De alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(10, 9, '', 9, NULL, 'De alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(11, 9, '', 10, NULL, 'De alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(12, 9, '', 11, NULL, 'De alto Cedro voy para Marcané\r\nLlego a Cueto, voy para Mayarí', 0.000, 0.000),
(20, 6, '', 0, NULL, '¿Qué horas son, mi corazón?\r\nTe lo dije bien clarito\r\nPermanece a la escucha\r\nPermanece a la escucha\r\nDoce de la noche en La Habana, Cuba\r\nOnce de la noche en San Salvador, El Salvador\r\nOnce de la noche en Managua, Nicaragua\r\nMe gustan los aviones, me gustas tú\r\nMe gusta viajar, me gustas tú\r\nMe gusta la mañana, me gustas tú\r\nMe gusta el viento, me gustas tú\r\nMe gusta soñar, me gustas tú\r\nMe gusta la mar, me gustas tú\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\nMe gusta la moto, me gustas tú\r\nMe gusta correr, me gustas tú\r\nMe gusta la lluvia, me gustas tú\r\nMe gusta volver, me gustas tú\r\nMe gusta marihuana, me gustas tú\r\nMe gusta colombiana, me gustas tú\r\nMe gusta la montaña, me gustas tú\r\nMe gusta la noche (me gustas tú)\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\nDoce, un minuto\r\nMe gusta la cena, me gustas tú\r\nMe gusta la vecina, me gustas tú (Radio Reloj)\r\nMe gusta su cocina, me gustas tú (una de la mañana)\r\nMe gusta camelar, me gustas tú\r\nMe gusta la guitarra, me gustas tú\r\nMe gusta el reggae, me gustas tú\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\nMe gusta la canela, me gustas tú\r\nMe gusta el fuego, me gustas tú\r\nMe gusta menear, me gustas tú\r\nMe gusta La Coruña, me gustas tú\r\nMe gusta Malasaña, me gustas tú\r\nMe gusta la castaña, me gustas tú\r\nMe gusta Guatemala, me gustas tú\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\nCuatro de la mañana\r\nA la bin, a la ban, a la bin-bon-bam\r\nA la bin, a la ban, a la bin-bon-bam\r\nObladí, obladá, obladí-da-da\r\nA la bin, a la ban, a la bin-bon-bam\r\nRadio Reloj\r\nCinco de la mañana\r\nNo todo lo que es oro brilla\r\nRemedio chino e infalible', 0.000, 0.000),
(22, 4, '', 0, NULL, 'Day off in Kyoto\r\nGot bored at the temple\r\nLooked around at the 7-Eleven\r\nThe band took the speed train\r\nWent to the arcade\r\nI wanted to go, but I didn\'t\r\nYou called me from a payphone\r\nThey still got payphones\r\nIt cost a dollar a minute\r\nTo tell me you\'re getting sober\r\nAnd you wrote me a letter\r\nBut I don\'t have to read it\r\nI\'m gonna kill you\r\nIf you don\'t beat me to it\r\nDreaming through Tokyo skies\r\nI wanted to see the world\r\nThen I flew over the ocean\r\nAnd I changed my mind (woo)\r\nSunset\'s been a freak show\r\nOn the weekend, so\r\nI\'ve been driving out to the suburbs\r\nTo park at the Goodwill\r\nAnd stare at the chemtrails\r\nWith my little brother\r\nHe said you called on his birthday\r\nYou were off by like ten days\r\nBut you get a few points for tryin\'\r\nRemember getting the truck fixed\r\nWhen you let us drive it\r\nTwenty-five felt like flying\r\nI don\'t forgive you\r\nBut please don\'t hold me to it\r\nBorn under Scorpio skies\r\nI wanted to see the world\r\nThrough your eyes until it happened\r\nThen I changed my mind\r\nGuess I lied\r\nI\'m a liar\r\nWho lies\r\n\'Cause I\'m a liar', 0.000, 0.000),
(23, 8, '', 0, NULL, 'In the town where I was born\r\nLived a man who sailed to sea\r\nAnd he told us of his life\r\nIn the land of submarines', 0.000, 0.000),
(24, 8, '', 1, NULL, '\"So, we sailed on to the sun\r\n\'Til we found a sea of green\r\nAnd we lived beneath the waves\r\nIn our yellow submarine\"', 0.000, 0.000),
(25, 8, '', 2, NULL, 'We all live in a yellow submarine\r\nYellow submarine, yellow submarine\r\nWe all live in a yellow submarine\r\nYellow submarine, yellow submarine', 0.000, 0.000),
(26, 8, '', 3, NULL, '\"And our friends are all aboard\r\nMany more of them live next door\r\nAnd the band begins to play\"', 0.000, 0.000),
(27, 8, '', 4, NULL, 'We all live in a yellow submarine\r\nYellow submarine, yellow submarine', 0.000, 0.000),
(28, 8, '', 5, NULL, 'We all live in a yellow submarine\r\nYellow submarine, yellow submarine', 0.000, 0.000),
(29, 8, '', 6, NULL, '\"As we live a life of ease (a life of ease)\r\nEvery one of us (every one of us)\r\nHas all we need (has all we need)\r\nSky of blue (sky of blue)\r\nAnd sea of green (sea of green)\r\nIn our yellow (in our yellow)\r\nSubmarine\" (submarine, aha)\r\nWe all live in a yellow submarine\r\nA yellow submarine, yellow submarine\r\nWe all live in a yellow submarine\r\nA yellow submarine, yellow submarine\r\nWe all live in a yellow submarine\r\nYellow submarine, yellow submarine\r\nWe all live in a yellow submarine\r\nYellow submarine, yellow submarine', 0.000, 0.000),
(31, 10, '', 0, NULL, 'Ooh, yeah! All right!\r\nAlright.\r\nWe\'re jammin\'\r\n(see)\r\nI wanna jam it wid you\r\nWe\'re jammin\', jammin\',\r\nAnd I hope you like jammin\', too\r\nWe\'re jammin\'\r\nTo think that jammin\' was a thing of the past\r\nWe\'re jammin\',\r\nAnd I hope this jam is gonna last\r\nWe\'re jammin\'\r\nJammin\'\r\nJammin\'\r\nJammin\'\r\nJammin\'\r\nNow we\'re jammin\' in the name of the Lord\r\nWe\'re jammin\',\r\nJammin\'\r\nJammin\'\r\nJammin\'\r\nNow we\'re jammin\' right straight from yard\r\nOoh, yeah!\r\nWe\'re jammin\'\r\nI wanna jam it wid you\r\nWe\'re jammin\', jammin\',\r\nAnd I hope you like jammin\', too\r\nJam\'s about my pride and truth I cannot hide\r\nTo keep you satisfied\r\nLove that now exist, true love I can\'t resist,\r\nJam by my side. Oh, yea-ea-yeah!\r\nWe\'re jammin\'\r\n(see)\r\nI wanna jam it wid you\r\nWe\'re jammin\', jammin\',\r\nAnd I hope you like jammin\', too\r\nWe\'re jammin\'\r\nTo think that jammin\' was a thing of the past\r\nWe\'re jammin\',\r\nAnd I hope this jam is gonna last\r\nWe\'re jammin\'\r\nJammin\'\r\nJammin\'\r\nJammin\'\r\nNow we\'re jammin\' in the name of the Lord\r\nWe\'re jammin\',\r\nJammin\'\r\nJammin\'\r\nJammin\'\r\nNow we\'re jammin\' right straight from yard\r\nOoh, yeah!\r\nWe\'re jammin\'\r\nI wanna jam it wid you\r\nWe\'re jammin\', jammin\',\r\nAnd I hope you like jammin\', too\r\nWe\'re jammin\',\r\nJammin\'\r\nJammin\'\r\nJammin\'\r\nI wanna jam it wid you\r\nWe\'re jammin\', jammin\',\r\nAnd I hope you like jammin\', too\r\nWe\'re jammin\',\r\nWe\'re jammin\',\r\n(see)\r\nWe\'re jammin\',\r\nWe\'re jammin\',\r\nOh yeah!', 0.000, 0.000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hero_videos`
--

CREATE TABLE `hero_videos` (
  `id_hero` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `ruta_video` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 0,
  `orden` int(11) DEFAULT 0,
  `fecha_subida` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hero_videos`
--

INSERT INTO `hero_videos` (`id_hero`, `titulo`, `ruta_video`, `activo`, `orden`, `fecha_subida`) VALUES
(4, 'Clipto AI video downloader_Bad Gyal - Da Me (Official Video)', 'uploads/hero_videos/1765293826_CliptoAIvideodownloaderBadGyalDaMeOfficialVideo.mp4', 1, 0, '2025-12-09 16:23:46'),
(7, 'Bob Marley & The Wailers - Jamming (Official Music Video)', 'uploads/hero_videos/1765296657_BobMarleyTheWailersJammingOfficialMusicVideo.mp4', 1, 0, '2025-12-09 17:10:57');

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
(1, 'static', 'top_likes', 'Más Gustadas', 1, 1),
(2, 'static', 'recent', 'Últimos lanzamientos', 2, 1),
(3, 'hashtag', 'rock', 'Clásicos del Rock', 5, 0),
(4, 'hashtag', 'pop', 'Pop', 3, 1),
(6, 'hashtag', 'reggea', 'Reggea', 4, 1);

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
(13, 3, 3),
(18, 3, 4),
(12, 3, 5),
(25, 3, 6),
(15, 3, 7),
(26, 3, 8),
(27, 3, 9),
(28, 3, 10),
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
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `mensaje` text NOT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
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
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE `salas` (
  `id_sala` int(11) NOT NULL,
  `codigo_sala` varchar(10) NOT NULL,
  `id_maestro` int(10) UNSIGNED NOT NULL,
  `current_song_id` int(10) UNSIGNED DEFAULT NULL,
  `current_position` float DEFAULT 0,
  `is_playing` tinyint(1) DEFAULT 0,
  `estado` enum('activa','cerrada') DEFAULT 'activa',
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT INTO `salas` (`id_sala`, `codigo_sala`, `id_maestro`, `current_song_id`, `current_position`, `is_playing`, `estado`, `fecha_creacion`) VALUES
(1, '49B0BB', 3, NULL, 0, 0, 'activa', '2025-12-08 12:14:06'),
(2, '269AB6', 5, NULL, 0, 0, 'activa', '2025-12-08 12:15:01'),
(3, 'A867CE', 3, NULL, 0, 0, 'activa', '2025-12-08 12:17:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguir_usuario`
--

CREATE TABLE `seguir_usuario` (
  `id_seguir` int(10) UNSIGNED NOT NULL,
  `id_usuario_seguidor` int(10) UNSIGNED NOT NULL,
  `id_usuario_seguido` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seguir_usuario`
--

INSERT INTO `seguir_usuario` (`id_seguir`, `id_usuario_seguidor`, `id_usuario_seguido`) VALUES
(2, 3, 4),
(5, 5, 3);

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
(3, 'alberto', 'alberto16166@alumnos.ilerna.com', 'uploads/avatars/1764682451_avatars_ProyectoEliminarfondo1.png', '$2y$10$YGafVC3K8G0lxWGQfJQooua0.EYe09WJvug/yLLiyDr3IxB.fTU2G', '2025-12-02 13:30:27', 'Amante de la música. Beginner Guitarist. Founder of Rechord\r\n', 'uploads/banners/1764683938_banners_me_header.png', 'admin'),
(4, 'albertospotifyjun15', 'albertospotifyjun15@gmail.com', 'uploads/avatars/1765110819_avatars_bad-bunny-1-41e695b929cc492c835376cfbf3504ae.jpg', '$2y$10$sj1.PyTnYqieUO/5WuGsUehWrYku6YBtU/3rqAGnNf4TszbF4fMaS', '2025-12-07 12:10:03', '', 'uploads/banners/1765110819_banners_hero.jpg', 'user'),
(5, 'esteponcio', 'jaimeestgom@gmail.com', 'uploads/avatars/1765149556_avatars_8268c2d351c1ec3.png', '$2y$10$y6ftuCpWXEv19eDcejhb1ubJnn7NFZmHB3nvIsNyz2fevMWzIBOWu', '2025-12-07 23:15:40', '', 'uploads/banners/1765149480_banners_71rzlQ2XMOL.jpg', 'user'),
(6, 'Taylor Jones', 'taylor@gmail.com', 'uploads/avatars/1765283478_avatars_istockphoto-1485546774-612x612.jpg', '$2y$10$qa6XgZizacKzSIwU4EpBKeeRlbxhW92kfmlxAMrA4ghBzN9jWK3lO', '2025-12-09 12:28:58', '', NULL, 'user'),
(7, 'Sergio Montes', 'smontes@ilerna.com', NULL, '$2y$10$7e8GzvguXk9TCcfM0cpppOOhigsBlA8d0.tAoL74lwYyQJ./fgCJ2', '2025-12-09 12:59:42', NULL, NULL, 'user'),
(8, 'Rechord', 'admin@rechord.com', 'assets/images/rechord-logo.png', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2025-12-09 16:45:11', NULL, NULL, 'admin');

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
-- Indices de la tabla `chat_conversaciones`
--
ALTER TABLE `chat_conversaciones`
  ADD PRIMARY KEY (`id_conversacion`);

--
-- Indices de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  ADD PRIMARY KEY (`id_mensaje`),
  ADD KEY `id_usuario_emisor` (`id_usuario_emisor`),
  ADD KEY `idx_chat_mensajes_conversacion` (`id_conversacion`);

--
-- Indices de la tabla `chat_participantes`
--
ALTER TABLE `chat_participantes`
  ADD PRIMARY KEY (`id_participante`),
  ADD KEY `id_conversacion` (`id_conversacion`),
  ADD KEY `idx_chat_participantes_usuario` (`id_usuario`);

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
-- Indices de la tabla `hero_videos`
--
ALTER TABLE `hero_videos`
  ADD PRIMARY KEY (`id_hero`);

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
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario` (`id_usuario`);

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
-- Indices de la tabla `salas`
--
ALTER TABLE `salas`
  ADD PRIMARY KEY (`id_sala`),
  ADD UNIQUE KEY `codigo_sala` (`codigo_sala`),
  ADD KEY `id_maestro` (`id_maestro`),
  ADD KEY `current_song_id` (`current_song_id`);

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
  MODIFY `id_cancion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `cancion_carpeta`
--
ALTER TABLE `cancion_carpeta`
  MODIFY `id_cancion_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `carpeta`
--
ALTER TABLE `carpeta`
  MODIFY `id_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `chat_conversaciones`
--
ALTER TABLE `chat_conversaciones`
  MODIFY `id_conversacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `chat_participantes`
--
ALTER TABLE `chat_participantes`
  MODIFY `id_participante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `estrofa`
--
ALTER TABLE `estrofa`
  MODIFY `id_estrofa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `hero_videos`
--
ALTER TABLE `hero_videos`
  MODIFY `id_hero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `home_config`
--
ALTER TABLE `home_config`
  MODIFY `id_config` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `like_cancion`
--
ALTER TABLE `like_cancion`
  MODIFY `id_like` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `like_carpeta`
--
ALTER TABLE `like_carpeta`
  MODIFY `id_like_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `seguir_usuario`
--
ALTER TABLE `seguir_usuario`
  MODIFY `id_seguir` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
-- Filtros para la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  ADD CONSTRAINT `chat_mensajes_ibfk_1` FOREIGN KEY (`id_conversacion`) REFERENCES `chat_conversaciones` (`id_conversacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_mensajes_ibfk_2` FOREIGN KEY (`id_usuario_emisor`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `chat_participantes`
--
ALTER TABLE `chat_participantes`
  ADD CONSTRAINT `chat_participantes_ibfk_1` FOREIGN KEY (`id_conversacion`) REFERENCES `chat_conversaciones` (`id_conversacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_participantes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

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
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `salas`
--
ALTER TABLE `salas`
  ADD CONSTRAINT `salas_ibfk_1` FOREIGN KEY (`id_maestro`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `salas_ibfk_2` FOREIGN KEY (`current_song_id`) REFERENCES `cancion` (`id_cancion`) ON DELETE SET NULL;

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
