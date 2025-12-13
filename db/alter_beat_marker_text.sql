-- Modify beat_marker to support JSON text (for multi-section grid)
ALTER TABLE `cancion` MODIFY COLUMN `beat_marker` TEXT DEFAULT NULL COMMENT 'JSON array of grid regions [{start, end}]';
