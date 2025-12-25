-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-12-2025 a las 15:13:02
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
  `fecha_lanzamiento` date DEFAULT NULL,
  `bpm` int(11) NOT NULL DEFAULT 120,
  `metrica_numerador` tinyint(4) NOT NULL DEFAULT 4,
  `metrica_denominador` tinyint(4) NOT NULL DEFAULT 4,
  `beat_marker` text DEFAULT NULL COMMENT 'JSON array of grid regions [{start, end}]',
  `subdivision` varchar(10) DEFAULT '1/4' COMMENT 'Subdivisión del grid (1/4, 1/8, etc.)',
  `velocity` tinyint(3) UNSIGNED DEFAULT 100 COMMENT 'Velocidad MIDI por defecto',
  `acordes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cancion`
--

INSERT INTO `cancion` (`id_cancion`, `id_usuario`, `titulo`, `artista`, `album`, `nivel`, `duracion`, `hashtags`, `ruta_mp3`, `ruta_imagen`, `fecha_creacion`, `fecha_lanzamiento`, `bpm`, `metrica_numerador`, `metrica_denominador`, `beat_marker`, `subdivision`, `velocity`, `acordes`) VALUES
(3, 3, 'Talkin\' About a Revolution', 'Tracy Chapman', 'Tracy Chapman', 'Principiante', 162, '[\"Folk rock\",\"folk\",\"cantautora\",\"acoustic music\",\"m\\u00fasica protesta\",\"justicia social\",\"cr\\u00edtica social\",\"revoluci\\u00f3n\",\"empoderamiento\",\"lucha de clases\",\"desigualdad\",\"derechos civiles\",\"black artists\",\"mujer negra\",\"feminismo\",\"80s music\",\"m\\u00fasica 80s\",\"Tracy Chapman\",\"activismo\",\"esperanza\"]', 'uploads/music/1764683572_TalkinBoutaRevolution.mp3', 'uploads/images/1764683572_img_ab67616d0000b27390b8a540137ee2a718a369f9.jpeg', '2025-12-02 13:52:52', '1988-04-05', 120, 4, 4, '[]', '1/4', 100, '[{\"chordName\":\"Cadd9\",\"startFret\":3,\"fingers\":{\"6-3\":true,\"5-3\":true,\"3-2\":true,\"2-3\":true},\"barre\":null},{\"chordName\":\"G\",\"startFret\":3,\"fingers\":{\"6-3\":true,\"5-3\":true,\"2-2\":true,\"1-3\":true},\"barre\":null},{\"chordName\":\"Em\",\"startFret\":3,\"fingers\":{\"2-2\":true,\"3-2\":true},\"barre\":null},{\"chordName\":\"D\",\"startFret\":3,\"fingers\":{\"6-2\":true,\"5-3\":true,\"4-2\":true},\"barre\":null},{\"chordName\":\"Dsus4\",\"startFret\":3,\"fingers\":{\"6-3\":true,\"5-3\":true,\"4-2\":true},\"barre\":null}]'),
(4, 3, 'Kyoto', 'Phoebe Bridgers', 'Punisher', 'Principiante', 183, '[\"Indie rock\",\"pop rock\",\"garage rock\",\"indie folk\",\"canci\\u00f3n sobre gira\",\"Jap\\u00f3n\",\"Kyoto\",\"cultura pop\",\"conflicto familiar\",\"relaci\\u00f3n padre-hija\",\"sobriedad\",\"perd\\u00f3n\",\"ambivalencia\",\"autocr\\u00edtica\",\"humor negro\",\"angustia\",\"disociaci\\u00f3n\",\"s\\u00edndrome del impostor\",\"tour life\",\"nostalgia\"]', 'uploads/music/1764867420_PhoebeBridgers-KyotoOfficialVideo.mp3', 'uploads/images/1764867420_img_81IawbPIhRL._UF8941000_QL80_.jpg', '2025-12-04 16:57:00', '0000-00-00', 131, 4, 4, '[{\"start\":8.358683716422748,\"end\":179.35082418132185}]', '1/2', 100, '[{\"chordName\":\"Sol\",\"startFret\":1,\"fingers\":{\"5-3\":true,\"6-3\":true,\"2-2\":true,\"1-3\":true},\"barre\":null}]'),
(5, 3, 'Island Song', 'Ashley Eriksson', 'Adventure Time: Come Along with Me', 'Intermedio', 109, '[\"Pop atmosférico\",\"indie pop\",\"folk melancólico\",\"canción de cuna\",\"nana\",\"música relajante\",\"ambiental\",\"BSO\",\"banda sonora\",\"fin de la serie\",\"Hora de Aventura\",\"Adventure Time\",\"créditos finales\",\"melancolía\",\"despedida\",\"amistad\",\"fin de una era\",\"dulce tristeza\",\"Cartoon Network\",\"Ashley Eriksson\"]', 'uploads/music/1765111435_island_song.mp3', 'uploads/images/1765111435_island_song.jpeg', '2025-12-07 12:43:55', '0000-00-00', 120, 4, 4, '[{\"start\":1.7020050467254275,\"end\":106.11048466314998}]', '1/2', 100, NULL),
(6, 3, 'Me gustas tú', 'Manu Chao', 'Próxima estación... Esperanza', 'Principiante', 240, '[\"salsa\",\"cantaautor\",\"reggea\",\"jazz\",\"Alterlatino\",\"pop latino\",\"dub\",\"world music\"]', 'uploads/music/1765114557_ManuChao-MeGustasTuOfficialAudio.mp3', 'uploads/images/1765125738_51amtE8PPBL._UF8941000_QL80_.jpg', '2025-12-07 13:35:57', '2001-06-05', 120, 4, 4, '0.000', '1/4', 100, NULL),
(7, 3, 'Across the Universe', 'The Beatles', 'Let it be', 'Intermedio', 228, '[\"Acid folk\",\"pop\",\"pop psicod\\u00e9lico\",\"balada\",\"meditaci\\u00f3n\",\"espiritualidad hind\\u00fa\",\"John Lennon\",\"The Beatles\",\"mantra\",\"Jai Guru Deva Om\",\"cosmos\",\"universo\",\"paz interior\",\"desapego\",\"tristeza existencial\",\"esperanza\",\"contracultura\",\"movimiento hippie\",\"NASA\",\"canci\\u00f3n espacial\"]', 'uploads/music/1765125025_AcrossTheUniverseRemastered20091.mp3', 'uploads/images/1765125733_let_it_be.jpg', '2025-12-07 16:30:25', '1970-05-08', 120, 4, 4, '0.000', '1/4', 100, NULL),
(8, 3, 'Yellow Submarine', 'The Beatles', 'Revolver', 'Principiante', 159, '[\"M\\u00fasica infantil\",\"Pop psicod\\u00e9lico\",\"pop\",\"canci\\u00f3n para ni\\u00f1os\",\"refugio feliz\",\"fantas\\u00eda\",\"imaginaci\\u00f3n\",\"camarader\\u00eda\",\"amistad\",\"paz\",\"unidad\",\"contracultura\",\"animaci\\u00f3n\",\"Ringo Starr\",\"The Beatles\",\"\\u00e1lbum Revolver\",\"\\u00e1lbum Yellow Submarine\"]', 'uploads/music/1765126369_YellowSubmarine.mp3', 'uploads/images/1765126369_revolver.jpg', '2025-12-07 16:52:49', '1966-08-05', 110, 4, 4, '9.967', '1/4', 100, NULL),
(9, 3, 'Chan Chan', 'Buena Vista Social Club', 'Buena Vista Social Club', 'Principiante', 258, '[\"cubansongs\",\"soncubano\",\"buenavistasocialclub\",\"chanchansong\",\"worldmusic\",\"traditionalcubanmusic\",\"musicadecuba\",\"trova\",\"cubanmusiclegend\",\"compaysegundo\",\"latinmusic\",\"classiccuban\",\"acousticcuban\",\"havana\",\"bolero\"]', 'uploads/music/1765274059_chan_chan.mp3', 'uploads/images/1765274059_Buena_Vista_Social_Club.jpg', '2025-12-09 09:54:19', '1997-06-23', 83, 4, 4, '1.094', '1/4', 100, NULL),
(10, 3, 'Jamming', 'Bob Marley', 'Exodus', 'Principiante', 213, '[\"reggae\",\"reggea\",\"bobmarley\",\"thewailers\",\"jamming\",\"rootsreggae\",\"rastavibes\",\"jamaica\",\"oneblood\",\"exodus\",\"legend\",\"oneove\",\"goodvibes\",\"chillreggae\",\"dubmusic\",\"m\\u00fasica\"]', 'uploads/music/1765282498_Bob_Marley__The_Wailers_Jamming.mp3', 'uploads/images/1765282498_71-MT-BR2uL.jpg', '2025-12-09 12:14:58', '1977-06-03', 124, 4, 4, '[{\"start\":2.8436255132547954,\"end\":101.85093536936938}]', '1/2', 100, NULL),
(11, 3, 'Help!', 'The Beatles', 'Help!', 'Intermedio', 139, '[\"\"]', 'uploads/music/1765285939_HelpRemastered2015.mp3', 'uploads/images/1765285939_027.00a05-Help-LP-e1674279798143.jpg', '2025-12-09 13:12:19', '1965-08-06', 120, 4, 4, '0.000', '1/4', 100, NULL),
(12, 3, 'Knockin\' On Heaven\'s Door', 'Bob Dylan', 'Pat Garrett ', 'Principiante', 151, '[\"\",\"cantautor\",\"feo\",\"\"]', 'uploads/music/1765357670_1764352890_BobDylan-KnockinOnHeavensDoorOfficialAudiorm9coqlk8fY.mp3', 'uploads/images/1765357670_1764352890_img_ab67616d0000b2736c86683d20c72e3874c11c6d.jpeg', '2025-12-10 09:07:50', '1973-01-13', 120, 4, 4, '0.000', '1/4', 100, NULL);

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
(6, 3, 4, 1, '2025-12-07 18:26:14'),
(8, 3, 7, 2, '2025-12-10 03:35:50'),
(9, 5, 10, 0, '2025-12-10 10:04:06'),
(10, 5, 7, 1, '2025-12-10 10:04:16'),
(11, 4, 9, 1, '2025-12-11 15:03:14'),
(12, 3, 9, 3, '2025-12-11 15:03:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cancion_fondos`
--

CREATE TABLE `cancion_fondos` (
  `id_fondo` int(11) NOT NULL,
  `id_cancion` int(10) UNSIGNED NOT NULL,
  `ruta_fondo` varchar(255) NOT NULL,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cancion_fondos`
--

INSERT INTO `cancion_fondos` (`id_fondo`, `id_cancion`, `ruta_fondo`, `orden`) VALUES
(2, 5, 'uploads/backgrounds/bg_5_693c571e7734c.png', 0),
(3, 5, 'uploads/backgrounds/bg_5_693c57219760d.jpeg', 0),
(4, 5, 'uploads/backgrounds/bg_5_693c5725a3ce2.jpeg', 0),
(5, 5, 'uploads/backgrounds/bg_5_693c572a991d0.gif', 0),
(6, 5, 'uploads/backgrounds/bg_5_693c572e6d7c9.webp', 0),
(7, 10, 'uploads/backgrounds/bg_10_693c5f4215017.gif', 0);

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
(4, 3, 'nombre carpeta', '2025-12-07 17:07:58'),
(5, 4, 'las canciones que me se', '2025-12-10 10:03:44');

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
(2, '2025-12-10 02:43:35'),
(3, '2025-12-09 22:55:34'),
(4, '2025-12-09 22:33:51'),
(5, '2025-12-10 09:15:34');

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
(4, 3, 4, 'Hola, querría comunicar un error!', '2025-12-09 22:55:34', 0),
(5, 2, 3, 'alioli', '2025-12-10 02:43:35', 1),
(6, 5, 3, 'hola!', '2025-12-10 09:15:34', 1);

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
(3, 2, 3, 'user'),
(4, 2, 4, 'user'),
(6, 3, 4, 'user'),
(8, 4, 5, 'user'),
(9, 5, 3, 'user'),
(10, 5, 7, 'user');

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
(20, 6, '', 0, NULL, '¿Qué horas son, mi corazón?\r\nTe lo dije bien clarito\r\nPermanece a la escucha\r\nPermanece a la escucha\r\nDoce de la noche en La Habana, Cuba\r\nOnce de la noche en San Salvador, El Salvador\r\nOnce de la noche en Managua, Nicaragua\r\nMe gustan los aviones, me gustas tú\r\nMe gusta viajar, me gustas tú\r\nMe gusta la mañana, me gustas tú\r\nMe gusta el viento, me gustas tú\r\nMe gusta soñar, me gustas tú\r\nMe gusta la mar, me gustas tú\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\nMe gusta la moto, me gustas tú\r\nMe gusta correr, me gustas tú\r\nMe gusta la lluvia, me gustas tú\r\nMe gusta volver, me gustas tú\r\nMe gusta marihuana, me gustas tú\r\nMe gusta colombiana, me gustas tú\r\nMe gusta la montaña, me gustas tú\r\nMe gusta la noche (me gustas tú)\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\nDoce, un minuto\r\nMe gusta la cena, me gustas tú\r\nMe gusta la vecina, me gustas tú (Radio Reloj)\r\nMe gusta su cocina, me gustas tú (una de la mañana)\r\nMe gusta camelar, me gustas tú\r\nMe gusta la guitarra, me gustas tú\r\nMe gusta el reggae, me gustas tú\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\nMe gusta la canela, me gustas tú\r\nMe gusta el fuego, me gustas tú\r\nMe gusta menear, me gustas tú\r\nMe gusta La Coruña, me gustas tú\r\nMe gusta Malasaña, me gustas tú\r\nMe gusta la castaña, me gustas tú\r\nMe gusta Guatemala, me gustas tú\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\n¿Qué voy a hacer? Je ne sais pas\r\n¿Qué voy a hacer? Je ne sais plus\r\n¿Qué voy a hacer? Je suis perdu\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\n¿Qué horas son, mi corazón?\r\nCuatro de la mañana\r\nA la bin, a la ban, a la bin-bon-bam\r\nA la bin, a la ban, a la bin-bon-bam\r\nObladí, obladá, obladí-da-da\r\nA la bin, a la ban, a la bin-bon-bam\r\nRadio Reloj\r\nCinco de la mañana\r\nNo todo lo que es oro brilla\r\nRemedio chino e infalible', 0.000, 0.000),
(38, 7, '', 0, NULL, 'Words are flowing out like endless rain into a paper cup', 0.000, 0.000),
(39, 7, '', 1, NULL, 'They slither wildly as they slip away across the universe', 0.000, 0.000),
(40, 7, '', 2, NULL, 'Pools of sorrow, waves of joy are drifting through my opened mind', 0.000, 0.000),
(41, 7, '', 3, NULL, 'Possessing and caressing me', 0.000, 0.000),
(42, 7, '', 4, NULL, 'जय गुरु देव, ॐ', 0.000, 0.000),
(43, 7, '', 5, NULL, 'Nothing\'s gonna change my world', 0.000, 0.000),
(44, 7, '', 6, NULL, 'Nothing\'s gonna change my world', 0.000, 0.000),
(45, 7, '', 7, NULL, 'Nothing\'s gonna change my world', 0.000, 0.000),
(46, 7, '', 8, NULL, 'Nothing\'s gonna change my world', 0.000, 0.000),
(47, 7, '', 9, NULL, 'Images of broken light which dance before me like a million eyes', 0.000, 0.000),
(48, 7, '', 10, NULL, 'They call me on and on across the universe', 0.000, 0.000),
(49, 7, '', 11, NULL, 'Thoughts meander like a restless wind inside a letterbox\r\nThey tumble blindly as they make their way across the universe\r\nजय गुरु देव, ॐ\r\nNothing\'s gonna change my world\r\nNothing\'s gonna change my world\r\nNothing\'s gonna change my world\r\nNothing\'s gonna change my world\r\nSounds of laughter, shades of life are ringing\r\nThrough my open ears, inciting and inviting me\r\nLimitless undying love which shines around me like a million suns\r\nIt calls me on and on across the universe\r\nजय गुरु देव, ॐ\r\nNothing\'s gonna change my world\r\nNothing\'s gonna change my world\r\nNothing\'s gonna change my world\r\nNothing\'s gonna change my world\r\nजय गुरु देव\r\nजय गुरु देव\r\nजय गुरु देव\r\nजय गुरु देव\r\nजय गुरु देव', 0.000, 0.000),
(50, 9, '', 0, NULL, 'De Alto Cedro voy para Marcané', 18.900, 22.273),
(51, 9, '', 1, NULL, 'Llego a Cueto, voy para Mayarí', 22.273, 25.100),
(52, 9, '', 2, NULL, 'De Alto Cedro voy para Marcané', 31.000, 33.681),
(53, 9, '', 3, NULL, 'Llego a Cueto, voy para Mayarí', 34.272, 37.231),
(54, 9, '', 4, NULL, 'De Alto Cedro voy para Marcané', 42.949, 46.140),
(55, 9, '', 5, NULL, 'Llego a Cueto, voy para Mayarí', 46.140, 49.076),
(56, 9, '', 6, NULL, 'El cariño que te tengo', 61.006, 63.869),
(57, 9, '', 7, NULL, 'No te lo puedo negar', 63.918, 66.443),
(58, 9, '', 8, NULL, 'Se me sale la babita', 66.693, 69.581),
(59, 9, '', 9, NULL, 'Yo no lo puedo evitar', 69.694, 72.461),
(60, 9, '', 10, NULL, 'Cuando Juanica y Chan Chan', 84.300, 87.000),
(61, 9, '', 11, NULL, 'En el mar cernían arena', 87.400, 90.400),
(62, 9, '', 12, NULL, 'Como sacudía el jibe', 90.600, 94.600),
(63, 9, '', 13, NULL, 'A Chan Chan le daba pena', 100.800, 104.800),
(64, 9, '', 14, NULL, 'Limpia el camino de pajas', 105.300, 109.300),
(65, 9, '', 15, NULL, 'Que yo me quiero sentar', 109.800, 113.800),
(66, 9, '', 16, NULL, 'En aquel tronco que veo', 114.300, 118.300),
(67, 9, '', 17, NULL, 'Y así no puedo llegar', 118.800, 122.800),
(68, 9, '', 18, NULL, 'De alto Cedro voy para Marcané', 123.300, 127.300),
(69, 9, '', 19, NULL, 'Llego a Cueto, voy para Mayarí', 127.800, 131.800),
(70, 9, '', 20, NULL, 'De alto Cedro voy para Marcané', 132.300, 136.300),
(71, 9, '', 21, NULL, 'Llego a Cueto, voy para Mayarí', 136.800, 140.800),
(72, 9, '', 22, NULL, 'De alto Cedro voy para Marcané', 141.300, 145.300),
(73, 9, '', 23, NULL, 'Llego a Cueto, voy para Mayarí', 145.800, 149.800),
(74, 9, '', 24, NULL, 'De alto Cedro voy para Marcané', 150.300, 154.300),
(75, 9, '', 25, NULL, 'Llego a Cueto, voy para Mayarí', 154.800, 158.800),
(76, 9, '', 26, NULL, 'De alto Cedro voy para Marcané', 159.300, 163.300),
(77, 9, '', 27, NULL, 'Llego a Cueto, voy para Mayarí', 163.800, 167.800),
(78, 9, '', 28, NULL, 'De alto Cedro voy para Marcané', 167.800, 173.600),
(79, 9, '', 29, NULL, 'Llego a Cueto, voy para Mayarí', 242.751, 246.486),
(148, 12, '', 0, NULL, 'Mama take this badge from me', 0.000, 0.000),
(149, 12, '', 1, NULL, 'I can\'t use it anymore', 0.000, 0.000),
(150, 12, '', 2, NULL, 'It\'s getting dark too dark to see', 0.000, 0.000),
(151, 12, '', 3, NULL, 'Feels like I\'m knockin\' on Heaven\'s door', 0.000, 0.000),
(152, 12, '', 4, NULL, 'Knock-knock-knockin\' on Heaven\'s door', 0.000, 0.000),
(153, 12, '', 5, NULL, 'Knock-knock-knockin\' on Heaven\'s door', 0.000, 0.000),
(154, 12, '', 6, NULL, 'Knock-knock-knockin\' on Heaven\'s door\r\nKnock-knock-knockin\' on Heaven\'s door\r\nMama put my guns in the ground\r\nI can\'t shoot them anymore\r\nThat cold black cloud is comin\' down\r\nFeels like I\'m knockin\' on Heaven\'s door\r\nKnock-knock-knockin\' on Heaven\'s door\r\nKnock-knock-knockin\' on Heaven\'s door\r\nKnock-knock-knockin\' on Heaven\'s door\r\nKnock-knock-knockin\' on Heaven\'s door\r\n\"You just better start sniffin\' your own rank subjugation jack\r\n\'Cause it\'s just you against your tattered libido\r\nThe bank and the mortician, forever man\r\nAnd it wouldn\'t be luck if you could get out of life alive\"\r\nKnock-knock-knockin\' on Heaven\'s door\r\n(Knock-knock-knockin\' on Heaven\'s door)\r\nKnock-knock-knockin\' on Heaven\'s door\r\n(Knock-knock-knockin\' on Heaven\'s door)\r\nKnock-knock-knockin\' on Heaven\'s door\r\n(Knock-knock-knockin\' on Heaven\'s door)\r\nKnock-knock-knockin\' on Heaven\'s door\r\n(Knock-knock-knockin\' on Heaven\'s door)\r\nKnock-knock-knockin\' on Heaven\'s door\r\nKnock-knock-knockin\' on Heaven\'s door\r\nKnock-knock-knockin\' on Heaven\'s door\r\nKnock-knock-knockin\' on Heaven\'s door', 0.000, 0.000),
(220, 8, '', 0, NULL, 'In the town where I was born', 0.000, 0.000),
(221, 8, '', 1, NULL, 'Lived a man who sailed to sea', 0.000, 0.000),
(222, 8, '', 2, NULL, 'And he told us of his life', 0.000, 0.000),
(223, 8, '', 3, NULL, 'In the land of submarines', 0.000, 0.000),
(224, 8, '', 4, NULL, '\"So, we sailed on to the sun', 0.000, 0.000),
(225, 8, '', 5, NULL, '\'Til we found a sea of green', 0.000, 0.000),
(226, 8, '', 6, NULL, 'And we lived beneath the waves', 0.000, 0.000),
(227, 8, '', 7, NULL, 'In our yellow submarine\"', 0.000, 0.000),
(228, 8, '', 8, NULL, 'We all live in a yellow submarine', 0.000, 0.000),
(229, 8, '', 9, NULL, 'Yellow submarine, yellow submarine', 0.000, 0.000),
(230, 8, '', 10, NULL, 'We all live in a yellow submarine', 0.000, 0.000),
(231, 8, '', 11, NULL, 'Yellow submarine, yellow submarine', 0.000, 0.000),
(232, 8, '', 12, NULL, '\"And our friends are all aboard', 0.000, 0.000),
(233, 8, '', 13, NULL, 'Many more of them live next door', 0.000, 0.000),
(234, 8, '', 14, NULL, 'And the band begins to play\"', 0.000, 0.000),
(235, 8, '', 15, NULL, 'We all live in a yellow submarine', 0.000, 0.000),
(236, 8, '', 16, NULL, 'Yellow submarine, yellow submarine', 0.000, 0.000),
(237, 8, '', 17, NULL, 'We all live in a yellow submarine', 0.000, 0.000),
(238, 8, '', 18, NULL, 'Yellow submarine, yellow submarine', 0.000, 0.000),
(239, 8, '', 19, NULL, '\"As we live a life of ease (a life of ease)', 0.000, 0.000),
(240, 8, '', 20, NULL, 'Every one of us (every one of us)', 0.000, 0.000),
(241, 8, '', 21, NULL, 'Has all we need (has all we need)', 0.000, 0.000),
(242, 8, '', 22, NULL, 'Sky of blue (sky of blue)', 0.000, 0.000),
(243, 8, '', 23, NULL, 'And sea of green (sea of green)', 0.000, 0.000),
(244, 8, '', 24, NULL, 'In our yellow (in our yellow)', 0.000, 0.000),
(245, 8, '', 25, NULL, 'Submarine\" (submarine, aha)', 0.000, 0.000),
(246, 8, '', 26, NULL, 'We all live in a yellow submarine', 0.000, 0.000),
(247, 8, '', 27, NULL, 'A yellow submarine, yellow submarine', 0.000, 0.000),
(248, 8, '', 28, NULL, 'We all live in a yellow submarine', 0.000, 0.000),
(249, 8, '', 29, NULL, 'A yellow submarine, yellow submarine', 0.000, 0.000),
(250, 8, '', 30, NULL, 'We all live in a yellow submarine', 0.000, 0.000),
(251, 8, '', 31, NULL, 'Yellow submarine, yellow submarine', 0.000, 0.000),
(252, 8, '', 32, NULL, 'We all live in a yellow submarine', 0.000, 0.000),
(253, 8, '', 33, NULL, 'Yellow submarine, yellow submarine', 0.000, 0.000),
(254, 4, '', 0, NULL, 'Day off in Kyoto', 7.019, 8.988),
(255, 4, '', 1, NULL, 'Got bored at the temple', 8.988, 10.563),
(256, 4, '', 2, NULL, 'Looked around at the 7-Eleven', 10.563, 14.385),
(257, 4, '', 3, NULL, 'The band took the speed train', 14.447, 16.292),
(258, 4, '', 4, NULL, 'Went to the arcade', 16.292, 17.980),
(259, 4, '', 5, NULL, 'I wanted to go, but I didn\'t', 18.180, 20.780),
(260, 4, '', 6, NULL, 'You called me from a payphone', 21.480, 23.480),
(261, 4, '', 7, NULL, 'They still got payphones', 23.780, 25.626),
(262, 4, '', 8, NULL, 'It cost a dollar a minute', 25.626, 28.330),
(263, 4, '', 9, NULL, 'To tell me you\'re getting sober', 28.530, 30.877),
(264, 4, '', 10, NULL, 'And you wrote me a letter', 30.877, 32.912),
(265, 4, '', 11, NULL, 'But I don\'t have to read it', 33.197, 37.197),
(266, 4, '', 12, NULL, 'I\'m gonna kill you', 37.574, 41.574),
(267, 4, '', 13, NULL, 'If you don\'t beat me to it', 42.644, 44.991),
(268, 4, '', 14, NULL, 'Dreaming through Tokyo skies', 44.991, 48.991),
(269, 4, '', 15, NULL, 'I wanted to see the world', 67.500, 71.500),
(270, 4, '', 16, NULL, 'Then I flew over the ocean', 72.000, 76.000),
(271, 4, '', 17, NULL, 'And I changed my mind (woo)', 76.500, 80.500),
(272, 4, '', 18, NULL, 'Sunset\'s been a freak show', 81.000, 85.000),
(273, 4, '', 19, NULL, 'On the weekend, so', 85.500, 89.500),
(274, 4, '', 20, NULL, 'I\'ve been driving out to the suburbs', 90.000, 94.000),
(275, 4, '', 21, NULL, 'To park at the Goodwill', 94.500, 98.500),
(276, 4, '', 22, NULL, 'And stare at the chemtrails', 99.000, 103.000),
(277, 4, '', 23, NULL, 'With my little brother', 103.500, 107.500),
(278, 4, '', 24, NULL, 'He said you called on his birthday', 108.000, 112.000),
(279, 4, '', 25, NULL, 'You were off by like ten days', 112.500, 116.500),
(280, 4, '', 26, NULL, 'But you get a few points for tryin\'', 117.000, 121.000),
(281, 4, '', 27, NULL, 'Remember getting the truck fixed', 121.500, 125.500),
(282, 4, '', 28, NULL, 'When you let us drive it', 126.000, 130.000),
(283, 4, '', 29, NULL, 'Twenty-five felt like flying', 130.500, 134.500),
(284, 4, '', 30, NULL, 'I don\'t forgive you', 135.000, 139.000),
(285, 4, '', 31, NULL, 'But please don\'t hold me to it', 139.500, 143.500),
(286, 4, '', 32, NULL, 'Born under Scorpio skies', 144.000, 148.000),
(287, 4, '', 33, NULL, 'I wanted to see the world', 148.500, 152.500),
(288, 4, '', 34, NULL, 'Through your eyes until it happened', 153.000, 157.000),
(289, 4, '', 35, NULL, 'Then I changed my mind', 157.500, 161.500),
(290, 4, '', 36, NULL, 'Guess I lied', 162.000, 166.000),
(291, 4, '', 37, NULL, 'I\'m a liar', 166.500, 170.500),
(292, 4, '', 38, NULL, 'Who lies', 171.000, 175.000),
(293, 4, '', 39, NULL, '\'Cause I\'m a liar', 175.500, 179.500),
(319, 5, '', 0, NULL, 'Come along with me', 1.712, 4.500),
(320, 5, '', 1, NULL, 'And the butterflies and bees', 5.721, 9.000),
(321, 5, '', 2, NULL, 'We can wander through the forest', 9.700, 13.500),
(322, 5, '', 3, NULL, 'And do so as we please', 13.700, 17.600),
(323, 5, '', 4, NULL, 'Come along with me', 17.700, 21.700),
(324, 5, '', 5, NULL, 'To a cliff under a tree', 21.700, 25.700),
(325, 5, '', 6, NULL, 'Where we can gaze upon the water', 25.700, 29.700),
(326, 5, '', 7, NULL, 'As an everlasting dream', 29.700, 33.700),
(327, 5, '', 8, NULL, 'All of my collections', 36.000, 40.000),
(328, 5, '', 9, NULL, 'I\'ll share them all with you', 40.500, 44.500),
(329, 5, '', 10, NULL, 'Maybe by next summer', 45.000, 49.000),
(330, 5, '', 11, NULL, 'We won\'t have changed our tunes', 49.500, 53.500),
(331, 5, '', 12, NULL, 'We\'ll still want to be', 54.000, 58.000),
(332, 5, '', 13, NULL, 'With the butterflies and bees', 58.500, 62.500),
(333, 5, '', 14, NULL, 'Making up new numbers', 63.000, 67.000),
(334, 5, '', 15, NULL, 'And living so merrily', 67.500, 71.500),
(335, 5, '', 16, NULL, 'All of my collections', 72.000, 76.000),
(336, 5, '', 17, NULL, 'I\'ll share them all with you', 76.500, 80.500),
(337, 5, '', 18, NULL, 'I\'ll be here for you always', 81.000, 85.000),
(338, 5, '', 19, NULL, 'And always be with you', 85.500, 89.500),
(339, 5, '', 20, NULL, 'Come along with me', 90.000, 94.000),
(340, 5, '', 21, NULL, 'And the butterflies and bees', 94.500, 98.500),
(341, 5, '', 22, NULL, 'We can wander through the forest', 99.000, 103.000),
(342, 5, '', 23, NULL, 'And do so as we please', 103.500, 107.500),
(343, 5, '', 24, NULL, 'Living so merrily', 108.000, 112.000),
(344, 3, '', 0, NULL, 'Don\'t you know', 0.000, 4.000),
(345, 3, '', 1, NULL, 'They\'re talking about a revolution?', 4.500, 8.500),
(346, 3, '', 2, NULL, 'It sounds like a whisper', 9.000, 13.000),
(347, 3, '', 3, NULL, 'Don\'t you know', 13.500, 17.500),
(348, 3, '', 4, NULL, 'Talking about a revolution?', 18.000, 22.000),
(349, 3, '', 5, NULL, 'It sounds like a whisper', 22.500, 26.500),
(350, 3, '', 6, NULL, 'While they\'re standing in the welfare lines', 27.000, 31.000),
(351, 3, '', 7, NULL, 'Crying at the doorsteps of those armies of salvation', 31.500, 35.500),
(352, 3, '', 8, NULL, 'Wasting time in the unemployment lines', 36.000, 40.000),
(353, 3, '', 9, NULL, 'Sitting around waiting for a promotion', 40.500, 44.500),
(354, 3, '', 10, NULL, 'Don\'t you know', 45.000, 49.000),
(355, 3, '', 11, NULL, 'Talking about a revolution?', 49.500, 53.500),
(356, 3, '', 12, NULL, 'It sounds like a whisper', 54.000, 58.000),
(357, 3, '', 13, NULL, 'Poor people gonna rise up', 58.500, 62.500),
(358, 3, '', 14, NULL, 'And get their share', 63.000, 67.000),
(359, 3, '', 15, NULL, 'Poor people gonna rise up', 67.500, 71.500),
(360, 3, '', 16, NULL, 'And take what\'s theirs', 72.000, 76.000),
(361, 3, '', 17, NULL, 'Don\'t you know you better run, run, run, run, run, run', 76.500, 80.500),
(362, 3, '', 18, NULL, 'Run, run, run, run, run, run', 81.000, 85.000),
(363, 3, '', 19, NULL, 'Oh, I said you better run, run, run, run, run, run', 85.500, 89.500),
(364, 3, '', 20, NULL, 'Run, run, run, run, run, run', 90.000, 94.000),
(365, 3, '', 21, NULL, '\'Cause finally the tables are starting to turn', 94.500, 98.500),
(366, 3, '', 22, NULL, 'Talkin\' \'bout a revolution', 99.000, 103.000),
(367, 3, '', 23, NULL, '\'Cause finally the tables are starting to turn', 103.500, 107.500),
(368, 3, '', 24, NULL, 'Talkin\' \'bout a revolution, oh no', 108.000, 112.000),
(369, 3, '', 25, NULL, 'Talkin\' \'bout a revolution, oh', 112.500, 116.500),
(370, 3, '', 26, NULL, 'I\'ve been standing in the welfare lines', 117.000, 121.000),
(371, 3, '', 27, NULL, 'Crying at the doorsteps of those armies of salvation', 121.500, 125.500),
(372, 3, '', 28, NULL, 'Wasting time in the unemployment lines', 126.000, 130.000),
(373, 3, '', 29, NULL, 'Sitting around waiting for a promotion', 130.500, 134.500),
(374, 3, '', 30, NULL, 'Don\'t you know', 135.000, 139.000),
(375, 3, '', 31, NULL, 'Talking about a revolution?', 139.500, 143.500),
(376, 3, '', 32, NULL, 'It sounds like a whisper', 144.000, 148.000),
(377, 3, '', 33, NULL, 'And finally the tables are starting to turn', 148.500, 152.500),
(378, 3, '', 34, NULL, 'Talkin\' \'bout a revolution', 153.000, 157.000),
(379, 3, '', 35, NULL, 'Yes, finally the tables are starting to turn', 157.500, 161.500),
(380, 3, '', 36, NULL, 'Talkin\' \'bout a revolution, oh, no', 162.000, 166.000),
(381, 3, '', 37, NULL, 'Talkin\' \'bout a revolution, oh, no', 166.500, 170.500),
(382, 3, '', 38, NULL, 'Talkin\' \'bout a revolution, oh, no', 171.000, 175.000),
(519, 10, '', 0, NULL, 'Ooh, yeah!', 7.988, 9.028),
(520, 10, '', 1, NULL, 'Alright.', 11.132, 12.144),
(521, 10, '', 2, NULL, 'We\'re jammin\'', 16.628, 18.140),
(522, 10, '', 3, NULL, '(see)', 19.353, 20.820),
(523, 10, '', 4, NULL, 'I wanna jam it wid you', 21.126, 23.626),
(524, 10, '', 5, NULL, 'We\'re jammin\',', 24.209, 25.995),
(525, 10, '', 6, NULL, 'And I hope you like jammin\', too', 27.769, 30.569),
(526, 10, '', 7, NULL, 'We\'re jammin\'', 39.000, 41.500),
(527, 10, '', 8, NULL, 'To think that jammin\' was a thing of the past', 41.500, 44.000),
(528, 10, '', 9, NULL, 'We\'re jammin\',', 44.000, 46.500),
(529, 10, '', 10, NULL, 'And I hope this jam is gonna last', 46.500, 49.000),
(530, 10, '', 11, NULL, 'Jammin\' \'til the jam is though', 49.500, 53.500),
(531, 10, '', 12, NULL, 'Jammin\'', 54.000, 58.000),
(532, 10, '', 13, NULL, 'Jammin\'', 58.500, 62.500),
(533, 10, '', 14, NULL, 'Jammin\'', 63.000, 67.000),
(534, 10, '', 15, NULL, 'Jammin\'', 67.500, 71.500),
(535, 10, '', 16, NULL, 'Now we\'re jammin\' in the name of the Lord', 72.000, 76.000),
(536, 10, '', 17, NULL, 'We\'re jammin\',', 76.500, 80.500),
(537, 10, '', 18, NULL, 'Jammin\'', 81.000, 85.000),
(538, 10, '', 19, NULL, 'Jammin\'', 85.500, 89.500),
(539, 10, '', 20, NULL, 'Jammin\'', 90.000, 94.000),
(540, 10, '', 21, NULL, 'Now we\'re jammin\' right straight from yard', 94.500, 98.500),
(541, 10, '', 22, NULL, 'Ooh, yeah!', 99.000, 103.000),
(542, 10, '', 23, NULL, 'We\'re jammin\'', 103.500, 107.500),
(543, 10, '', 24, NULL, 'I wanna jam it wid you', 108.000, 112.000),
(544, 10, '', 25, NULL, 'We\'re jammin\', jammin\',', 112.500, 116.500),
(545, 10, '', 26, NULL, 'And I hope you like jammin\', too', 117.000, 121.000),
(546, 10, '', 27, NULL, 'Jam\'s about my pride and truth I cannot hide', 121.500, 125.500),
(547, 10, '', 28, NULL, 'To keep you satisfied', 126.000, 130.000),
(548, 10, '', 29, NULL, 'Love that now exist, true love I can\'t resist,', 130.500, 134.500),
(549, 10, '', 30, NULL, 'Jam by my side. Oh, yea-ea-yeah!', 135.000, 139.000),
(550, 10, '', 31, NULL, 'We\'re jammin\'', 139.500, 143.500),
(551, 10, '', 32, NULL, '(see)', 144.000, 148.000),
(552, 10, '', 33, NULL, 'I wanna jam it wid you', 148.500, 152.500),
(553, 10, '', 34, NULL, 'We\'re jammin\', jammin\',', 153.000, 157.000),
(554, 10, '', 35, NULL, 'And I hope you like jammin\', too', 157.500, 161.500),
(555, 10, '', 36, NULL, 'We\'re jammin\'', 162.000, 166.000),
(556, 10, '', 37, NULL, 'To think that jammin\' was a thing of the past', 166.500, 170.500),
(557, 10, '', 38, NULL, 'We\'re jammin\',', 171.000, 175.000),
(558, 10, '', 39, NULL, 'And I hope this jam is gonna last', 175.500, 179.500),
(559, 10, '', 40, NULL, 'We\'re jammin\'', 180.000, 184.000),
(560, 10, '', 41, NULL, 'Jammin\'', 184.500, 188.500),
(561, 10, '', 42, NULL, 'Jammin\'', 189.000, 193.000),
(562, 10, '', 43, NULL, 'Jammin\'', 193.500, 197.500),
(563, 10, '', 44, NULL, 'Now we\'re jammin\' in the name of the Lord', 198.000, 202.000),
(564, 10, '', 45, NULL, 'We\'re jammin\',', 202.500, 206.500),
(565, 10, '', 46, NULL, 'Jammin\'', 207.000, 211.000),
(566, 10, '', 47, NULL, 'Jammin\'', 211.500, 215.500),
(567, 10, '', 48, NULL, 'Jammin\'', 216.000, 220.000),
(568, 10, '', 49, NULL, 'Now we\'re jammin\' right straight from yard', 220.500, 224.500),
(569, 10, '', 50, NULL, 'Ooh, yeah!', 225.000, 229.000),
(570, 10, '', 51, NULL, 'We\'re jammin\'', 229.500, 233.500),
(571, 10, '', 52, NULL, 'I wanna jam it wid you', 234.000, 238.000),
(572, 10, '', 53, NULL, 'We\'re jammin\', jammin\',', 238.500, 242.500),
(573, 10, '', 54, NULL, 'And I hope you like jammin\', too', 243.000, 247.000),
(574, 10, '', 55, NULL, 'We\'re jammin\',', 247.500, 251.500),
(575, 10, '', 56, NULL, 'Jammin\'', 252.000, 256.000),
(576, 10, '', 57, NULL, 'Jammin\'', 256.500, 260.500),
(577, 10, '', 58, NULL, 'Jammin\'', 261.000, 265.000),
(578, 10, '', 59, NULL, 'I wanna jam it wid you', 265.500, 269.500),
(579, 10, '', 60, NULL, 'We\'re jammin\', jammin\',', 270.000, 274.000),
(580, 10, '', 61, NULL, 'And I hope you like jammin\', too', 274.500, 278.500),
(581, 10, '', 62, NULL, 'We\'re jammin\',', 279.000, 283.000),
(582, 10, '', 63, NULL, 'We\'re jammin\',', 283.500, 287.500),
(583, 10, '', 64, NULL, '(see)', 288.000, 292.000),
(584, 10, '', 65, NULL, 'We\'re jammin\',', 292.500, 296.500),
(585, 10, '', 66, NULL, 'We\'re jammin\',', 297.000, 301.000),
(586, 10, '', 67, NULL, 'Oh yeah!', 301.500, 305.500),
(587, 11, '', 0, NULL, '(Help)', 0.000, 0.000),
(588, 11, '', 1, NULL, 'I need somebody', 0.000, 0.000),
(589, 11, '', 2, NULL, '(Help)', 0.000, 0.000),
(590, 11, '', 3, NULL, 'Not just anybody', 0.000, 0.000),
(591, 11, '', 4, NULL, '(Help)', 0.000, 0.000),
(592, 11, '', 5, NULL, 'You know I need someone', 0.000, 0.000),
(593, 11, '', 6, NULL, '(Help)', 0.000, 0.000),
(594, 11, '', 7, NULL, 'When I was younger, so much younger than today', 0.000, 0.000),
(595, 11, '', 8, NULL, 'I never needed anybody\'s help in any way', 0.000, 0.000),
(596, 11, '', 9, NULL, 'But now these days are gone, I\'m not so self assured', 0.000, 0.000),
(597, 11, '', 10, NULL, 'Now I find I\'ve changed my mind and opened up the doors', 0.000, 0.000),
(598, 11, '', 11, NULL, 'Help me if you can, I\'m feeling down', 0.000, 0.000),
(599, 11, '', 12, NULL, 'And I do appreciate you being \'round', 0.000, 0.000),
(600, 11, '', 13, NULL, 'Help me get my feet back on the ground', 0.000, 0.000),
(601, 11, '', 14, NULL, 'Won\'t you please, please help me?', 0.000, 0.000),
(602, 11, '', 15, NULL, 'And now my life has changed in, oh, so many ways', 0.000, 0.000),
(603, 11, '', 16, NULL, 'My independence seems to vanish in the haze', 0.000, 0.000),
(604, 11, '', 17, NULL, 'But every now and then I feel so insecure', 0.000, 0.000),
(605, 11, '', 18, NULL, 'I know that I just need you like I\'ve never done before', 0.000, 0.000),
(606, 11, '', 19, NULL, 'Help me if you can, I\'m feeling down', 0.000, 0.000),
(607, 11, '', 20, NULL, 'And I do appreciate you being \'round', 0.000, 0.000),
(608, 11, '', 21, NULL, 'Help me get my feet back on the ground', 0.000, 0.000),
(609, 11, '', 22, NULL, 'Won\'t you please, please help me?', 0.000, 0.000),
(610, 11, '', 23, NULL, 'When I was younger, so much younger than today', 0.000, 0.000),
(611, 11, '', 24, NULL, 'I never needed anybody\'s help in any way', 0.000, 0.000),
(612, 11, '', 25, NULL, 'But now these days are gone, I\'m not so self assured', 0.000, 0.000),
(613, 11, '', 26, NULL, 'Now I find I\'ve changed my mind and opened up the doors', 0.000, 0.000),
(614, 11, '', 27, NULL, 'Help me if you can, I\'m feeling down', 0.000, 0.000),
(615, 11, '', 28, NULL, 'And I do appreciate you being \'round', 0.000, 0.000),
(616, 11, '', 29, NULL, 'Help me get my feet back on the ground', 0.000, 0.000),
(617, 11, '', 30, NULL, 'Won\'t you please, please help me?', 0.000, 0.000),
(618, 11, '', 31, NULL, 'Help me, help me, oh', 0.000, 0.000);

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
(4, 'Clipto AI video downloader_Bad Gyal - Da Me (Official Video)', 'uploads/hero_videos/1765293826_CliptoAIvideodownloaderBadGyalDaMeOfficialVideo.mp4', 0, 0, '2025-12-09 16:23:46'),
(7, 'Bob Marley & The Wailers - Jamming (Official Music Video)', 'uploads/hero_videos/1765296657_BobMarleyTheWailersJammingOfficialMusicVideo.mp4', 0, 0, '2025-12-09 17:10:57'),
(8, 'YTDown.com_YouTube_Calvin-Harris-Feels-Official-Video-ft-Ph_Media_ozv4q2ov3Mk_001_1080p', 'uploads/hero_videos/1765485450_YTDowncomYouTubeCalvinHarrisFeelsOfficialVideoftPhMediaozv4q2ov3Mk0011080p.mp4', 0, 0, '2025-12-11 21:37:30'),
(10, '07', 'uploads/hero_videos/1765903549_07.gif', 1, 0, '2025-12-16 17:45:49');

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
(4, 'hashtag', 'pop', 'lascanciondelosbeatles', 3, 0),
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
(32, 3, 6),
(15, 3, 7),
(26, 3, 8),
(34, 3, 9),
(33, 3, 10),
(36, 3, 11),
(29, 4, 4),
(30, 4, 9);

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
-- Estructura de tabla para la tabla `like_version`
--

CREATE TABLE `like_version` (
  `id_like_version` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_version` int(11) NOT NULL
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
(8, 3, 5),
(7, 4, 3),
(6, 4, 5),
(5, 5, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `song_sections`
--

CREATE TABLE `song_sections` (
  `id` int(11) NOT NULL,
  `song_id` int(10) UNSIGNED NOT NULL,
  `label` varchar(255) DEFAULT 'Section',
  `start_time` float NOT NULL,
  `end_time` float NOT NULL,
  `chords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`chords`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `song_sections`
--

INSERT INTO `song_sections` (`id`, `song_id`, `label`, `start_time`, `end_time`, `chords`, `created_at`) VALUES
(2, 3, 'Section 1', 0, 8, '[{\"name\":\"G\"},{\"name\":\"Cadd9\"},{\"name\":\"Em\"},{\"name\":\"D\"},{\"name\":\"Dsus4\"}]', '2025-12-14 13:07:03');

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
  `rol` varchar(20) NOT NULL DEFAULT 'user',
  `configuracion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`configuracion`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `email`, `foto_perfil`, `password_hash`, `fecha_registro`, `bio`, `banner`, `rol`, `configuracion`) VALUES
(3, 'alberto', 'alberto16166@alumnos.ilerna.com', 'uploads/avatars/1764682451_avatars_ProyectoEliminarfondo1.png', '$2y$10$YGafVC3K8G0lxWGQfJQooua0.EYe09WJvug/yLLiyDr3IxB.fTU2G', '2025-12-02 13:30:27', 'Music lover. Beginner Guitarist. Founder of Rechord\r\n', 'uploads/banners/1764683938_banners_me_header.png', 'admin', NULL),
(4, 'albertospotifyjun15', 'albertospotifyjun15@gmail.com', 'uploads/avatars/1765110819_avatars_bad-bunny-1-41e695b929cc492c835376cfbf3504ae.jpg', '$2y$10$sj1.PyTnYqieUO/5WuGsUehWrYku6YBtU/3rqAGnNf4TszbF4fMaS', '2025-12-07 12:10:03', 'hola est', 'uploads/banners/1765110819_banners_hero.jpg', 'user', NULL),
(5, 'esteponcio', 'jaimeestgom@gmail.com', 'uploads/avatars/1765149556_avatars_8268c2d351c1ec3.png', '$2y$10$y6ftuCpWXEv19eDcejhb1ubJnn7NFZmHB3nvIsNyz2fevMWzIBOWu', '2025-12-07 23:15:40', '', 'uploads/banners/1765149480_banners_71rzlQ2XMOL.jpg', 'user', NULL),
(6, 'Taylor Jones', 'taylor@gmail.com', 'uploads/avatars/1765283478_avatars_istockphoto-1485546774-612x612.jpg', '$2y$10$qa6XgZizacKzSIwU4EpBKeeRlbxhW92kfmlxAMrA4ghBzN9jWK3lO', '2025-12-09 12:28:58', '', NULL, 'user', NULL),
(7, 'Sergio Montes', 'smontes@ilerna.com', NULL, '$2y$10$7e8GzvguXk9TCcfM0cpppOOhigsBlA8d0.tAoL74lwYyQJ./fgCJ2', '2025-12-09 12:59:42', NULL, NULL, 'user', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `versions`
--

CREATE TABLE `versions` (
  `id_version` int(11) NOT NULL,
  `id_cancion` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `titulo_version` varchar(255) DEFAULT 'Versión Original',
  `contenido_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Contenido estructurado de la versión (acordes, letra, tiempos)',
  `likes` int(11) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ;

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
-- Indices de la tabla `cancion_fondos`
--
ALTER TABLE `cancion_fondos`
  ADD PRIMARY KEY (`id_fondo`),
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
  ADD KEY `idx_chat_mensajes_conversacion` (`id_conversacion`),
  ADD KEY `idx_conversation_fix` (`id_conversacion`);

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
-- Indices de la tabla `like_version`
--
ALTER TABLE `like_version`
  ADD PRIMARY KEY (`id_like_version`),
  ADD UNIQUE KEY `uk_like_version` (`id_usuario`,`id_version`),
  ADD KEY `fk_like_version_version` (`id_version`);

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
-- Indices de la tabla `song_sections`
--
ALTER TABLE `song_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_song_sections_song_id` (`song_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `versions`
--
ALTER TABLE `versions`
  ADD PRIMARY KEY (`id_version`),
  ADD KEY `id_cancion` (`id_cancion`),
  ADD KEY `id_usuario` (`id_usuario`);

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
  MODIFY `id_cancion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `cancion_carpeta`
--
ALTER TABLE `cancion_carpeta`
  MODIFY `id_cancion_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `cancion_fondos`
--
ALTER TABLE `cancion_fondos`
  MODIFY `id_fondo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `carpeta`
--
ALTER TABLE `carpeta`
  MODIFY `id_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `chat_conversaciones`
--
ALTER TABLE `chat_conversaciones`
  MODIFY `id_conversacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `chat_participantes`
--
ALTER TABLE `chat_participantes`
  MODIFY `id_participante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `estrofa`
--
ALTER TABLE `estrofa`
  MODIFY `id_estrofa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=619;

--
-- AUTO_INCREMENT de la tabla `hero_videos`
--
ALTER TABLE `hero_videos`
  MODIFY `id_hero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `home_config`
--
ALTER TABLE `home_config`
  MODIFY `id_config` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `like_cancion`
--
ALTER TABLE `like_cancion`
  MODIFY `id_like` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `like_carpeta`
--
ALTER TABLE `like_carpeta`
  MODIFY `id_like_carpeta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `like_version`
--
ALTER TABLE `like_version`
  MODIFY `id_like_version` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_seguir` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `song_sections`
--
ALTER TABLE `song_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `versions`
--
ALTER TABLE `versions`
  MODIFY `id_version` int(11) NOT NULL AUTO_INCREMENT;

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
-- Filtros para la tabla `cancion_fondos`
--
ALTER TABLE `cancion_fondos`
  ADD CONSTRAINT `cancion_fondos_ibfk_1` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE;

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
-- Filtros para la tabla `like_version`
--
ALTER TABLE `like_version`
  ADD CONSTRAINT `fk_like_version_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_like_version_version` FOREIGN KEY (`id_version`) REFERENCES `versions` (`id_version`) ON DELETE CASCADE;

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

--
-- Filtros para la tabla `song_sections`
--
ALTER TABLE `song_sections`
  ADD CONSTRAINT `song_sections_ibfk_1` FOREIGN KEY (`song_id`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `versions`
--
ALTER TABLE `versions`
  ADD CONSTRAINT `fk_version_cancion` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id_cancion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_version_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
