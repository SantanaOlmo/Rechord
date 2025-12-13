-- Add synchronizer settings to 'cancion' table
-- Settings: tempo (bpm), metrica (numerador/denominador), beat_marker, subdivision, velocity

ALTER TABLE `cancion`
ADD COLUMN `bpm` INT(11) NOT NULL DEFAULT 120,
ADD COLUMN `metrica_numerador` TINYINT(4) NOT NULL DEFAULT 4,
ADD COLUMN `metrica_denominador` TINYINT(4) NOT NULL DEFAULT 4,
ADD COLUMN `beat_marker` DECIMAL(10,3) DEFAULT 0.000 COMMENT 'Punto de anclaje para el grid (segundos)',
ADD COLUMN `subdivision` VARCHAR(10) DEFAULT '1/4' COMMENT 'Subdivisión del grid (1/4, 1/8, etc.)',
ADD COLUMN `velocity` TINYINT(3) UNSIGNED DEFAULT 100 COMMENT 'Velocidad MIDI por defecto';
